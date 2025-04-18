resource "aws_ecr_repository" "video-processor-api" {
  name                 = var.repositoryName
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "ecr_repository" {
  value = var.repositoryName
}