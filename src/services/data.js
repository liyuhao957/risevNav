class DataService {
  constructor() {
    this.SPECIAL_CATEGORY_WEIGHT = {
      MY_FAVORITES: 10001  // 我的收藏使用 10000 以上的值
    };
  }

  // 获取新分类的 weight 值
  async getNextWeight() {
    try {
      const categories = await this.getCategories();
      // 只考虑普通分类的 weight (小于 10000)
      const maxWeight = Math.max(
        0,
        ...categories
          .filter(c => c.weight < 10000)
          .map(c => c.weight)
      );
      return maxWeight + 1;
    } catch (error) {
      console.error('获取下一个weight值失败:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      console.log('从API获取分类数据');
      const response = await fetch('/api/data')
      const data = await response.json()
      return data.categories;
    } catch (error) {
      console.error('获取分类数据失败:', error);
      throw error;
    }
  }

  async getTools() {
    try {
      console.log('从API获取工具数据');
      const response = await fetch('/api/data')
      const data = await response.json()
      return data.tools;
    } catch (error) {
      console.error('获取工具数据失败:', error);
      throw error;
    }
  }

  async addCategory(category) {
    try {
      const categories = await this.getCategories();
      
      // 如果没有提供 weight，自动分配
      if (!category.weight) {
        category.weight = await this.getNextWeight();
      }
      
      // 验证 weight 值
      if (category.weight >= 10000) {
        throw new Error('普通分类的 weight 值必须小于 10000');
      }
      
      // 检查 weight 是否重复
      if (categories.some(c => c.weight === category.weight)) {
        throw new Error(`weight 值 ${category.weight} 已被使用`);
      }
      
      categories.push(category);
      await this.saveData({ categories });
      return true;
    } catch (error) {
      console.error('添加分类失败:', error);
      throw error;
    }
  }

  async addTool(tool) {
    try {
      const tools = await this.getTools()
      tools.push(tool)
      await this.saveData({ tools })
      return true
    } catch (error) {
      console.error('添加工具失败:', error)
      throw error
    }
  }

  async saveData(data) {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('保存数据失败:', error)
      throw error
    }
  }
}

export default new DataService(); 