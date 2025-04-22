terraform {
  backend "s3" {
    bucket = "soat8-g6-hackathon-video-processor-vitor"
    key    = "lambda/terraform.tfstate"
    region = "us-east-1"
  }
}
