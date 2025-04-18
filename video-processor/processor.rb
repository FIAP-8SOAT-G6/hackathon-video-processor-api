require 'dotenv/load'
require 'aws-sdk-s3'
require 'fileutils'
require 'json'
require 'zip' # rubyzip

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

  FileUtils.mkdir_p("/tmp/vid")
  video_path = "/tmp/vid/video.mp4"

  # Baixa o vídeo do S3
  s3.get_object(bucket: BUCKET, key: s3_key, response_target: video_path)

  # Extrai frames do vídeo
  output_pattern = "/tmp/vid/frame_%03d.jpg"
  extract_frames(video_path, output_pattern)

  # Zipa os frames
  frame_paths = Dir["/tmp/vid/frame_*.jpg"]
  raise "No frames extracted" if frame_paths.empty?

  zip_path = "/tmp/vid/frames.zip"
  zip_frames(frame_paths, zip_path)

  # Faz upload do ZIP para o S3
  zip_s3_key = "frames/frames.zip"
  puts "Uploading ZIP to S3: #{zip_s3_key}"
  s3.put_object(bucket: BUCKET, key: zip_s3_key, body: File.read(zip_path))
end

if event = ENV['EVENT_JSON']
  parsed = JSON.parse(event)
elsif File.exist?('event.json')
  parsed = JSON.parse(File.read('event.json'))
else
  puts "⚠️ Nenhum evento encontrado"
  exit
end

s3_key = parsed["detail"]["object"]["key"]
process_video(s3_key)
