// 缓存版本号
const CACHE_VERSION = process.env.VUE_APP_BUILD_TIME || new Date().toISOString()

// 缓存键前缀
const CACHE_PREFIX = 'risev_'

// 缓存键
const CACHE_KEYS = {
  LOGO: `${CACHE_PREFIX}logo_`,
  VERSION: `${CACHE_PREFIX}cache_version`
}

// 缓存过期时间（7天）
const CACHE_EXPIRE = 7 * 24 * 60 * 60 * 1000

/**
 * 获取缓存的logo
 * @param {string} url 网站URL
 * @returns {string|null} logo的base64字符串
 */
export function getCachedLogo(url) {
  try {
    const key = CACHE_KEYS.LOGO + url
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const data = JSON.parse(cached)
    // 检查是否过期
    if (Date.now() - data.time > CACHE_EXPIRE) {
      console.log('缓存已过期:', url)
      localStorage.removeItem(key)
      return null
    }

    return data.logo
  } catch (error) {
    console.error('获取缓存logo失败:', error)
    return null
  }
}

/**
 * 缓存logo
 * @param {string} url 网站URL
 * @param {string} logo logo的base64字符串
 */
export function cacheLogo(url, logo) {
  try {
    const key = CACHE_KEYS.LOGO + url
    const data = {
      logo,
      time: Date.now(),
      version: CACHE_VERSION
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('缓存logo失败:', error)
  }
}

/**
 * 清理过期和旧版本缓存
 */
export function cleanCache() {
  try {
    console.log('开始清理缓存...');
    console.log('当前版本号:', CACHE_VERSION);
    
    // 检查缓存版本
    const cachedVersion = localStorage.getItem(CACHE_KEYS.VERSION)
    console.log('缓存的版本号:', cachedVersion);
    
    if (cachedVersion !== CACHE_VERSION) {
      console.log('版本不匹配，清理所有缓存');
      // 清理所有缓存
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith(CACHE_PREFIX)) {
          console.log('清理缓存:', key);
          localStorage.removeItem(key)
        }
      }
      // 更新缓存版本
      localStorage.setItem(CACHE_KEYS.VERSION, CACHE_VERSION)
      return
    }

    // 清理过期缓存
    const now = Date.now()
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(CACHE_KEYS.LOGO)) {
        try {
          const data = JSON.parse(localStorage.getItem(key))
          if (now - data.time > CACHE_EXPIRE || data.version !== CACHE_VERSION) {
            console.log('清理过期或旧版本缓存:', key);
            localStorage.removeItem(key)
          }
        } catch (error) {
          console.error('解析缓存数据失败:', key, error)
          localStorage.removeItem(key)
        }
      }
    }
    
    console.log('缓存清理完成');
  } catch (error) {
    console.error('清理缓存失败:', error)
  }
} 