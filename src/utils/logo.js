import axios from 'axios'

// 使用完整的后端服务地址
const FAVICON_SERVICE = 'http://localhost:3000/api/favicon'
const DEFAULT_TIMEOUT = 5000
const DEFAULT_ICON = '/default-icon.svg'

/**
 * 获取网站logo
 * 1. 通过后端服务获取favicon
 * 2. 失败时返回默认图标
 */
async function getWebsiteLogo(url) {
  if (!url) {
    console.warn('[Logo] URL为空,使用默认图标')
    return DEFAULT_ICON
  }

  try {
    console.log('[Logo] 开始获取网站logo:', url)
    console.log('[Logo] 请求地址:', `${FAVICON_SERVICE}?url=${encodeURIComponent(url)}`)
    
    // 通过后端服务获取favicon
    const response = await axios.get(FAVICON_SERVICE, {
      params: { url },
      timeout: DEFAULT_TIMEOUT,
      responseType: 'arraybuffer',
      validateStatus: status => status === 200 // 只接受200状态码
    })
    
    console.log('[Logo] 获取响应:', {
      status: response.status,
      contentType: response.headers['content-type'],
      dataLength: response.data?.length
    })
    
    // 验证响应内容
    if (!response.data || response.data.length === 0) {
      console.warn('[Logo] 响应内容为空')
      return DEFAULT_ICON
    }

    const contentType = response.headers['content-type']
    if (!contentType || !contentType.startsWith('image/')) {
      console.warn('[Logo] 响应内容类型无效:', contentType)
      return DEFAULT_ICON
    }
    
    // 使用浏览器原生的btoa函数进行base64编码
    const base64 = btoa(
      new Uint8Array(response.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    console.log('[Logo] 成功获取logo:', url)
    return `data:${contentType};base64,${base64}`
    
  } catch (error) {
    console.error('[Logo] 获取失败:', {
      url,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    })
    return DEFAULT_ICON
  }
}

export { getWebsiteLogo } 