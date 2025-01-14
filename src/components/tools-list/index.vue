<template>
  <div class="tools-list">
    <div class="tools-category">
      <div
        v-for="category in categories"
        :key="category.name"
        class="category-item"
        :class="{ active: currentCategory === category.name }"
        @click="switchCategory(category.name)"
      >
        {{ category.name }}
      </div>
    </div>
    <div class="type-container" v-draggable="typeList" @end="saveOrder">
      <div
        :class="{
          'type': true,
          'active': typeId === item.weight
        }"
        v-for="(item, index) in typeList"
        :key="item.name"
        @click="goType(item)"
        draggable="true"
        @dragstart="(event) => dragStart(event, index)"
        @dragover.prevent
        @drop="(event) => drop(event, index)"
      >
        <div class="type-icon">
          <div class="type-icon-item" :style="getMaskImageStyle(item)"></div>
        </div>
        <span class="type-name">{{ item.name }}</span>
        <div class="type-actions" v-if="item.name !== '我的收藏'">
          <el-button
            type="text"
            size="small"
            @click.stop="handleCategoryEdit(item)"
            class="action-btn"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.stop="handleCategoryDelete(item)"
            class="action-btn"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <div class="tools-container">
      <div class="nav-bar">
        <el-input
          class="input"
          v-model="keyword"
          placeholder="请输入关键字"
          @input="search"
          clearable
          :suffix-icon="Search"
        ></el-input>
      </div>
      <el-scrollbar height="100%" class="tool-items-box">
        <div class="list-box">
          <div
            v-if="toolList.length == 0"
            style="
              width: 56vw;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 52vh;
            "
          >
            <div style="color: #909399">暂无数据</div>
          </div>
          <div
            class="tool"
            draggable="true"
            @dragstart="(event) => dragToolsStart(event, index)"
            @dragover.prevent
            @drop="(event) => dropTools(event, index)"
            @mouseenter="item.focusOn = true"
            @mouseleave="item.focusOn = false"
            @click="openUrl(item)"
            v-for="(item, index) in toolList"
            :key="index"
          >
            <el-image 
              class="logo" 
              :src="toolLogos[item.url]" 
              fit="contain"
              :key="item.url"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
              <template #placeholder>
                <div class="image-slot">
                  <el-icon><Loading /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="info-box">
              <div class="name">{{ item.name }}</div>
              <div class="desc">{{ item.shorthand }}</div>
            </div>
            <div class="actions" v-show="item.focusOn">
              <el-button
                v-bind="buttonProps"
                @click.stop="handleEdit(item)"
                class="action-btn"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                v-bind="buttonProps"
                @click.stop="handleDelete(item)"
                class="action-btn"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog
      :title="dialogType === 'add' ? '添加工具' : '编辑工具'"
      v-model="dialogVisible"
      width="30%"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="工具名称" required>
          <el-input v-model="form.name" placeholder="请输入工具名称" />
        </el-form-item>
        <el-form-item label="工具链接" required>
          <el-input v-model="form.url" placeholder="请输入工具链接" />
        </el-form-item>
        <el-form-item label="工具简介" required>
          <el-input v-model="form.shorthand" placeholder="请输入工具简介" />
        </el-form-item>
        <el-form-item label="所属分类" required>
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option
              v-for="item in typeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, inject, computed, defineEmits } from "vue";
