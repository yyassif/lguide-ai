import os
import boto3
from botocore.exceptions import NoCredentialsError

class S3ImageUploader:
    def __init__(self):
        aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID', "")
        aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY', "")
        region_name = os.getenv('AWS_REGION_NAME', "")
        bucket_name = os.getenv('AWS_BUCKET_NAME', "")
        self.s3 = boto3.client('s3',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )
        self.bucket_name = bucket_name
    
    def upload_image(self, image_data, file_name, content_type='image/jpeg'):
        try:
            self.s3.put_object(Bucket=self.bucket_name, Key=file_name, Body=image_data, ContentType=content_type)
            url = f"https://{self.bucket_name}.s3.amazonaws.com/{file_name}"
            return url
        except NoCredentialsError:
            print("Credentials not available")
            return "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png"


uploader = S3ImageUploader()