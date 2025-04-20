provider "aws" {
  region = var.regionDefault
}

variable "regionDefault" {
  default = "us-east-1"
}
