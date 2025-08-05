app.use(express.static('public'));

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { URL } = require('url');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 URL動的プロキシ（認証なし）
app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing ?url= parameter');
  }

  try {
    const parsedUrl = new URL(targetUrl);

    // プロキシ作成＆即使用
    createProxyMiddleware({
      target: `${parsedUrl.protocol}//${parsedUrl.host}`,
      changeOrigin: true,
      pathRewrite: (path, req) => parsedUrl.pathname + parsedUrl.search,
    })(req, res, next);

  } catch (err) {
    res.status(400).send('Invalid URL');
  }
});

// 🟢 サーバ起動
app.listen(PORT, () => {
  console.log(`Proxy (no-auth) running at http://localhost:${PORT}/proxy?url=...`);
});
