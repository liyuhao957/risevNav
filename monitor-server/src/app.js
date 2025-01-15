const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3001;

// 中间件
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 路由
const monitorRoutes = require('./routes/monitor');
app.use('/api/monitor', monitorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Monitor server is running on port ${port}`);
}); 