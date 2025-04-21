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

resource "aws_cognito_user_pool_client" "client" {
  name = "cognito-client"
  user_pool_id = "${aws_cognito_user_pool.user_pool.id}"

  generate_secret = false
  allowed_oauth_flows_user_pool_client = true

  # allowed_oauth_scopes = ["aws.cognito.signin.user.admin","email", "openid", "profile"]
  allowed_oauth_scopes = ["email", "openid"]
  allowed_oauth_flows = ["implicit"]
  # explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]

  callback_urls = ["https://google.com"]
  logout_urls = ["https://google.com"]
  supported_identity_providers = ["COGNITO"]
}

# resource "aws_cognito_user" "admin" {
#   user_pool_id = aws_cognito_user_pool.pool.id
#   username = "Admin"
#   password = "Admin@123"
# }
