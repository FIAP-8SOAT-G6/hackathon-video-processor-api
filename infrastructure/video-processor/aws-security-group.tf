resource "aws_security_group" "video_sg" {
  name        = "video-processor-sg"
  description = "Allow inbound traffic for ECS Fargate tasks"
  vpc_id      = aws_vpc.video-processor-vpc.id

  // Optional: allow HTTP access for debugging
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Required: allow all outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "video-processor-sg"
  }
}

output "security_group_id" {
  value = aws_security_group.video_sg.id
}
