variable "pre_signed_url-repositoryName" {
  default = "video-processor-hackathon/upload-api"
}

variable "pre_signed_url-lambda_name" {
  default = "Getpre_signed_url"
}

variable "list_processing_status-repositoryName" {
  default = "video-processor-hackathon/upload-api"
}

variable "list_processing_status-lambda_name" {
  default = "list_processing_status"
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
