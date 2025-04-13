resource "aws_api_gateway_rest_api" "api_gateway" {
    name        = "video-processor-api"
    description = "API Gateway for video processing"
}

resource "aws_api_gateway_resource" "upload_resource" {
    rest_api_id = aws_api_gateway_rest_api.api_gateway.id
    parent_id   = aws_api_gateway_rest_api.api_gateway.root_resource_id
    path_part = "upload"
}

resource "aws_api_gateway_method" "post_method" {
    rest_api_id = aws_api_gateway_rest_api.api_gateway.id
    resource_id = aws_api_gateway_resource.upload_resource.id
    http_method = "POST"
    authorization = "NONE" ## @TODO: Implement authorization handling
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [aws_api_gateway_integration.upload_lambda_integration]
  rest_api_id = aws_api_gateway_rest_api.api_gateway.id
}

resource "aws_api_gateway_stage" "prod_stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api_gateway.id
  stage_name    = "prod"
}