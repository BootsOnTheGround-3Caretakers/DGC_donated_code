import os
import google
from google.cloud import secretmanager_v1beta1 as secretmanager


def get_secret_value(secret_id, default=None, raise_exception=True):
    try:
        project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
        version_id = 1

        client = secretmanager.SecretManagerServiceClient()

        name = client.secret_version_path(project_id, secret_id, version_id)
        response = client.access_secret_version(name)

        return response.payload.data.decode('UTF-8')
    except google.api_core.exceptions.NotFound:
        if default is None and raise_exception:
            raise

        return default


def get_redis_host():
    return get_secret_value("REDIS_HOST")


def get_redis_port():
    return get_secret_value("REDIS_PORT")


def get_stripe_api_secret_key():
    return get_secret_value("STRIPE_API_SECRET_KEY")


def get_stripe_webhook_signing_secret():
    return get_secret_value("STRIPE_WEBHOOK_SIGNING_SECRET")