import { Search, Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import DataService from '@/services/data'
import { getWebsiteLogo } from '@/utils/logo'
import { getCachedLogo, cacheLogo, cleanCache } from '@/utils/cache'

const typeId = ref(0);
const keyword = ref("");
const toolList = ref([]);
const typeList = ref([]);
const toolLogos = ref({});
const loadingLogos = ref({});
const loading = ref(false);
const allTools = ref([]);
const categories = ref([]);

// 注入父组件方法
const { handleEditCategory, handleDeleteCategory } = inject('categoryActions')

// 添加 emit 声明
const emit = defineEmits(['edit', 'success'])

// 对话框类型：add-添加，edit-编辑
const dialogType = ref('add');
const dialogVisible = ref(false);
const form = ref({
  name: '',
  url: '',
  shorthand: '',
  category: ''
});

// 处理分类编辑
const handleCategoryEdit = (category) => {
  handleEditCategory(category)
}

// 处理分类删除
const handleCategoryDelete = (category) => {
  handleDeleteCategory(category)
}

// 打开添加对话框
const handleAdd = () => {
  dialogType.value = 'add';
  form.value = {
    name: '',
    url: '',
    shorthand: '',
    category: currentCategory.value
  };
  dialogVisible.value = true;
};

// 打开编辑对话框
const handleEdit = (tool) => {
  dialogType.value = 'edit';
  form.value = {
    ...tool,
    category: tool.category,
    originalName: tool.name,
    originalUrl: tool.url
  };
  dialogVisible.value = true;
};

// 刷新工具列表
const refreshTools = async () => {
  try {
    console.log('开始刷新工具列表');
    // 重新获取工具数据
    const tools = await DataService.getTools();
    allTools.value = tools;
    
    // 重新过滤当前分类的工具
    await getToolList();
    
    console.log('工具列表刷新完成');
  } catch (error) {
    console.error('刷新工具列表失败:', error);
    throw error;
  }
};

// 处理确认
const handleConfirm = async () => {
  try {
    if (dialogType.value === 'add') {
      // 添加工具
      await DataService.addToolData(form.value);
      ElMessage.success('添加成功');
    } else {
      // 更新工具
      await updateTool(form.value);
      ElMessage.success('编辑成功');
    }
    dialogVisible.value = false;
    await refreshTools();
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error(error.message || '操作失败');
  }
};

// 处理工具删除
const handleDelete = async (tool) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该工具吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    await DataService.deleteTool(tool.name);
    ElMessage.success('删除成功');
    await refreshTools();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除工具失败:', error);
      ElMessage.error(error.message || '删除失败');
    }
  }
};

// 获取所有工具并缓存
const getAllTools = async () => {
  try {
    console.log('开始获取所有工具');
    const tools = await DataService.getTools();
    console.log('获取到工具数据:', tools);
    allTools.value = tools;
    return tools;
  } catch (error) {
    console.error('获取所有工具失败:', error);
    ElMessage.error('获取工具数据失败');
    return [];
  }
};

// 获取分类列表
const getTypeList = async () => {
  try {
    const categories = await DataService.getCategories();
    
    // 按 weight 排序
    typeList.value = categories
      .filter(c => c.weight < 10000)
      .sort((a, b) => a.weight - b.weight);
    
    console.log('分类列表更新完成:', typeList.value);
  } catch (error) {
    console.error('获取分类列表失败:', error);
    ElMessage.error('获取分类列表失败');
  }
};

// 修改工具列表过滤逻辑
const filterToolsByCategory = (tools, category) => {
  if (!category) return [];
  
  return tools.filter(tool => {
    const isMatch = tool.category === category.name;
    console.log(`工具 ${tool.name} 的分类匹配结果:`, {
      toolCategory: tool.category,
      categoryName: category.name,
      isMatch
    });
    return isMatch;
  });
};

// 修改监听逻辑，避免无限循环
watch([typeId], async () => {
  if (!typeId.value) return;
  
  const category = typeList.value.find(c => c.weight === typeId.value);
  console.log('当前分类信息:', {
    typeId: typeId.value,
    categoryName: category?.name,
    toolsCount: allTools.value.length
  });
  
  if (!category) {
    console.log('未找到对应分类, typeId:', typeId.value);
    toolList.value = [];
    return;
  }
  
  // 根据分类筛选工具
  toolList.value = filterToolsByCategory(allTools.value, category);
  console.log('最终的工具列表:', toolList.value);
});

