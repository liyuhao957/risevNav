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
        {{ item.name }}
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
            <el-image class="logo" :src="toolLogos[item.url] || require('@/assets/images/default.svg')" fit="contain">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="info-box">
              <div class="name">{{ item.name }}</div>
              <div class="desc">{{ item.shorthand }}</div>
            </div>
            <div class="edit" v-show="item.focusOn || item.collected">
              <img
                @click.stop="clickCollected(item)"
                title="收藏"
                :src="getToolCollected(item.collected)"
                style="width: 18px; height: 18px"
              />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import dataService from '@/services/data'
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

// 获取所有工具并缓存
const getAllTools = async () => {
  try {
    allTools.value = await dataService.getTools();
  } catch (error) {
    console.error('获取所有工具失败:', error);
    allTools.value = [];
  }
}

// 获取分类列表
const getTypeList = async () => {
  loading.value = true;
  try {
    const categories = await dataService.getCategories();
    console.log('原始分类数据:', categories);
    
    typeList.value = categories;
    // 如果本地存储有排序,使用本地存储的顺序
    const localMenuList = localStorage.getItem('risev_menu_list');
    if (localMenuList) {
      console.log('本地存储的排序:', localMenuList);
      const savedList = JSON.parse(localMenuList);
      // 合并本地存储的顺序和新获取的分类
      typeList.value = savedList.filter(item => 
        categories.some(cat => cat.name === item.name)
      );
      // 添加新的分类
      categories.forEach(cat => {
        if (!typeList.value.some(item => item.name === cat.name)) {
          typeList.value.push(cat);
        }
      });
      console.log('合并后的分类列表:', typeList.value);
    }
  } catch (error) {
    console.error('获取分类列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取工具列表
const getToolList = async () => {
  console.log('获取工具列表, typeId:', typeId.value);
  loading.value = true;
  try {
    const tools = await dataService.getTools();
    console.log('所有工具:', tools);
    console.log('所有分类:', typeList.value);
    
    // 根据当前分类筛选工具
    const currentCategory = typeList.value.find(t => t.weight === typeId.value);
    console.log('当前分类信息:', {
      typeId: typeId.value,
      category: currentCategory,
      allCategories: typeList.value.map(c => ({ name: c.name, weight: c.weight }))
    });
    
    if (!currentCategory) {
      console.error('未找到对应分类, typeId:', typeId.value);
      toolList.value = [];
      return;
    }

    // 如果是收藏分类，使用本地存储的收藏列表
    if (currentCategory.name === '我的收藏') {
      toolList.value = localStorage.getItem("risev_open_tool_list_collected")
        ? JSON.parse(localStorage.getItem("risev_open_tool_list_collected"))
        : [];
      console.log('收藏的工具:', toolList.value);
    } else {
      // 其他分类按名称筛选
      toolList.value = tools.filter(tool => {
        const isMatch = tool.category === currentCategory.name;
        console.log(`工具 ${tool.name} 的分类匹配结果:`, {
          toolCategory: tool.category,
          currentCategory: currentCategory.name,
          isMatch,
          tool
        });
        return isMatch;
      });
    }
    
    // 更新收藏状态
    if (localStorage.getItem("risev_open_tool_list_collected")) {
      let collectedList = JSON.parse(
        localStorage.getItem("risev_open_tool_list_collected")
      );
      toolList.value.forEach((item) => {
        item.collected = collectedList.some((i) => i.name === item.name);
      });
    }
    
    console.log('最终的工具列表:', toolList.value);
  } catch (error) {
    console.error('获取工具列表失败:', error);
    ElMessage.error('获取工具列表失败');
  } finally {
    loading.value = false;
  }
};

// 切换分类
const goType = async (item) => {
  console.log('切换分类:', item);
  
  // 如果正在加载中，不进行切换
  if (loading.value) {
    console.log('数据加载中，暂不切换分类');
    return;
  }
  
  // 检查参数有效性
  if (!item) {
    console.error('分类项为空');
    return;
  }
  
  // 检查weight是否存在且有效
  if (item.weight === undefined || item.weight === null) {
    console.error('无效的weight值:', item);
    return;
  }

  const weight = Number(item.weight);
  if (isNaN(weight)) {
    console.error('weight不是有效的数字:', item.weight);
    return;
  }
  
  try {
    typeId.value = weight;
    await getToolList();
    localStorage.setItem("risev_open_type_id", typeId.value);
  } catch (error) {
    console.error('切换分类失败:', error);
    ElMessage.error('切换分类失败，请重试');
  }
};

// 监听 typeId 变化
watch(typeId, (newId) => {
  console.log('typeId changed:', newId);
});

// 搜索
const search = () => {
  if (!keyword.value) {
    getToolList();
    return;
  }
  const searchKey = keyword.value.toLowerCase();
  toolList.value = toolList.value.filter((item) =>
    item.shorthand.toLowerCase().includes(searchKey)
  );
};

const getToolCollected = (collected) => {
  return collected
    ? require("@/assets/images/collected.svg")
    : require("@/assets/images/collect.svg");
}

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

const openUrl = (item) => {
  window.open(item.url);
}

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

const loadToolLogo = async (tool) => {
  // 如果已经在加载中,直接返回
  if (loadingLogos.value[tool.url]) return
  
  try {
    // 先从缓存获取
    const cached = getCachedLogo(tool.url)
    if (cached) {
      toolLogos.value[tool.url] = cached
      return
    }
    
    // 标记为加载中
    loadingLogos.value[tool.url] = true
    
    // 获取logo
    const logo = await getWebsiteLogo(tool.url)
    
    // 缓存logo
    cacheLogo(tool.url, logo)
    
    // 更新显示
    toolLogos.value[tool.url] = logo
  } catch (error) {
    console.error('加载工具logo失败:', error)
    // 使用默认图标
    toolLogos.value[tool.url] = require('@/assets/images/default.svg')
  } finally {
    // 清除加载中标记
    loadingLogos.value[tool.url] = false
  }
}

// 监听所有工具列表变化
watch(allTools, (newList) => {
  if(newList && newList.length > 0) {
    newList.forEach(tool => {
      loadToolLogo(tool);
    });
  }
}, { immediate: true });

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
      }
    }
  }
}

.tool-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
