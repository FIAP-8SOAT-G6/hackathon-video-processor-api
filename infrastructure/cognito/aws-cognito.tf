// Resources
resource "aws_cognito_user_pool" "user_pool" {
  name = "user-pool"

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 6
  }
}

resource "aws_cognito_user_pool_domain" "cognito-domain" {
  domain       = "soat8-g6-hackathon-video-processor-gabriel"
  user_pool_id = "${aws_cognito_user_pool.user_pool.id}"
}

# resource "aws_cognito_user_pool_domain" "user_pool_domain" {
#   domain       = "soat8-g6-hackathon-video-processor-gabriel"
#   user_pool_id = user_pool.pool.id
# }

resource "aws_cognito_user_pool_client" "client" {
  name = "cognito-client"

  allowed_oauth_flows_user_pool_client = true
  generate_secret = false
  allowed_oauth_scopes = ["aws.cognito.signin.user.admin","email", "openid", "profile"]
  allowed_oauth_flows = ["implicit", "code"]
  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]
  supported_identity_providers = ["COGNITO"]

  user_pool_id = "${aws_cognito_user_pool.user_pool.id}"
  # callback_urls = ["https://${aws_apigatewayv2_api.api_gateway.id}.execute-api.${var.region}.amazonaws.com/${aws_apigatewayv2_stage.dev_stage.name}/lambda"]
  callback_urls = ["https://google.com"]
  logout_urls = ["https://foo.com"]
}

# resource "aws_cognito_user" "admin" {
#   user_pool_id = aws_cognito_user_pool.pool.id
#   username = "Admin"
#   password = "Admin@123"
# }

# resource "aws_cognito_user_pool_client" "client" {
#   name = "cognito-client"
#
#   user_pool_id = aws_cognito_user_pool.user_pool.id
#   generate_secret = false
#   refresh_token_validity = 90
#   prevent_user_existence_errors = "ENABLED"
#   explicit_auth_flows = [
#     "ALLOW_REFRESH_TOKEN_AUTH",
#     "ALLOW_USER_PASSWORD_AUTH",
#     "ALLOW_ADMIN_USER_PASSWORD_AUTH"
#   ]
# }
