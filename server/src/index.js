const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const NodeCache = require('node-cache')
const cors = require('cors')

const app = express()
const cache = new NodeCache({ stdTTL: 86400 }) // 缓存24小时

// 允许跨域访问
app.use(cors())

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

/**
 * 获取网站favicon
 * 1. 尝试解析HTML中的link标签
 * 2. 尝试常见的favicon路径
 */
app.get('/api/favicon', async (req, res) => {
  try {
    const url = req.query.url
    if (!url) {
      console.warn('[Favicon] 缺少URL参数')
      return res.status(400).json({ error: 'URL参数是必需的' })
    }

    console.log('[Favicon] 处理请求:', url)

    // 检查缓存
    const cacheKey = `favicon:${url}`
    const cachedFavicon = cache.get(cacheKey)
    if (cachedFavicon) {
      console.log(`[Favicon] 命中缓存: ${url}`)
      res.set('Content-Type', cachedFavicon.contentType)
      return res.send(cachedFavicon.data)
    }

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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
            const favicon = {
              data: faviconResponse.data,
              contentType: faviconResponse.headers['content-type']
            }
            console.log('[Favicon] 成功获取link标签favicon:', {
              url: faviconUrl,
              contentType: favicon.contentType,
              size: favicon.data.length
            })
            cache.set(cacheKey, favicon)
            res.set('Content-Type', favicon.contentType)
            return res.send(favicon.data)
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
        const favicon = {
          data: response.data,
          contentType: response.headers['content-type']
        }
        console.log('[Favicon] 成功获取路径favicon:', {
          url: faviconUrl,
          contentType: favicon.contentType,
          size: favicon.data.length
        })
        cache.set(cacheKey, favicon)
        res.set('Content-Type', favicon.contentType)
        return res.send(favicon.data)
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Favicon服务运行在端口 ${PORT}`)
}) 