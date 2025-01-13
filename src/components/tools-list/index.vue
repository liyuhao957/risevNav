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
        <div v-if="typeId == 7" class="list-box">
          <div
            class="tool"
            draggable="true"
            @click="openAccountType(item)"
            v-for="(item, index) in accountTypeList"
            :key="index"
          >
            <el-image class="logo" :src="item.logo" fit="contain">
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
            <div class="account-share" v-if="item.type">{{ item.type }}</div>
          </div>
        </div>
        <div class="list-box" v-if="typeId != 7">
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
            <el-image class="logo" :src="item.logo" fit="contain">
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

    <!---account dialog--->
    <el-drawer
      v-model="accountDrawer"
      title="RiseV导航/Chatgpt共享"
      direction="ltr"
    >
      <div class="account-drawer-bg">
        <div style="color:chocolate;">自备魔法🎉</div>
        <div style="margin-top: 10px;display: flex;align-items: center;">官方地址：https://chat.openai.com/<el-icon style="cursor: pointer;margin-left: 10px;"  @click="copyLink('https://chat.openai.com/')"><CopyDocument /></el-icon></div>
        <p class="has-line-data" style="color:chocolate;">
          <strong>账号池使用指南</strong>
        </p>
        <ul>
          <li class="has-line-data" data-line-start="5" data-line-end="7">
            <p class="has-line-data" data-line-start="5" data-line-end="6">
              <strong>账号状态</strong
              >：账号均处于正常使用状态，到期账号将被移除。
            </p>
          </li>
          <li class="has-line-data" data-line-start="7" data-line-end="9">
            <p class="has-line-data" data-line-start="7" data-line-end="8">
              <strong>账号更换</strong
              >：除非账号使用次数达到限制，否则无需更换账号。
            </p>
          </li>
        </ul>
        <p class="has-line-data" style="color:chocolate;">
          <strong>共享账号对话信息提醒</strong>
        </p>
        <ul>
          <li class="has-line-data" data-line-start="11" data-line-end="13">
            <p class="has-line-data" data-line-start="11" data-line-end="12">
              <strong>到期处理</strong
              >：共享账号到期后，将更换密码并清除对话记录。
            </p>
          </li>
          <li class="has-line-data" data-line-start="13" data-line-end="14">
            <p class="has-line-data" data-line-start="13" data-line-end="14">
              <strong>数据备份</strong>：请及时备份重要数据，以防丢失。
            </p>
          </li>
        </ul>
      </div>
      <el-table :data="accountList" style="width: 100%">
        <el-table-column prop="dueTime" label="过期时间" align="center" />
        <el-table-column prop="remainder" label="剩余天数" align="center" />
        <el-table-column prop="accountStar" label="账号" align="center">
          <!----复制账号-->
          <template #default="scope">
            <div style="display: flex">
              <div>{{ scope.row.accountStar }}</div>
              <el-button link type="primary" size="small" @click="copyAccount(scope.row)">
                复制
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pwdStar" label="密码" align="center">
          <!----复制账号-->
          <template #default="scope">
            <div style="display: flex">
              <div>{{ scope.row.accountStar }}</div>
              <el-button link type="primary" size="small"  @click="copyPwd(scope.row)">
                复制
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const typeId = ref(0);
const keyword = ref("");
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import {
  RISEV_MENU_LIST,
  TOOLS_LIST,
  ACCOUNT_TYPE_LIST,
} from "@/assets/config.js";
const sourceToolList = TOOLS_LIST;
const accountTypeList = ACCOUNT_TYPE_LIST;
const toolList = ref([]);
const accountDrawer = ref(false);
const accountList = ref([]);
const typeList = ref(RISEV_MENU_LIST);

const copyLink = async (item) => {
  try {
    await navigator.clipboard.writeText(item);
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  } catch (err) {
    ElMessage({
      message: '复制失败',
      type: 'error',
    })
  }
}

const copyAccount = async (item) => {
  try {
    await navigator.clipboard.writeText(item.account);
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  } catch (err) {
    ElMessage({
      message: '复制失败',
      type: 'error',
    })
  }
}

const copyPwd = async (item) => {
  try {
    await navigator.clipboard.writeText(item.password);
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  } catch (err) {
    ElMessage({
      message: '复制失败',
      type: 'error',
    })
  }
}

const openAccountType = (item) => {
  accountDrawer.value = true;
  accountList.value = item.accountList;
}

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
    toolList.value = sourceToolList.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
        item.desc.toLowerCase().includes(keyword.value.toLowerCase()) ||
        item.jp.toLowerCase().includes(keyword.value.toLowerCase())
    );
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

const getMaskImageStyle = (item) => {
  return {
    maskImage: `url(${item.icon})`,
  };
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

onMounted(() => {
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
      background: rgba(105, 101, 234, 0.08);
      border-radius: 8px;
      margin-right: 10px;
    }

    .type-icon-item {
      width: 18px;
      height: 18px;
      fill: #908dea;
      color: #908dea;
      background-color: #908dea;
      mask-size: 18px 18px;
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

        .account-share {
          position: absolute;
          right: 15px;
          top: 15px;
          background-color: #817dff;
          color: #fff;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 12px;
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

.account-drawer-bg {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}
</style>
