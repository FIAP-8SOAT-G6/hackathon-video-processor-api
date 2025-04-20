resource "aws_s3_bucket" "video-processor" {
  bucket = "soat8-g6-hackathon-video-processor-gabriel"
}

resource "aws_s3_bucket_notification" "notify_eventbridge" {
  bucket = aws_s3_bucket.video-processor.id

  eventbridge = true
}
