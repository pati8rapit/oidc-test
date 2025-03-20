#!/bin/bash

# SSL証明書用のディレクトリを作成
mkdir -p proxy/ssl

# 自己署名証明書を生成
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout proxy/ssl/server.key \
  -out proxy/ssl/server.crt \
  -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Example/OU=IT/CN=localhost"

# 権限を設定
chmod 600 proxy/ssl/server.key