// 修改按钮属性
const buttonProps = {
  link: true,
  size: 'small'
}

// 添加搜索功能
const search = () => {
  if (!keyword.value) {
    getToolList();
    return;
  }
  
  const searchText = keyword.value.toLowerCase();
  const category = typeList.value.find(t => t.weight === typeId.value);
  if (!category) return;
  
  toolList.value = allTools.value.filter(tool => {
    const isMatch = tool.category === category.name && (
      tool.name.toLowerCase().includes(searchText) ||
      tool.shorthand.toLowerCase().includes(searchText)
    );
    console.log(`搜索工具 ${tool.name}:`, {
      category: tool.category,
      searchText,
      isMatch
    });
    return isMatch;
  });
}

// 修改工具列表获取逻辑
const getToolList = async () => {
  try {
    console.log('开始获取工具列表:', {
      typeId: typeId.value,
      allToolsCount: allTools.value?.length || 0
    });
    
    // 获取当前分类
    const category = typeList.value.find(t => t.weight === typeId.value);
    if (!category) {
      console.warn('未找到当前分类:', typeId.value);
      toolList.value = [];
      return;
    }
    
    // 确保有工具数据
    if (!allTools.value?.length) {
      await getAllTools();
    }
    
    console.log('准备过滤工具:', {
      category,
      allTools: allTools.value
    });
    
    // 过滤当前分类的工具
    const filteredTools = allTools.value.filter(tool => {
      const isMatch = tool.category === category.name;
      console.log(`工具 ${tool.name} 的分类匹配结果:`, {
        toolCategory: tool.category,
        categoryName: category.name,
        isMatch,
        tool
      });
      return isMatch;
    });
    
    // 更新工具列表
    toolList.value = filteredTools;
    
    console.log('工具列表更新完成:', {
      category: category.name,
      filteredTools,
      allTools: allTools.value,
      toolList: toolList.value
    });
  } catch (error) {
    console.error('获取工具列表失败:', error);
    ElMessage.error('获取工具列表失败');
  }
};

// 监听分类变化
watch([typeId], () => {
  if (!typeId.value) return;
  getToolList();
});

// 修改刷新数据的方法
const refreshData = async () => {
  try {
    console.log('开始刷新数据:', {
      currentTypeId: typeId.value,
      currentTools: toolList.value
    });
    
    // 保存当前分类ID
    const currentTypeId = typeId.value;
    
    // 重新获取最新数据
    const [newCategories, newTools] = await Promise.all([
      DataService.getCategories(),
      DataService.getTools()
    ]);
    
    console.log('获取到新数据:', {
      newCategories,
      newTools,
      currentTypeId
    });
    
    // 更新数据
    typeList.value = newCategories;
    allTools.value = newTools;
    
    console.log('数据更新后:', {
      typeList: typeList.value,
      allTools: allTools.value,
      currentTypeId
    });
    
    // 重新获取工具列表
    await getToolList();
    
    // 清空搜索关键词
    keyword.value = '';
    
    console.log('刷新完成:', {
      categories: newCategories.length,
      tools: newTools.length,
      currentTools: toolList.value.length,
      currentCategory: typeList.value.find(t => t.weight === currentTypeId)?.name,
      allTools: allTools.value,
      toolList: toolList.value
    });
  } catch (error) {
    console.error('刷新数据失败:', error);
    ElMessage.error('刷新数据失败');
  }
};

// 在编辑或删除成功后调用刷新
const handleSuccess = () => {
  refreshData();
}

// 判断是否为收藏分类
const isCollectionCategory = computed(() => {
  const currentType = typeList.value.find(t => t.weight === typeId.value);
  return currentType?.weight === DataService.SPECIAL_CATEGORY_WEIGHT.MY_FAVORITES;
});

