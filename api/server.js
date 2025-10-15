const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// 固定データ
const mockData = {
  id: 1,
  name: "なまえ",
  age: 33,
};

// /myitem エンドポイント（POSTリクエスト）
app.post("/myitem", (req, res) => {
  console.log("POST /myitem リクエストを受信しました");
  console.log("リクエストボディ:", req.body);

  // 固定データをJSONで返却
  res.json(mockData);
});

// ヘルスチェック用のエンドポイント
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Mock server is running" });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Mock server is running on http://localhost:${PORT}`);
  console.log(`POST /myitem エンドポイントが利用可能です`);
});
