#!/bin/sh
set -e

LOCALSTACK_ENDPOINT="${AWS_ENDPOINT:-http://localstack:4566}"

echo "⏳ Waiting for LocalStack to be ready at $LOCALSTACK_ENDPOINT..."

until wget -qO- "$LOCALSTACK_ENDPOINT/_localstack/health" | grep -q '"s3": *"running"'; do
  echo "🔄 Still waiting for LocalStack..."
  sleep 2
done

echo "✅ LocalStack is ready!"
