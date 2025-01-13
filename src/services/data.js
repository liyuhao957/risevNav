import feishuApi from '@/utils/feishu'
import { ElMessage } from 'element-plus'

class DataService {
  constructor() {
    this.categoriesCache = null;
    this.toolsCache = null;
    this.cacheTime = 5 * 60 * 1000; // 5分钟缓存
    this.lastCategoriesFetch = 0;
    this.lastToolsFetch = 0;
  }

  async getCategories() {
    // 检查缓存是否有效
    const now = Date.now();
    if (this.categoriesCache && (now - this.lastCategoriesFetch) < this.cacheTime) {
      console.log('使用分类缓存数据');
      return this.categoriesCache;
    }

    try {
      console.log('从飞书获取分类数据');
      const response = await feishuApi.getCategories();
      
      if (!response || !response.data || !response.data.items) {
        console.error('分类数据格式错误:', response);
        throw new Error('分类数据格式错误');
      }

      console.log('原始分类数据:', response.data.items);

      // 处理分类数据
      const categories = response.data.items.map(item => {
        const fields = item.fields || {};
        // 确保weight为数字类型
        const weight = parseInt(fields.weight, 10);
        if (isNaN(weight)) {
          console.error('无效的weight值:', fields.weight, '分类:', fields.name);
        }
        
        return {
          name: fields.name || '',
          weight: weight,
          is_active: fields.is_active || false
        };
      }).filter(cat => {
        // 过滤掉无效的分类
        const isValid = cat.name && typeof cat.weight === 'number' && !isNaN(cat.weight) && cat.is_active;
        if (!isValid) {
          console.log('过滤掉无效分类:', cat);
        }
        return isValid;
      }).sort((a, b) => a.weight - b.weight);

      console.log('处理后的分类数据:', categories);
      
      if (categories.length === 0) {
        console.error('没有有效的分类数据');
        throw new Error('没有有效的分类数据');
      }
      
      // 更新缓存
      this.categoriesCache = categories;
      this.lastCategoriesFetch = now;
      
      return categories;
    } catch (error) {
      console.error('获取分类数据失败:', error);
      // 如果有缓存，使用缓存
      if (this.categoriesCache) {
        console.log('使用过期的分类缓存');
        return this.categoriesCache;
      }
      throw error;
    }
  }

  async getTools() {
    // 检查缓存是否有效
    const now = Date.now();
    if (this.toolsCache && (now - this.lastToolsFetch) < this.cacheTime) {
      console.log('使用工具缓存数据');
      return this.toolsCache;
    }

    try {
      console.log('从飞书获取工具数据');
      const response = await feishuApi.getTools();
      
      if (!response || !response.data || !response.data.items) {
        console.error('工具数据格式错误:', response);
        throw new Error('工具数据格式错误');
      }

      // 处理工具数据
      const tools = response.data.items.map(item => ({
        name: item.fields.name || '',
        shorthand: item.fields.shorthand || '',
        url: item.fields.url || '',
        category: item.fields.category || ''
      })).filter(tool => {
        // 过滤掉无效的工具
        const isValid = tool.name && tool.url && tool.category;
        if (!isValid) {
          console.log('过滤掉无效工具:', tool);
        }
        return isValid;
      });

      console.log('处理后的工具数据:', tools);
      
      // 更新缓存
      this.toolsCache = tools;
      this.lastToolsFetch = now;
      
      return tools;
    } catch (error) {
      console.error('获取工具数据失败:', error);
      // 如果有缓存，使用缓存
      if (this.toolsCache) {
        console.log('使用过期的工具缓存');
        return this.toolsCache;
      }
      throw error;
    }
  }

  clearCache() {
    this.categoriesCache = null;
    this.toolsCache = null;
    this.lastCategoriesFetch = 0;
    this.lastToolsFetch = 0;
    console.log('清除缓存完成');
  }
}

export default new DataService(); 