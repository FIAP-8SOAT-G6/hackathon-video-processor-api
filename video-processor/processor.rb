require 'dotenv/load'
require 'aws-sdk-s3'
require 'aws-sdk-sns'
require 'fileutils'
require 'json'
require 'zip'

REGION = ENV.fetch("AWS_REGION", "us-east-1")
BUCKET = ENV.fetch("INPUT_BUCKET")

def extract_frames(video_path, output_pattern)
  FileUtils.rm_rf(Dir["/tmp/vid/*.jpg"]) # Limpa frames antigos
  cmd = "ffmpeg -i #{video_path} -vf fps=1 #{output_pattern}"
  puts "Running FFmpeg: #{cmd}"
  success = system(cmd)
  raise "FFmpeg failed to extract frames" unless success
end

def zip_frames(frame_paths, zip_path)
  Zip::File.open(zip_path, Zip::File::CREATE) do |zipfile|
    frame_paths.each do |frame_path|
      filename = File.basename(frame_path)
      zipfile.add(filename, frame_path)
    end
  end
end

def process_video(s3_key)
  s3 = Aws::S3::Client.new(region: REGION)

  notify_status(s3_key, "iniciado")
  FileUtils.mkdir_p("/tmp/vid")
  video_path = "/tmp/vid/video.mp4"

  # Baixa o vídeo do S3
  update_video_status(s3, s3_key, "downloading")
  s3.get_object(bucket: BUCKET, key: s3_key, response_target: video_path)

  # Extrai frames do vídeo
  output_pattern = "/tmp/vid/frame_%03d.jpg"
  update_video_status(s3, s3_key, "extracting_frames")
  extract_frames(video_path, output_pattern)

  # Zipa os frames
  frame_paths = Dir["/tmp/vid/frame_*.jpg"]

  if frame_paths.empty?
    update_video_status(s3, s3_key, "failed - no_frames")
    raise "No frames extracted"
  end

  update_video_status(s3, s3_key, "zipping_frames")
  zip_path = "/tmp/vid/frames.zip"
  zip_frames(frame_paths, zip_path)

  uuid = s3_key.split('/').first
  zip_s3_key = "#{uuid}/frames.zip"

  update_video_status(s3, s3_key, "uploading_zip")

  # Faz o upload do zip para o S3
  s3.put_object(bucket: BUCKET, key: zip_s3_key, body: File.read(zip_path))

  notify_status(s3_key, "finalizado")
  update_video_status(s3, s3_key, "completed")

  true
end

def update_video_status(s3, s3_key, status)
  puts "Atualizando status do vídeo: #{s3_key} - Status: #{status}"
  uuid, video = s3_key.split('/')
  s3.put_object(
    bucket: BUCKET,
    key: "#{uuid}/status.json",
    body: JSON.generate({ id: uuid, video: video, status: status.upcase }),
    content_type: 'application/json'
  )
end

def notify_status(s3_key, status)
  return unless topic_sns

  puts "Notificando status do vídeo: #{s3_key} - Status: #{status}"

  message = "Processamento do vídeo #{s3_key} - #{status}"
  sns.publish(topic_arn: topic_sns, message: message)
end

def topic_sns
  @topic_sns ||= begin
    topic_arn = sns.list_topics.topics.find { |t| t.topic_arn.include?(BUCKET) }&.topic_arn

    topic_arn = sns.create_topic(name: BUCKET).topic_arn unless topic_arn

    topic_arn
  end
end

def sns
  @sns ||= Aws::SNS::Client.new(region: REGION)
end

if s3_video_key = ENV['S3_VIDEO_KEY']
  puts "🔄 Processando vídeo: #{s3_video_key}"
  process_video(s3_video_key)
else
  puts "⚠️ Nenhum evento encontrado"
  exit
end
