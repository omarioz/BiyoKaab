"""
Django management command to connect to MQTT broker and save IoT telemetry data.

Usage: python manage.py mqtt_listener

This command:
- Connects to Mosquitto MQTT broker (localhost:1883)
- Subscribes to biyokaab/+/telemetry topics
- Receives JSON sensor data
- Saves it to Django database using water.SensorReading model
- Auto-creates Sensor if it doesn't exist
"""
import json
import logging
import traceback
from django.core.management.base import BaseCommand
from django.db import transaction, close_old_connections

try:
    import paho.mqtt.client as mqtt
    MQTT_AVAILABLE = True
except ImportError:
    MQTT_AVAILABLE = False
    mqtt = None

from water.models import Sensor, SensorReading


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Connects to MQTT broker and saves IoT telemetry data to database"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = None
        self.connected = False

    def add_arguments(self, parser):
        """Add command-line arguments."""
        parser.add_argument(
            "--broker",
            type=str,
            default="localhost",
            help="MQTT broker hostname (default: localhost)",
        )
        parser.add_argument(
            "--port",
            type=int,
            default=1883,
            help="MQTT broker port (default: 1883)",
        )
        parser.add_argument(
            "--keepalive",
            type=int,
            default=60,
            help="MQTT keepalive interval in seconds (default: 60)",
        )
        parser.add_argument(
            "--topic",
            type=str,
            default="biyokaab/+/telemetry",
            help="MQTT topic pattern to subscribe to (default: biyokaab/+/telemetry)",
        )

    def handle(self, *args, **options):
        """Main command handler."""
        # Check if paho-mqtt is installed
        if not MQTT_AVAILABLE:
            self.stderr.write(
                self.style.ERROR(
                    "paho-mqtt is not installed. Please install it with: pip install paho-mqtt"
                )
            )
            return

        broker = options["broker"]
        port = options["port"]
        keepalive = options["keepalive"]
        topic = options["topic"]

        self.stdout.write(
            self.style.SUCCESS(
                f"Starting MQTT listener...\n"
                f"  Broker: {broker}:{port}\n"
                f"  Topic: {topic}\n"
                f"  Keepalive: {keepalive}s\n"
            )
        )

        # Create MQTT client
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect

        try:
            # Connect to broker
            self.stdout.write(f"Connecting to {broker}:{port}...")
            self.client.connect(broker, port, keepalive)
            self.stdout.write(self.style.SUCCESS("Connected successfully!"))

            # Start the loop (blocks forever)
            self.stdout.write("Listening for messages. Press Ctrl+C to stop.")
            self.client.loop_forever()

        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("\nShutting down..."))
            if self.client:
                self.client.disconnect()
            self.stdout.write(self.style.SUCCESS("MQTT listener stopped."))
        except Exception as e:
            self.stderr.write(
                self.style.ERROR(f"Error connecting to MQTT broker: {e}")
            )
            raise

    def on_connect(self, client, userdata, flags, rc):
        """
        Callback when the client receives a CONNACK response from the server.

        Args:
            client: The client instance
            userdata: Private user data
            flags: Response flags
            rc: Connection result code (0 = success)
        """
        if rc == 0:
            self.connected = True
            self.stdout.write(
                self.style.SUCCESS(f"Connected to MQTT broker (code: {rc})")
            )

            # Subscribe to telemetry topics
            topic = "biyokaab/+/telemetry"
            client.subscribe(topic)
            self.stdout.write(
                self.style.SUCCESS(f"Subscribed to topic: {topic}")
            )
        else:
            self.connected = False
            self.stderr.write(
                self.style.ERROR(f"Failed to connect to MQTT broker (code: {rc})")
            )

    def on_message(self, client, userdata, msg):
        """
        Callback when a PUBLISH message is received from the server.

        Args:
            client: The client instance
            userdata: Private user data
            msg: The message object with topic, payload, qos, retain
        """
        # Close old database connections to prevent issues in long-running processes
        close_old_connections()
        
        try:
            # Decode message payload
            payload_str = msg.payload.decode("utf-8")
            topic = msg.topic

            self.stdout.write(
                f"\nReceived message from {topic}:\n{payload_str}"
            )

            # Parse JSON
            try:
                data = json.loads(payload_str)
            except json.JSONDecodeError as e:
                self.stderr.write(
                    self.style.ERROR(
                        f"Invalid JSON in message from {topic}: {e}\n"
                        f"Payload: {payload_str[:100]}"
                    )
                )
                return

            # Validate required fields (only device_id and distance_cm are mandatory)
            required_fields = ["device_id", "distance_cm"]
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                self.stderr.write(
                    self.style.ERROR(
                        f"Missing required fields in message from {topic}: "
                        f"{', '.join(missing_fields)}\n"
                        f"Payload: {payload_str[:100]}"
                    )
                )
                return

            # Extract and validate data types
            try:
                device_id = str(data["device_id"])
                distance_cm = float(data["distance_cm"])
                # Optional fields
                water_level = (
                    float(data["water_level"]) if "water_level" in data else None
                )
                humidity = (
                    float(data["humidity"]) if "humidity" in data else None
                )
                temperature = (
                    float(data["temperature"]) if "temperature" in data else None
                )
            except (ValueError, TypeError) as e:
                self.stderr.write(
                    self.style.ERROR(
                        f"Invalid data types in message from {topic}: {e}\n"
                        f"Payload: {payload_str[:100]}"
                    )
                )
                return

            # Get or create Sensor for this device_id
            # Auto-create if it doesn't exist (system can be None)
            try:
                sensor, created = Sensor.objects.get_or_create(
                    device_id=device_id,
                    defaults={
                        "system": None,
                        "description": f"Auto-created from MQTT on {msg.topic}",
                    }
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f"Created new sensor: {device_id}")
                    )
                else:
                    self.stdout.write(
                        f"Using existing sensor: {device_id} (ID: {sensor.id})"
                    )
            except Exception as e:
                error_traceback = traceback.format_exc()
                self.stderr.write(
                    self.style.ERROR(
                        f"Error getting/creating sensor for {device_id}: {e}\n"
                        f"Traceback:\n{error_traceback}"
                    )
                )
                return

            # Save to database using Django ORM
            # For now, only store distance_cm. Water level calculation will be done later.
            try:
                from decimal import Decimal
                from django.db import transaction

                self.stdout.write(
                    f"Attempting to save reading for sensor ID: {sensor.id}, device_id: {device_id}"
                )

                # Only convert optional fields if they're provided in the message
                # For now, focus on storing distance_cm only
                water_level_decimal = None
                if water_level is not None:
                    water_level_decimal = Decimal(str(water_level))

                humidity_decimal = None
                if humidity is not None:
                    humidity_decimal = Decimal(str(humidity))

                temperature_decimal = None
                if temperature is not None:
                    temperature_decimal = Decimal(str(temperature))

                # Use transaction to ensure data is saved
                with transaction.atomic():
                    sensor_reading = SensorReading.objects.create(
                        sensor=sensor,
                        distance_cm=distance_cm,  # Primary field - always saved
                        water_level=water_level_decimal,  # Optional - only if in message
                        humidity=humidity_decimal,  # Optional - only if in message
                        temperature=temperature_decimal,  # Optional - only if in message
                    )

                # Verify the reading was created
                if sensor_reading.id:
                    # Build success message with available fields
                    fields_info = f"distance_cm={distance_cm}"
                    if water_level is not None:
                        fields_info += f", water_level={water_level}"
                    if humidity is not None:
                        fields_info += f", humidity={humidity}"
                    if temperature is not None:
                        fields_info += f", temperature={temperature}"

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"✓ Saved sensor reading ID {sensor_reading.id} for {sensor.device_id} "
                            f"(distance_cm={distance_cm})"
                        )
                    )
                else:
                    self.stderr.write(
                        self.style.ERROR(
                            f"Failed to save sensor reading: No ID returned\n"
                            f"Device ID: {device_id}"
                        )
                    )
            except Exception as e:
                # Print full traceback for debugging
                error_traceback = traceback.format_exc()
                self.stderr.write(
                    self.style.ERROR(
                        f"Error saving sensor reading to database: {e}\n"
                        f"Device ID: {device_id}\n"
                        f"Traceback:\n{error_traceback}"
                    )
                )

        except Exception as e:
            # Catch any unexpected errors to prevent the listener from crashing
            self.stderr.write(
                self.style.ERROR(
                    f"Unexpected error processing message from {msg.topic}: {e}"
                )
            )

    def on_disconnect(self, client, userdata, rc):
        """
        Callback when the client disconnects from the server.

        Args:
            client: The client instance
            userdata: Private user data
            rc: Disconnect result code
        """
        self.connected = False
        if rc != 0:
            self.stdout.write(
                self.style.WARNING(
                    f"Unexpected disconnection from MQTT broker (code: {rc}). "
                    f"Attempting to reconnect..."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("Disconnected from MQTT broker")
            )

