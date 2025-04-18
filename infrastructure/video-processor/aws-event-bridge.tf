resource "aws_cloudwatch_event_rule" "s3_mp4_upload" {
  name = "trigger-fargate-on-mp4"

  description = "Trigget Fargate on MP4 Upload"

  event_pattern = jsonencode({
    "source" : ["aws.s3"],
    "detail-type" : ["Object Created"],
    "detail" : {
      "bucket" : {
        "name" : [data.aws_s3_bucket.video-processor.id]
      },
      "object" : {
        "key" : [{
          "suffix" : ".mp4"
        }]
      }
    }
  })

}
