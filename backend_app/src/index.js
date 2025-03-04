const express = require('express');
const cors = require('cors');
const http = require('http');
const querystring = require('querystring');

// アプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートエンドポイント
app.get('/', (req, res) => {
  res.redirect('http://localhost:8080/auth/realms/oidc-test/.well-known/openid-configuration')
});

// keycloakの認証エンドポイント
app.get('/authorize', (req, res) => {
  const authUrl = 'http://localhost:8080/auth/realms/oidc-test/protocol/openid-connect/auth';
  const scope = 'openid';
  const responseType = 'code';
  const clientId = 'test-client';
  const state = 'TH25QRQHJJC16YY7AKNS';
  const codeChallenge = 'Zfy2DA1iCm7v1bby0a_cs2bRVF6v-DMd0HNsaHbncR4';
  const codeChallengeMethod = 'S256';
  const redirectUri = 'http://localhost:3000/callback';
  const nonce = '097TREH1IZ5LRZ9F5MSN';

  const url = `${authUrl}?scope=${scope}&response_type=${responseType}&client_id=${clientId}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}&redirect_uri=${redirectUri}&nonce=${nonce}`;

  res.redirect(url);
  // res.send(url)
})

// keycloakログイン後のコールバック
app.get('/callback', (req, res) => {

  const validState = 'TH25QRQHJJC16YY7AKNS';
  const paramState = req.params.state;

  const code = req.query.code;

  // keycloakのトークンエンドポイント
  const tokenEndpointUrl = 'http://localhost:8080/auth/realms/oidc-test/protocol/openid-connect/token';

  const clientId = 'test-client';
  const clientSecret = 'wPqKPUjviWs41KvVRpjLYjwSuSg0RQA4';
  const codeVerifier = 'OF6NR422P3P29J4DFV8G55F4HTFAIONTAR13BEUD72YDWFL0OPRJ0L6V5ZKCY9D3DFK6FY85MDIK9ZQVIRATGUU9EC01MYK2PVQA';
  const redirectUri = 'http://localhost:3000/callback';
  const grantType = 'authorization_code';

  // curlでの実行例
  'curl.exe -X POST -d "grant_type=authorization_code&code=1e822d58-dab1-4d2a-a4f8-51a0115b681b.88997673-9cf1-4027-a531-3eca47cbcf2d.167aa8bc-5991-4eba-921f-f062e0f66e2e&redirect_uri=http://localhost:3000/callback&client_id=test-client&client_secret=wPqKPUjviWs41KvVRpjLYjwSuSg0RQA4&code_verifier=OF6NR422P3P29J4DFV8G55F4HTFAIONTAR13BEUD72YDWFL0OPRJ0L6V5ZKCY9D3DFK6FY85MDIK9ZQVIRATGUU9EC01MYK2PVQA" http://localhost:8080/auth/realms/oidc-test/protocol/openid-connect/token'

  // リクエストパラメータ
  const postData = querystring.stringify({
    'grant_type': grantType,
    'code': code,
    'redirect_uri': redirectUri,
    'client_id': clientId,
    'client_secret': clientSecret,
    'code_verifier': codeVerifier
  });

  // リクエストオプション
  const options = {
    hostname: 'auth',
    port: 8080,
    path: '/auth/realms/oidc-test/protocol/openid-connect/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  // HTTPリクエストを作成
  const postRequest = http.request(options, (tokenRes) => {
    console.log(`ステータスコード: ${tokenRes.statusCode}`);
    
    let data = '';
    
    // データを受信
    tokenRes.on('data', (chunk) => {
      data += chunk;
    });
    
    // レスポンスの終了
    tokenRes.on('end', () => {
      try {
        const jsonResponse = JSON.parse(data);
        
        // レスポンスヘッダーを設定
        res.writeHead(tokenRes.statusCode, {
          'Content-Type': 'application/json'
        });
        
        // レスポンス本文を送信
        res.end(JSON.stringify({
          success: tokenRes.statusCode === 200,
          status: tokenRes.statusCode,
          data: jsonResponse
        }));
        
      } catch (e) {
        // JSONパースエラー
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'レスポンスの解析に失敗しました',
          rawData: data
        }));
      }
    });
  });

  // エラーハンドリング
  postRequest.on('error', (e) => {
    console.error(`リクエストエラー: ${e.message}`);
  });

  // リクエストの本文を書き込み
  postRequest.write(postData);

  // リクエストを終了
  postRequest.end();

});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});