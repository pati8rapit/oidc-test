const express = require('express');
const cors = require('cors');

// アプリケーションの初期化
const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'Express Backend App is running!' });
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});