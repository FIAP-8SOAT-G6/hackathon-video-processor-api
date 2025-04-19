resource "aws_ecr_repository" "upload-api" {
  name                 = var.upload-api-repository-name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "upload-api-repository-name" {
  value = var.upload-api-repository-name
}

resource "aws_ecr_repository" "list-processing-api" {
  name                 = var.list-processing-status-repository-name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "ecr_repository" {
  value = var.list-processing-status-repository-name
}
