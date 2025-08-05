const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { URL } = require('url');
require('dotenv').config();

const app = express(); // ← ★ここでappを定義！

// 静的ファイルを公開（public/index.html）
app.use(express.static('public'));

// プロキシルート
app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing ?url= parameter');
  }

  try {
    const parsedUrl = new URL(targetUrl);

    createProxyMiddleware({
      target: `${parsedUrl.protocol}//${parsedUrl.host}`,
      changeOrigin: true,
      pathRewrite: (path, req) => parsedUrl.pathname + parsedUrl.search,
    })(req, res, next);

  } catch (err) {
    res.status(400).send('Invalid URL');
  }
});

// サーバ起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy (no-auth) running at http://localhost:${PORT}/`);
});
