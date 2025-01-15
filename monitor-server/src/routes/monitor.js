const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const asyncHandler = require('express-async-handler');

// 工具函数：读取JSON文件
const readJsonFile = async (filename) => {
  const filePath = path.join(__dirname, '../../data', filename);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

// 版本说明相关API
router.get('/version/latest', async (req, res) => {
  try {
    const data = await readJsonFile('version_updates.json');
    res.json({
      ...data.latest,
      lastCheck: data.lastCheck
    });
  } catch (error) {
    res.status(500).json({ error: '获取版本数据失败' });
  }
});

router.get('/version/history', asyncHandler(async (req, res) => {
  const data = await readJsonFile('version_updates.json');
  res.json(data.history || []);
}));

// 加载器相关API
router.get('/loader/latest', async (req, res) => {
  try {
    const data = await readJsonFile('loader_updates.json');
    res.json({
      ...data.latest,
      lastCheck: data.lastCheck
    });
  } catch (error) {
    res.status(500).json({ error: '获取加载器数据失败' });
  }
});

router.get('/loader/history', asyncHandler(async (req, res) => {
  const data = await readJsonFile('loader_updates.json');
  res.json(data.history || []);
}));

// 错误处理中间件
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

module.exports = router; 