// 获取分类logo
const getCategoryLogo = (categoryName) => {
  // 从缓存的所有工具中查找
  const firstTool = allTools.value.find(tool => tool.category === categoryName);
  if (firstTool) {
    // 如果找到工具,返回其logo
    return toolLogos.value[firstTool.url] || require('@/assets/images/default.svg');
  }
  // 如果分类为空,返回默认logo
  return require('@/assets/images/default.svg');
}

// 修改分类图标样式方法
const getMaskImageStyle = (item) => {
  return {
    backgroundImage: `url(${getCategoryLogo(item.name)})`,
    maskImage: 'none',
    WebkitMaskImage: 'none',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
}

// 获取工具收藏状态图标
const getToolCollected = (collected) => {
  return collected
    ? require("@/assets/images/collected.svg")
    : require("@/assets/images/collect.svg");
}

// 处理工具收藏
const clickCollected = (item) => {
  item.collected = !item.collected;
  let collectedList = [];
  if (localStorage.getItem("risev_open_tool_list_collected")) {
    collectedList = JSON.parse(
      localStorage.getItem("risev_open_tool_list_collected")
    );
  }
  if (item.collected) {
    collectedList.push(item);
  } else {
    collectedList = collectedList.filter((i) => i.name != item.name);
  }
  localStorage.setItem(
    "risev_open_tool_list_collected",
    JSON.stringify(collectedList)
  );
}

// 获取工具 logo
const getToolLogo = async (url) => {
  try {
    // 如果已经有 logo，直接返回
    if (toolLogos.value[url]) {
      console.log('使用已缓存的 logo:', url);
      return;
    }
    
    // 如果正在加载，跳过
    if (loadingLogos.value[url]) {
      console.log('logo 正在加载中，跳过:', url);
      return;
    }
    
    // 标记为正在加载
    loadingLogos.value[url] = true;
    
    // 规范化 URL
    let normalizedUrl = url;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    console.log('开始获取网站 logo:', {
      originalUrl: url,
      normalizedUrl
    });
    
    // 获取网站 logo
    const logo = await getWebsiteLogo(normalizedUrl);
    if (logo) {
      console.log('获取到 logo:', {
        url: normalizedUrl,
        base64Length: logo.length
      });
      toolLogos.value[url] = logo;
    } else {
      console.warn('未获取到 logo，使用默认图标:', normalizedUrl);
      toolLogos.value[url] = require('@/assets/images/default.svg');
    }
  } catch (error) {
    console.error('获取工具 logo 失败:', {
      url,
      error,
      errorMessage: error.message
    });
    toolLogos.value[url] = require('@/assets/images/default.svg');
  } finally {
    loadingLogos.value[url] = false;
  }
};

// 初始化所有工具的 logo
const initAllLogos = async () => {
  try {
    console.log('开始初始化所有工具的 logo:', {
      toolCount: allTools.value.length
    });
    
    // 获取每个工具的 logo
    for (const tool of allTools.value) {
      await getToolLogo(tool.url);
    }
    
    console.log('所有工具 logo 初始化完成:', {
      logoCount: Object.keys(toolLogos.value).length
    });
  } catch (error) {
    console.error('初始化所有工具 logo 失败:', error);
  }
};

// 获取单个工具的 logo
const getToolLogoIfNeeded = async (tool) => {
  if (!tool?.url) return;
  await getToolLogo(tool.url);
};

// 打开工具链接
const openUrl = (item) => {
  try {
    console.log('准备打开链接:', item.url);
    
    let url = item.url;
    // 检查是否包含协议头
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    
    console.log('处理后的链接:', url);
    window.open(url);
  } catch (error) {
    console.error('打开链接失败:', error);
    ElMessage.error('打开链接失败');
  }
};

// 处理分类拖拽
const dragStart = (event, index) => {
  event.dataTransfer.setData('text/plain', index);
}

const drop = (event, index) => {
  const draggedIndex = event.dataTransfer.getData('text/plain');
  const tempList = [...typeList.value];
  const draggedItem = tempList[draggedIndex];
  tempList.splice(draggedIndex, 1);
  tempList.splice(index, 0, draggedItem);
  typeList.value = tempList;
  saveOrder();
}

const saveOrder = () => {
  localStorage.setItem('risev_menu_list', JSON.stringify(typeList.value));
}

// 处理工具拖拽
const dragToolsStart = (event, index) => {
  event.dataTransfer.setData('text/plain', index);
}

const dropTools = (event, index) => {
  const draggedIndex = event.dataTransfer.getData('text/plain');
  const tempList = [...toolList.value];
  const draggedItem = tempList[draggedIndex];
  tempList.splice(draggedIndex, 1);
  tempList.splice(index, 0, draggedItem);
  toolList.value = tempList;
  // 保存工具列表顺序
  if (typeId.value === 8) {
    localStorage.setItem('risev_open_tool_list_collected', JSON.stringify(toolList.value));
  }
}

// 切换分类
const goType = (item) => {
  try {
    console.log('切换分类:', item);
    typeId.value = item.weight;
    localStorage.setItem('risev_open_type_id', item.weight);
  } catch (error) {
    console.error('切换分类失败:', error);
    ElMessage.error('切换分类失败');
  }
};

// 监听分类变化
watch([typeId], async () => {
  try {
    console.log('分类ID变化:', typeId.value);
    
    // 获取当前分类信息
    const category = typeList.value.find(t => t.weight === typeId.value);
    if (!category) {
      console.warn('未找到当前分类:', typeId.value);
      return;
    }
    
    console.log('当前分类信息:', {
      typeId: typeId.value,
      categoryName: category.name,
      toolsCount: allTools.value.filter(t => t.category === category.name).length
    });
    
    // 更新工具列表
    await getToolList();
  } catch (error) {
    console.error('处理分类变化失败:', error);
    ElMessage.error('加载分类数据失败');
  }
});

// 添加工具
const addTool = async (toolData) => {
  try {
    // 验证必填字段
    if (!toolData.name || !toolData.url || !toolData.category) {
      throw new Error('请填写完整信息');
    }
    
    // 添加工具
    await DataService.addToolData(toolData);
    
    // 获取新工具的 logo
    await getToolLogoIfNeeded(toolData);
    
    // 刷新工具列表
    emit('success');
  } catch (error) {
    console.error('添加工具失败:', error);
    throw error;
  }
};

// 更新工具
const updateTool = async (toolData) => {
  try {
    // 验证必填字段
    if (!toolData.name || !toolData.url || !toolData.category) {
      throw new Error('请填写完整信息');
    }
    
    // 使用原始名称查找工具
    const success = await DataService.updateTool(toolData.originalName, {
      name: toolData.name,
      url: toolData.url,
      shorthand: toolData.shorthand,
      category: toolData.category
    });
    
    if (!success) {
      throw new Error('更新失败');
    }
    
    // 如果 URL 发生变化，获取新的 logo
    if (toolData.url !== form.value.originalUrl) {
      await getToolLogoIfNeeded(toolData);
    }
    
    // 刷新工具列表
    await refreshTools();
    
    return true;
  } catch (error) {
    console.error('更新工具失败:', error);
    throw error;
  }
};

onMounted(async () => {
  // 清理过期和旧版本缓存
  cleanCache();
  
  try {
    loading.value = true;
    await Promise.all([
      getAllTools(),
      getTypeList()
    ]);
    
    // 获取本地存储的typeId
    const localTypeId = localStorage.getItem("risev_open_type_id");
    if (localTypeId) {
      typeId.value = Number(localTypeId);
    } else {
      // 默认选中第一个分类
      typeId.value = typeList.value[0]?.weight || 1;
    }
    
    await getToolList();
  } catch (error) {
    console.error('初始化失败:', error);
    ElMessage.error('加载数据失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
  
  // 初始化所有工具的 logo
  await initAllLogos();
});
</script>

<style lang="less" scoped>
.tools-list {
  width: 100%;
  height: 100%;
  display: flex;

  .type-container {
    width: 200px;
    height: 100%;
    margin-right: 20px;
    background: #ffffff;
    box-shadow: 0 8px 16px 1px #4b4b5908;
    border-radius: 10px;
    padding: 10px;

    .type {
      padding: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: 1px solid #ededed;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .type-name {
        flex: 1;
        margin: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .type-actions {
        display: none;
        margin-left: auto;
        
        .action-btn {
          padding: 2px 5px;
          color: #606266;
          
          &:hover {
            color: #409EFF;
          }
          
          &:last-child:hover {
            color: #F56C6C;
          }
        }
      }
      
      &:hover {
        .type-actions {
          display: flex;
          align-items: center;
        }
      }
    }

    .type:first-child {
      border-radius: 10px 10px 0 0;
    }

    .type:hover {
      transition: 0.3s;
    }

    .active {
      transition: all 0.3s ease;
      border-radius: 8px;
      color: #fff !important;
      background-color: #817dff;
      font-weight: bold;

      .type-icon {
        background: rgba(255, 255, 255, 0.12);
      }

      .type-icon-item {
        fill: #fff;
        color: #fff;
        background-color: #fff;
      }
    }

    .active::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -8px;
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-left: 8px solid #817dff;
      margin-top: -3.5px;
    }

    .type-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: #fff;
      border-radius: 8px;
      margin-right: 10px;
      overflow: hidden;
    }

    .type-icon-item {
      width: 24px;
      height: 24px;
      background-color: transparent;
    }

    .active {
      .type-icon {
        background: rgba(255, 255, 255, 0.12);
      }
      
      .type-icon-item {
        filter: brightness(2);
      }
    }
  }
}

.tools-container {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: #ffffff;
  box-shadow: 0 8px 16px 1px #4b4b5908;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  .nav-bar {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px 20px 0;

    .input {
      width: 200px;
      margin-bottom: 10px;
    }
  }

  @media (max-width: 810px) {
    .nav-bar {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .input {
        width: 100%;
        margin: 10px 0 0 0;
      }
    }
  }

  .tool-items-box {
    flex: 1 1 1px;
    padding: 20px;

    .list-box {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;

      .tool {
        height: 90px;
        background: #ffffff;
        border-radius: 10px;
        padding: 15px;
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        border: 1px solid #ededed;

        &:hover {
          box-shadow: 0 8px 16px 1px #4b4b5908;
          transition: 0.3s;
          border: 1px solid #817dff;
        }

        .logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-right: 12px;
          flex-shrink: 0;

          .image-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            background: #f5f7fa;
            color: var(--el-text-color-secondary);
          }
        }

        .edit {
          position: absolute;
          right: 15px;
          top: 15px;
        }

        .info-box {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;

          .name {
            font-size: 15px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--main-text-color) !important;
          }

          .desc {
            flex: 1 1 1px;
            font-size: 13px;
            margin-top: 5px;
            text-align: justify;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--sub-text-color) !important;
          }
        }

        .actions {
          position: absolute;
          right: 15px;
          top: 15px;
          display: flex;
          align-items: center;
          gap: 5px;
          
          .action-icon {
            width: 18px;
            height: 18px;
            cursor: pointer;
          }
          
          .action-btn {
            padding: 2px 5px;
            color: #606266;
            
            &:hover {
              color: #409EFF;
            }
            
            &:last-child:hover {
              color: #F56C6C;
            }
          }
        }
      }
    }
  }
}

.tool-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.active {
  .type-actions {
    .action-btn {
      color: #fff;
      
      &:hover {
        color: #fff;
        opacity: 0.8;
      }
    }
  }
}
</style>
