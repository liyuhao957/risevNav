const CACHE_PREFIX = 'risev_logo_'
const CACHE_EXPIRE = 7 * 24 * 60 * 60 * 1000 // 7天过期
// 使用构建时间戳作为缓存版本号
const CACHE_VERSION = process.env.VUE_APP_BUILD_TIME || new Date().toISOString()

/**
 * 清理过期和旧版本的缓存
 */
function cleanCache() {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const cache = localStorage.getItem(key)
        if (!cache) return
        
        const { version, expire } = JSON.parse(cache)
        // 清理过期或旧版本缓存
        if (Date.now() > expire || version !== CACHE_VERSION) {
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.error('清理缓存失败:', error)
  }
}

/**
 * 获取缓存的logo
 * @param {string} url 网站URL
 * @returns {string|null} 缓存的logo base64数据
 */
export function getCachedLogo(url) {
  try {
    const key = CACHE_PREFIX + url
    const cache = localStorage.getItem(key)
    if (!cache) return null
    
    const { data, expire, version } = JSON.parse(cache)
    // 检查版本和过期时间
    if (Date.now() > expire || version !== CACHE_VERSION) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  } catch (error) {
    console.error('读取logo缓存失败:', error)
    return null
  }
}

/**
 * 缓存logo
 * @param {string} url 网站URL
 * @param {string} logo logo的base64数据
 */
export function cacheLogo(url, logo) {
  try {
    const key = CACHE_PREFIX + url
    const cache = {
      data: logo,
      expire: Date.now() + CACHE_EXPIRE,
      version: CACHE_VERSION
    }
    localStorage.setItem(key, JSON.stringify(cache))
  } catch (error) {
    console.error('缓存logo失败:', error)
  }
}

// 导出清理函数
export { cleanCache } 