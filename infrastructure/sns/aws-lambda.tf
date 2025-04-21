data "aws_iam_role" "lab-role" {
  name = "LabRole"
}

data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/dist"
  output_path = "${path.module}/lambda.zip"
}


resource "aws_lambda_function" "notify_lambda" {
  function_name    = "video-notify-email"
  filename         = data.archive_file.lambda_package.output_path
  source_code_hash = data.archive_file.lambda_package.output_base64sha256
  role             = data.aws_iam_role.lab-role.arn

  environment {
    variables = {
      SENDGRID_API_KEY = var.sendgrid_api_key
    }
  }
}

resource "aws_lambda_permission" "sns_invoke_lambda" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notify_lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.video_processed.arn
}

resource "aws_sns_topic_subscription" "lambda_sns_sub" {
  topic_arn = aws_sns_topic.video_processed.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.notify_lambda.arn
}