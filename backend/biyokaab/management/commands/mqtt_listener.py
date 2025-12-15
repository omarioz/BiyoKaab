"""
Django management command to connect to MQTT broker and save IoT telemetry data.

Usage: python manage.py mqtt_listener

This command:
- Connects to Mosquitto MQTT broker (localhost:1883)
- Subscribes to biyokaab/+/telemetry topics
- Receives JSON sensor data
- Saves it to Django database using SensorReading model
"""
import json
import logging
from django.core.management.base import BaseCommand

try:
    import paho.mqtt.client as mqtt
    MQTT_AVAILABLE = True
except ImportError:
    MQTT_AVAILABLE = False
    mqtt = None

from biyokaab.models import SensorReading


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

            # Save to database using Django ORM
            try:
                sensor_reading = SensorReading.objects.create(
                    device_id=device_id,
                    distance_cm=distance_cm,
                    water_level=water_level,
                    humidity=humidity,
                    temperature=temperature,
                )

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
                        f"✓ Saved sensor reading: {sensor_reading.device_id} "
                        f"({fields_info})"
                    )
                )
            except Exception as e:
                self.stderr.write(
                    self.style.ERROR(
                        f"Error saving sensor reading to database: {e}\n"
                        f"Device ID: {device_id}"
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

