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