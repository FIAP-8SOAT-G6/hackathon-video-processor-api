data "aws_s3_bucket" "video-processor" {
  bucket = "soat8-g6-hackathon-video-processor-vitor"
}

data "aws_iam_role" "lab-role" {
  name = "LabRole"
}

resource "aws_ecs_cluster" "video-processor" {
  name = "video-processor-cluster"
}

data "aws_ecr_repository" "video-fargate" {
  name = "video-fargate"
}

resource "aws_cloudwatch_log_group" "video_processor_logs" {
  name              = "/ecs/video-processor"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "video-processor" {
  family                   = "video-processor"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = data.aws_iam_role.lab-role.arn
  task_role_arn            = data.aws_iam_role.lab-role.arn

  container_definitions = jsonencode([
    {
      name      = "video-processor"
      image     = "${data.aws_ecr_repository.video-fargate.repository_url}:latest"
      essential = true
      environment = [
        {
          name  = "BUCKET_NAME",
          value = data.aws_s3_bucket.video-processor.id
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/video-processor"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

resource "aws_cloudwatch_event_target" "run_fargate" {
  rule     = aws_cloudwatch_event_rule.s3_mp4_upload.name
  role_arn = data.aws_iam_role.lab-role.arn
  arn      = aws_ecs_cluster.video-processor.arn

  ecs_target {
    task_definition_arn = aws_ecs_task_definition.video-processor.arn
    launch_type         = "FARGATE"
    network_configuration {
      subnets          = [aws_subnet.video-processor-subnet-1a.id, aws_subnet.video-processor-subnet-1b.id]
      security_groups  = [aws_security_group.video_sg.id]
      assign_public_ip = true
    }
  }
}
