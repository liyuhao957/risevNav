<template>
  <div class="tools-list">
    <div class="type-container" v-draggable="typeList" @end="saveOrder">
      <div
        :class="typeId == item.id ? 'type active' : 'type'"
        v-for="(item, index) in typeList"
        :key="item.id"
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
            <el-image class="logo" :src="toolLogos[item.target] || require('@/assets/images/default.svg')" fit="contain">
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
              <div class="desc">{{ item.desc }}</div>
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
const typeId = ref(0);
const keyword = ref("");
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import {
  RISEV_MENU_LIST,
  TOOLS_LIST,
} from "@/assets/config.js";
import { getWebsiteLogo } from '@/utils/logo'
import { getCachedLogo, cacheLogo, cleanCache } from '@/utils/cache'

const sourceToolList = TOOLS_LIST;
const toolList = ref([]);
const typeList = ref(RISEV_MENU_LIST);
const toolLogos = ref({});
const loadingLogos = ref({});

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
  window.open(item.target);
}

const search = () => {
  if (keyword.value) {
    toolList.value = sourceToolList.filter((item) => {
      const searchTerm = keyword.value.toLowerCase();
      return (
        (item.name?.toLowerCase() || '').includes(searchTerm) ||
        (item.desc?.toLowerCase() || '').includes(searchTerm) ||
        (item.jp?.toLowerCase() || '').includes(searchTerm)
      );
    });
  } else {
    goType({ id: typeId.value });
  }
}

const goType = (item) => {
  typeId.value = item.id;
  keyword.value = "";
  if (item.id == 8) {
    toolList.value = localStorage.getItem("risev_open_tool_list_collected")
      ? JSON.parse(localStorage.getItem("risev_open_tool_list_collected"))
      : [];
    return;
  }
  toolList.value = sourceToolList.filter((i) => i.menuId.includes(item.id));
  //遍历收藏列表，更新当前toolList的收藏状态
  if (localStorage.getItem("risev_open_tool_list_collected")) {
    let collectedList = JSON.parse(
      localStorage.getItem("risev_open_tool_list_collected")
    );
    toolList.value.forEach((item) => {
      item.collected = collectedList.find((i) => i.name == item.name)
        ? true
        : false;
    });
  }
  //存储当前typeId
  localStorage.setItem("risev_open_type_id", typeId.value);
}

// 获取分类logo
const getCategoryLogo = (categoryId) => {
  // 获取该分类下的第一个工具
  const firstTool = sourceToolList.find(tool => tool.menuId.includes(categoryId))
  if (firstTool) {
    // 如果找到工具,返回其logo
    return toolLogos.value[firstTool.target] || require('@/assets/images/default.svg')
  }
  // 如果分类为空,返回默认logo
  return require('@/assets/images/default.svg')
}

// 修改分类图标样式方法
const getMaskImageStyle = (item) => {
  return {
    backgroundImage: `url(${getCategoryLogo(item.id)})`,
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
  if (loadingLogos.value[tool.target]) return
  
  try {
    // 先从缓存获取
    const cached = getCachedLogo(tool.target)
    if (cached) {
      toolLogos.value[tool.target] = cached
      return
    }
    
    // 标记为加载中
    loadingLogos.value[tool.target] = true
    
    // 获取logo
    const logo = await getWebsiteLogo(tool.target)
    
    // 缓存logo
    cacheLogo(tool.target, logo)
    
    // 更新显示
    toolLogos.value[tool.target] = logo
  } catch (error) {
    console.error('加载工具logo失败:', error)
    // 使用默认图标
    toolLogos.value[tool.target] = require('@/assets/images/default.svg')
  } finally {
    // 清除加载中标记
    loadingLogos.value[tool.target] = false
  }
}

// 监听工具列表变化
watch(toolList, (newList) => {
  if(newList && newList.length > 0) {
    newList.forEach(tool => {
      loadToolLogo(tool)
    })
  }
}, { immediate: true })

onMounted(() => {
  // 清理过期和旧版本缓存
  cleanCache()
  
  //获取本地存储的typeId
  const localTypeId = localStorage.getItem("risev_open_type_id");
  if (localTypeId) {
    goType({ id: Number(localTypeId) });
  } else {
    goType({ id: 1 });
  }
  //获取本地存储的菜单列表
  const localMenuList = localStorage.getItem('risev_menu_list');
  if (localMenuList) {
    typeList.value = JSON.parse(localMenuList);
  }
})
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
    }

    .type:first-child {
      border-radius: 10px 10px 0 0;
    }

    .type:hover {
      transition: 0.3s;
    }

    .active {
      transition: 0.3s;
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
