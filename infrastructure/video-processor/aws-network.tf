resource "aws_vpc" "video-processor-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "video-processor-vpc"
  }
}

resource "aws_subnet" "video-processor-subnet-1a" {
  vpc_id                  = aws_vpc.video-processor-vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name" = "video-processor-subnet-1a"
  }
}

resource "aws_subnet" "video-processor-subnet-1b" {
  vpc_id                  = aws_vpc.video-processor-vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "video-processor-subnet-1b"
  }
}

resource "aws_internet_gateway" "video-processor-igw" {
  vpc_id = aws_vpc.video-processor-vpc.id

  tags = {
    Name = "video-processor-igw"
  }
}

resource "aws_route_table" "video-processor-route-table" {
  vpc_id = aws_vpc.video-processor-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.video-processor-igw.id
  }

  tags = {
    Name = "video-processor-route-table"
  }
}

resource "aws_route_table_association" "subnet-1a-association" {
  subnet_id      = aws_subnet.video-processor-subnet-1a.id
  route_table_id = aws_route_table.video-processor-route-table.id
}

resource "aws_route_table_association" "subnet-1b-association" {
  subnet_id      = aws_subnet.video-processor-subnet-1b.id
  route_table_id = aws_route_table.video-processor-route-table.id
}

output "subnet_ids" {
  value = [aws_subnet.video-processor-subnet-1a.id, aws_subnet.video-processor-subnet-1b.id]
}

output "vpc_id" {
  value = aws_vpc.video-processor-vpc.id
}
