data "aws_ecr_repository" "presignedurl" {
  name = "video-processor-hackathon/upload-api"
}

data "aws_ecr_repository" "listprocessingstatus" {
  name = "video-processor-hackathon/list-processing-status"
}

resource "aws_lambda_function" "presignedurl-lambda" {
  function_name = var.presignedurl-lambda_name
  role          = data.aws_iam_role.lab-role.arn
  package_type  = "Image"
  description   = "Lambda function to generate presigned URLs for S3 bucket"

  image_uri   = "${data.aws_ecr_repository.presignedurl.repository_url}:${var.image_tag}"
  timeout     = 15
  memory_size = 512

  environment {
    variables = {
      BUCKET_NAME = var.bucket_name
    }
  }
}

resource "aws_lambda_function" "listprocessingstatus-lambda" {
  function_name = var.listprocessingstatus-lambda_name
  role          = data.aws_iam_role.lab-role.arn
  package_type  = "Image"
  description   = "Lambda function to list processing statuses"

  image_uri   = "${data.aws_ecr_repository.listprocessingstatus.repository_url}:${var.image_tag}"
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
