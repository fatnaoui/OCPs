import os

def validate_env_vars(*vars):
    """Ensure all required environment variables exist."""
    for var in vars:
        if not os.getenv(var):
            raise ValueError(f"Missing environment variable: {var}")