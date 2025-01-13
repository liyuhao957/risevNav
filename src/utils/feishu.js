import axios from 'axios'

class FeishuAPI {
  constructor() {
    this.baseURL = '/feishu-api'
    this.appId = 'cli_a70900cb283c901c'
    this.appSecret = 'vLAlALVFIU6nKI2uGoysPhs3oALEf41E'
    this.baseId = 'LvZ6bIxq1aqge0s8vrqciP2QnSb'
    this.categoriesTableId = 'tbl3BMxHmrfjfoaW'
    this.toolsTableId = 'tbleDesrQMKEwERm'
    this.tenantAccessToken = null
    this.tokenExpireTime = 0
  }

  async getTenantAccessToken() {
    // 如果token未过期，直接返回
    if (this.tenantAccessToken && Date.now() < this.tokenExpireTime) {
      return this.tenantAccessToken
    }

    try {
      console.log('获取tenant_access_token');
      const response = await axios.post(
        `${this.baseURL}/auth/v3/tenant_access_token/internal/`,
        {
          app_id: this.appId,
          app_secret: this.appSecret
        }
      )

      if (!response.data || !response.data.tenant_access_token) {
        throw new Error('获取tenant_access_token失败')
      }

      this.tenantAccessToken = response.data.tenant_access_token
      // token有效期为2小时，提前5分钟刷新
      this.tokenExpireTime = Date.now() + (response.data.expire - 300) * 1000

      return this.tenantAccessToken
    } catch (error) {
      console.error('获取tenant_access_token失败:', error)
      throw error
    }
  }

  async request(method, url, data = null) {
    try {
      const token = await this.getTenantAccessToken()
      const config = {
        method,
        url: `${this.baseURL}${url}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }

      if (data) {
        config.data = data
      }

      console.log('发送请求:', config);
      const response = await axios(config)
      console.log('请求响应:', response.data);
      
      return response.data
    } catch (error) {
      console.error('请求失败:', error)
      throw error
    }
  }

  async getCategories() {
    return this.request(
      'GET',
      `/bitable/v1/apps/${this.baseId}/tables/${this.categoriesTableId}/records`
    )
  }

  async getTools() {
    return this.request(
      'GET',
      `/bitable/v1/apps/${this.baseId}/tables/${this.toolsTableId}/records`
    )
  }
}

export default new FeishuAPI() 