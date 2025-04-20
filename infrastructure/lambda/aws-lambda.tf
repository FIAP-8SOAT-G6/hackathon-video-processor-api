data "aws_ecr_repository" "video_processor_api" {
  name = "video-processor-hackathon/api"
}

resource "aws_lambda_function" "presignedurl-lambda" {
  function_name = var.lambda_name
  role          = data.aws_iam_role.lab-role.arn
  package_type  = "Image"
  description = "Lambda function to generate presigned URLs for S3 bucket"

  image_uri     = "${data.aws_ecr_repository.video_processor_api.repository_url}:${var.image_tag}"
  timeout       = 15
  memory_size   = 512

environment {
    variables = {
        BUCKET_NAME = var.bucket_name
    }
}
}

data "aws_iam_role" "lab-role" {
  name = "LabRole"
}
