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
      console.log('开始获取工具数据');
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('获取工具数据失败');
      }
      const data = await response.json();
      const tools = data.tools;
      console.log('获取到工具数据:', tools);
      return tools;
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

  async deleteCategory(categoryWeight) {
    try {
      const categories = await this.getCategories();
      const tools = await this.getTools();
      
      // 找到要删除的分类
      const categoryToDelete = categories.find(c => c.weight === categoryWeight);
      if (!categoryToDelete) {
        throw new Error('分类不存在');
      }
      
      // 检查是否有工具使用此分类名称
      const hasTools = tools.some(tool => tool.category === categoryToDelete.name);
      if (hasTools) {
        throw new Error('该分类下还有工具，无法删除');
      }
      
      const newCategories = categories.filter(c => c.weight !== categoryWeight);
      await this.saveData({ categories: newCategories });
      
      // 删除成功后，清除本地存储的 typeId
      localStorage.removeItem('risev_open_type_id');
      
      return true;
    } catch (error) {
      console.error('删除分类失败:', error);
      throw error;
    }
  }

  async updateCategory(categoryWeight, updateData) {
    try {
      const categories = await this.getCategories();
      const tools = await this.getTools();
      
      const index = categories.findIndex(c => c.weight === categoryWeight);
      if (index === -1) {
        throw new Error('分类不存在');
      }
      
      const oldCategory = categories[index];
      
      // 如果修改了 weight，检查是否重复
      if (updateData.weight && updateData.weight !== oldCategory.weight) {
        if (updateData.weight >= 10000) {
          throw new Error('普通分类的 weight 值必须小于 10000');
        }
        if (categories.some((c, i) => i !== index && c.weight === updateData.weight)) {
          throw new Error(`weight 值 ${updateData.weight} 已被使用`);
        }
      }
      
      // 如果修改了分类名称，更新所有相关工具的分类
      if (updateData.name && updateData.name !== oldCategory.name) {
        const updatedTools = tools.map(tool => {
          if (tool.category === oldCategory.name) {
            return { ...tool, category: updateData.name };
          }
          return tool;
        });
        await this.saveData({ tools: updatedTools });
      }
      
      // 更新分类
      categories[index] = { ...oldCategory, ...updateData };
      await this.saveData({ categories });
      
      return true;
    } catch (error) {
      console.error('更新分类失败:', error);
      throw error;
    }
  }

  async updateTool(toolName, updateData) {
    try {
      console.log('更新工具:', { toolName, updateData });
      const tools = await this.getTools();
      const index = tools.findIndex(t => t.name === toolName);
      
      if (index === -1) {
        throw new Error('工具不存在');
      }
      
      // 更新工具数据
      tools[index] = { ...tools[index], ...updateData };
      await this.saveData({ tools });
      
      return true;
    } catch (error) {
      console.error('更新工具失败:', error);
      throw error;
    }
  }

  async deleteTool(toolName) {
    try {
      console.log('开始删除工具:', toolName);
      const tools = await this.getTools();
      
      // 找到要删除的工具
      const toolToDelete = tools.find(t => t.name === toolName);
      if (!toolToDelete) {
        throw new Error('工具不存在');
      }
      
      console.log('找到要删除的工具:', toolToDelete);
      
      // 检查是否被收藏
      const collectedTools = localStorage.getItem('risev_open_tool_list_collected');
      if (collectedTools) {
        const collected = JSON.parse(collectedTools);
        if (collected.some(t => t.name === toolName)) {
          throw new Error('该工具已被收藏，无法删除');
        }
      }
      
      // 删除工具
      const newTools = tools.filter(t => t.name !== toolName);
      console.log('过滤后的工具列表:', newTools);
      
      await this.saveData({ tools: newTools });
      console.log('工具删除成功');
      
      return true;
    } catch (error) {
      console.error('删除工具失败:', error);
      throw error;
    }
  }

  // 添加工具
  async addToolData(toolData) {
    try {
      console.log('添加工具:', toolData);
      // TODO: 调用后端 API 添加工具
      // 临时使用本地存储
      const tools = await this.getTools();
      tools.push({
        ...toolData,
        id: Date.now(), // 临时使用时间戳作为 ID
        weight: tools.length + 1
      });
      localStorage.setItem('tools', JSON.stringify(tools));
      return true;
    } catch (error) {
      console.error('添加工具失败:', error);
      throw error;
    }
  }

  // 更新工具
  async updateToolData(toolData) {
    try {
      console.log('更新工具:', toolData);
      // TODO: 调用后端 API 更新工具
      // 临时使用本地存储
      const tools = await this.getTools();
      const index = tools.findIndex(t => t.id === toolData.id);
      if (index === -1) {
        throw new Error('工具不存在');
      }
      tools[index] = { ...tools[index], ...toolData };
      localStorage.setItem('tools', JSON.stringify(tools));
      return true;
    } catch (error) {
      console.error('更新工具失败:', error);
      throw error;
    }
  }

  // 更新工具顺序
  async updateToolsOrder(categoryName, tools) {
    try {
      console.log('更新工具顺序:', { categoryName, tools });
      
      // 获取所有工具
      const allTools = await this.getTools();
      
      // 更新当前分类工具的 weight
      const updatedTools = allTools.map(tool => {
        if (tool.category === categoryName) {
          // 查找工具在新顺序中的位置
          const index = tools.findIndex(t => t.name === tool.name);
          if (index !== -1) {
            return {
              ...tool,
              weight: index + 1
            };
          }
        }
        return tool;
      });
      
      // 保存更新后的工具列表
      await this.saveData({ tools: updatedTools });
      
      return true;
    } catch (error) {
      console.error('更新工具顺序失败:', error);
      throw error;
    }
  }
}

export default new DataService(); 