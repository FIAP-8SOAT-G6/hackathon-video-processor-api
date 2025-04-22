data "aws_ecr_repository" "pre_signed_url" {
  name = "video-processor-hackathon/upload-api"
}

data "aws_ecr_repository" "list_processing_status" {
  name = "video-processor-hackathon/list-processing-status"
}

resource "aws_lambda_function" "pre_signed_url-lambda" {
  function_name = var.pre_signed_url-lambda_name
  role          = data.aws_iam_role.lab-role.arn
  package_type  = "Image"
  description   = "Lambda function to generate presigned URLs for S3 bucket"

  image_uri   = "${data.aws_ecr_repository.pre_signed_url.repository_url}:${var.image_tag}"
  timeout     = 15
  memory_size = 512

  environment {
    variables = {
      BUCKET_NAME = var.bucket_name
    }
  }
}

resource "aws_lambda_function" "list_processing_status-lambda" {
  function_name = var.list_processing_status-lambda_name
  role          = data.aws_iam_role.lab-role.arn
  package_type  = "Image"
  description   = "Lambda function to list processing statuses"

  image_uri   = "${data.aws_ecr_repository.list_processing_status.repository_url}:${var.image_tag}"
  timeout     = 15
  memory_size = 512

  environment {
    variables = {
      BUCKET_NAME = var.bucket_name
    }
  }
}

data "aws_iam_role" "lab-role" {
  name = "LabRole"
}
