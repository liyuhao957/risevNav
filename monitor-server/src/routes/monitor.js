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

// 统一的API响应格式
const apiResponse = (data = null, message = 'success', code = 200) => {
  return {
    code,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

// 数据验证中间件
const validateData = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json(apiResponse(null, error.details[0].message, 400));
    }
    next();
  };
};

// 版本说明相关API
router.get('/version/latest', asyncHandler(async (req, res) => {
  try {
    const data = await readJsonFile('version_updates.json');
    res.json(apiResponse({
      ...data.latest,
      lastCheck: data.lastCheck
    }));
  } catch (error) {
    console.error('获取版本数据失败:', error);
    res.status(500).json(apiResponse(null, '获取版本数据失败', 500));
  }
}));

router.get('/version/history', asyncHandler(async (req, res) => {
  try {
    const data = await readJsonFile('version_updates.json');
    res.json(apiResponse(data.history || []));
  } catch (error) {
    console.error('获取版本历史记录失败:', error);
    res.status(500).json(apiResponse(null, '获取版本历史记录失败', 500));
  }
}));

// 加载器相关API
router.get('/loader/latest', asyncHandler(async (req, res) => {
  try {
    const data = await readJsonFile('loader_updates.json');
    res.json(apiResponse({
      ...data.latest,
      lastCheck: data.lastCheck
    }));
  } catch (error) {
    console.error('获取加载器数据失败:', error);
    res.status(500).json(apiResponse(null, '获取加载器数据失败', 500));
  }
}));

router.get('/loader/history', asyncHandler(async (req, res) => {
  try {
    const data = await readJsonFile('loader_updates.json');
    res.json(apiResponse(data.history || []));
  } catch (error) {
    console.error('获取加载器历史记录失败:', error);
    res.status(500).json(apiResponse(null, '获取加载器历史记录失败', 500));
  }
}));

// 错误处理中间件
router.use((err, req, res, next) => {
  console.error('API错误:', err);
  res.status(500).json(apiResponse(null, err.message || '服务器内部错误', 500));
});

module.exports = router; 