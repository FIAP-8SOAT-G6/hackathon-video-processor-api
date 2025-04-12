resource "aws_lambda_function" "presignedurl-lambda" {
  function_name = var.lambda_name
  role          = data.aws_iam_role.lab-role.arn
  package_type  = "Image"

  image_uri     = "${aws_ecr_repository.video-processor-api.repository_url}:${var.image_tag}"
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