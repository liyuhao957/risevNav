const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()

// 添加 JSON 解析中间件
app.use(express.json())

// 允许跨域访问
app.use(cors())

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

/**
 * 获取网站favicon
 */
app.get('/api/favicon', async (req, res) => {
  try {
    const url = req.query.url
    if (!url) {
      console.warn('[Favicon] 缺少URL参数')
      return res.status(400).json({ error: 'URL参数是必需的' })
    }

    console.log('[Favicon] 处理请求:', url)

    // 规范化URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
    const baseUrl = new URL(normalizedUrl)
    console.log('[Favicon] 规范化URL:', normalizedUrl)
    
    // 获取HTML并解析favicon链接
    try {
      console.log('[Favicon] 开始获取HTML:', normalizedUrl)
      const response = await axios.get(normalizedUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      console.log('[Favicon] HTML获取成功')
      
      const $ = cheerio.load(response.data)
      const linkTags = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]'
      ]
      
      for (const tag of linkTags) {
        const href = $(tag).attr('href')
        if (href) {
          const faviconUrl = new URL(href, normalizedUrl).href
          console.log('[Favicon] 尝试link标签:', tag, faviconUrl)
          try {
            const faviconResponse = await axios.get(faviconUrl, {
              responseType: 'arraybuffer',
              timeout: 5000
            })
            console.log('[Favicon] 成功获取link标签favicon:', {
              url: faviconUrl,
              contentType: faviconResponse.headers['content-type'],
              size: faviconResponse.data.length
            })
            res.set('Content-Type', faviconResponse.headers['content-type'])
            return res.send(faviconResponse.data)
          } catch (error) {
            console.warn('[Favicon] link标签获取失败:', {
              url: faviconUrl,
              error: error.message
            })
            continue
          }
        }
      }
    } catch (error) {
      console.warn('[Favicon] HTML获取失败:', {
        url: normalizedUrl,
        error: error.message
      })
    }
    
    // 尝试常见的favicon路径
    const paths = [
      '/favicon.ico',
      '/favicon.png',
      '/assets/favicon.ico',
      '/assets/favicon.png',
      '/static/favicon.ico',
      '/static/favicon.png'
    ]
    
    for (const path of paths) {
      try {
        const faviconUrl = new URL(path, normalizedUrl).href
        console.log('[Favicon] 尝试路径:', faviconUrl)
        const response = await axios.get(faviconUrl, {
          responseType: 'arraybuffer',
          timeout: 5000
        })
        console.log('[Favicon] 成功获取路径favicon:', {
          url: faviconUrl,
          contentType: response.headers['content-type'],
          size: response.data.length
        })
        res.set('Content-Type', response.headers['content-type'])
        return res.send(response.data)
      } catch (error) {
        console.warn('[Favicon] 路径获取失败:', {
          url: faviconUrl,
          error: error.message
        })
        continue
      }
    }
    
    // 所有尝试都失败了
    console.warn('[Favicon] 未找到favicon:', url)
    res.status(404).json({ error: '未找到favicon' })
    
  } catch (error) {
    console.error('[Favicon] 服务器错误:', {
      url: req.query.url,
      error: error.message
    })
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../../src/data/tools.json')

// 读取数据
app.get('/api/data', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    res.json(JSON.parse(data))
  } catch (error) {
    console.error('读取数据失败:', error)
    res.status(500).json({ error: '读取数据失败' })
  }
})

// 保存数据
app.post('/api/data', (req, res) => {
  try {
    const data = req.body
    if (!data) {
      return res.status(400).json({ error: '数据不能为空' })
    }

    // 验证数据结构
    if (!data.categories && !data.tools) {
      return res.status(400).json({ error: '无效的数据格式' })
    }

    // 读取现有数据
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    
    // 合并数据
    const newData = {
      categories: data.categories || currentData.categories,
      tools: data.tools || currentData.tools
    }

    // 写入文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2))
    
    res.json({ success: true })
  } catch (error) {
    console.error('保存数据失败:', error)
    res.status(500).json({ error: '保存数据失败' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Favicon服务运行在端口 ${PORT}`)
}) 