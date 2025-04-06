#!/bin/sh

echo "Initializing Localstack S3"

awslocal s3api create-bucket --region us-east-1 --bucket hackathon-fiap