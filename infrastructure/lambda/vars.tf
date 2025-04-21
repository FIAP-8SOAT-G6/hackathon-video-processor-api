variable "repositoryName" {
  default = "video-processor-hackathon/api"
}

variable "lambda_name" {
  default = "GetPreSignedUrl"
}

variable "image_tag" {
  description = "Docker image tag"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name"
  type        = string
  default     = "soat8-g6-hackathon-video-processor-vitor"
}
