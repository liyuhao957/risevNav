import toolsData from '@/data/tools.json'

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
      console.log('从本地获取分类数据');
      const categories = toolsData.categories;
      
      if (!categories || categories.length === 0) {
        console.error('分类数据为空');
        throw new Error('分类数据为空');
      }

      // 更新缓存
      this.categoriesCache = categories;
      this.lastCategoriesFetch = now;
      
      return categories;
    } catch (error) {
      console.error('获取分类数据失败:', error);
      if (this.categoriesCache) {
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
      console.log('从本地获取工具数据');
      const tools = toolsData.tools;
      
      if (!tools || tools.length === 0) {
        console.error('工具数据为空');
        throw new Error('工具数据为空');
      }

      // 更新缓存
      this.toolsCache = tools;
      this.lastToolsFetch = now;
      
      return tools;
    } catch (error) {
      console.error('获取工具数据失败:', error);
      if (this.toolsCache) {
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