terraform {
  backend "s3" {
    bucket = "soat8-g6-hackathon-video-processor-vitor"
    key    = "ecr/terraform.tfstate"
    region = "us-east-1"
  }
}
