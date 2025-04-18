FROM ruby:3.2-slim

# Instalando dependências do sistema
RUN apt-get update && apt-get install -y \
  ffmpeg \
  build-essential \
  libcurl4-openssl-dev \
  libssl-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN gem install bundler

# Criando diretório do app
WORKDIR /app

# Copiando os arquivos
COPY .env .env
COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

# Comando padrão do container
CMD ["ruby", "processor.rb"]
