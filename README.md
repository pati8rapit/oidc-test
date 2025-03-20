# keycloakを用いたOIDCの試作

## api
### 仮想環境構築
terminalで下記を実行

    python3 -m venv api
    cd api
    source bin/activate
    pip install -r requirements.txt

### flaskサーバー起動

    flask run

## proxyの自己署名証明書の作成

    mkdir -p proxy/ssl
    chmod +x generate-ssl.sh
    ./generate-ssl.sh