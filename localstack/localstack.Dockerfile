FROM localstack/localstack:3

COPY init-s3.sh /etc/localstack/init/ready.d/s3-setup.sh
RUN chmod +x /etc/localstack/init/ready.d/s3-setup.sh
