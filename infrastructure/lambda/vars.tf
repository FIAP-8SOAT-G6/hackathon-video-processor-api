variable "presignedurl-repositoryName" {
  default = "video-processor-hackathon/upload-api"
}

variable "presignedurl-lambda_name" {
  default = "GetPreSignedUrl"
}

variable "listprocessingstatus-repositoryName" {
  default = "video-processor-hackathon/upload-api"
}

variable "listprocessingstatus-lambda_name" {
  default = "ListProcessingStatus"
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