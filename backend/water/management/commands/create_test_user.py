"""
Django management command to create a test user and profile for AI chat testing.
Usage: python manage.py create_test_user
"""
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from water.models import UserProfile


class Command(BaseCommand):
    help = 'Creates a test user and UserProfile for AI chat testing'

    def handle(self, *args, **options):
        username = 'testuser'
        password = 'testpass123'
        
        # Create or get user
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User',
            }
        )
        
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created user: {username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'User {username} already exists')
            )
        
        # Create or get UserProfile
        profile, profile_created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'user_type': UserProfile.UserType.FARMER,
            }
        )
        
        if profile_created:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created UserProfile for {username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'UserProfile for {username} already exists')
            )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nTest user created successfully!\n'
                f'Username: {username}\n'
                f'Password: {password}\n'
                f'User ID: {user.id}\n'
                f'Profile ID: {profile.id}\n'
                f'\nUse user_id="{user.id}" in your frontend API calls.'
            )
        )





