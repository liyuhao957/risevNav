<template>
  <div class="index" :data-theme="$store.state.theme">
    <div class="header-risev">
      <div class="logo-container">
        <span class="logo-text">Tc</span>
      </div>
      <Header />
      <SearchBar class="search-bar" />
    </div>
    <!---内部小组件---->
    <div class=".risev-mini-component" v-if="showRiseVComponent">
      <Bianqian />
    </div>
    <div class="main-container">
      <ToolsList class="tools-list" @edit="handleEditTool" />
      <FastOpen @clickRiseVComponent="clickRiseVComponent" />
    </div>
  </div>
  <BottomNav />
  <div
    class="more animate__animated animate__slideInRight"
    @click="dialogVisible = true"
    :style="{
      'background-color':
        $store.state.theme == 'light'
          ? 'white !important'
          : 'rgb(44, 46, 47) !important',
    }"
  >
    <img
      src="@/assets/images/default.svg"
      style="width: 38px; height: 38px; border-radius: 50%"
    />
  </div>

  <el-dialog
    v-model="dialogVisible"
    width="40%"
    top="5vh"
    title="RiseV共创计划1.0 —— 携手创新，共筑未来"
    modal-class="customer-dialog"
  >
    <el-scrollbar style="width: 100%; padding-right: 30px" height="75vh">
      <div style="line-height: 30px" class="gongchuang">
        <p class="has-line-data" data-line-start="4" data-line-end="5">
          感谢您花几分钟时间阅读
          <strong>RiseV共创计划1.0</strong
          >。我们深知，每一位用户都是我们宝贵的伙伴，您的每一条建议和需求都可能成为我们进步的阶梯。因此，我们诚挚地邀请您参与到<strong>RiseV共创计划1.0</strong>中来，与我们一起探索和创造更高效、更智能的办公工具。
        </p>
        <p class="has-line-data" data-line-start="6" data-line-end="7">
          <strong>共创计划宗旨：</strong>
        </p>
        <ul>
          <li class="has-line-data" data-line-start="9" data-line-end="10">
            <strong>免费共享</strong>:
            我们致力于打造免费纯净的创新工具，以满足您的个性化办公需求，让每个人都能享受到高效、便捷的工作体验。
          </li>
          <li class="has-line-data" data-line-start="10" data-line-end="12">
            <strong>共创共赢</strong
            >：我们相信，通过集思广益，可以创造出更符合用户需求的产品。
          </li>
        </ul>
        <p class="has-line-data" data-line-start="17" data-line-end="18">
          <strong>您将获得：</strong>
        </p>
        <ul>
          <li class="has-line-data" data-line-start="18" data-line-end="19">
            <strong>专属礼品</strong
            >：为感谢您的宝贵意见，我们将为积极参与共创计划的用户提供精美文创礼品。
          </li>
          <li class="has-line-data" data-line-start="19" data-line-end="20">
            <strong>优先体验</strong
            >：您将有机会第一时间体验我们新开发的工具和功能。
          </li>
          <li class="has-line-data" data-line-start="20" data-line-end="22">
            <strong>个性化服务</strong
            >：根据您的反馈，我们将提供更加个性化的服务和支持。
          </li>
        </ul>
        <p class="has-line-data" data-line-start="22" data-line-end="23">
          <strong>如何参与：</strong>
        </p>
        <p class="has-line-data" data-line-start="24" data-line-end="25">
          电脑访问：<a href="https://nav.risev.cn/">https://nav.risev.cn/</a>
        </p>
        <ol>
          <li class="has-line-data" data-line-start="25" data-line-end="26">
            <strong>提出需求</strong
            >：如果您在行业日常办公中遇到效率提升的需求，而现有工具无法满足，我们将根据您的具体需求定制开发新工具。例如：文件批量处理、一些繁琐的定时任务等等。一旦开发完成，这些工具将向所有用户开放，供大家免费使用，共同助力实现<strong>高效工作</strong>的目标。
          </li>
          <li class="has-line-data" data-line-start="26" data-line-end="27">
            <strong>使用反馈</strong
            >：如果您在使用过程中有任何建议或遇到问题，欢迎随时通过我们的反馈给我们。您的每条反馈都是我们改进服务、优化产品的重要参考，帮助我们不断进步，以提供更优质的用户体验。
          </li>
        </ol>
        <p class="has-line-data" data-line-start="29" data-line-end="30">
          我们相信，您的支持将使RiseV共创计划1.0成为一个充满生机和创新的社区。让我们携手共创，共同探索和实现更加便捷、高效的工作解决方案。
        </p>
        <h3 class="code-line" data-line-start="31" data-line-end="32">
          <a id="_31"></a><strong>用户反馈与联系指南</strong>
        </h3>
        <p class="has-line-data" data-line-start="33" data-line-end="34">
          为了确保我们能够及时与您取得联系，并在您提供宝贵意见后，方便地为您发放礼品，我们提供了以下联系方式：
        </p>
        <ul>
          <li class="has-line-data" data-line-start="35" data-line-end="36">
            <strong>官方网站</strong>：<a href="https://nav.risev.cn/"
              >https://nav.risev.cn/</a
            > —— 访问我们的网站，了解产品信息。
          </li>
          <li class="has-line-data" data-line-start="36" data-line-end="37">
            <strong>电子邮箱</strong>：<a
              ><span style="color: blue">info@risev.cn</span></a
            > —— 发送邮件至我们的官方邮箱，我们将有专人负责回复您的咨询和需求。
          </li>
          <li class="has-line-data" data-line-start="37" data-line-end="39">
            <strong>微信公众号</strong>：RiseV——
            关注我们的微信公众号，获取最新动态和专属福利。
          </li>
        </ul>
        <p class="has-line-data" data-line-start="39" data-line-end="40">
          <strong>重要提示：</strong>
        </p>
        <ul>
          <li class="has-line-data" data-line-start="41" data-line-end="42">
            请在联系我们时，提供您的联系方式和需求详情，以便我们更好地理解您的需求并及时响应。
          </li>
          <li class="has-line-data" data-line-start="42" data-line-end="43">
            获奖用户将通过以上渠道收到通知，请保持通讯畅通，以免错过礼品发放。
          </li>
        </ul>
        <p class="has-line-data" data-line-start="45" data-line-end="46">
          <strong>RiseV共创计划1.0</strong>，期待您的参与！
        </p>
      </div>
    </el-scrollbar>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <div class="admin-menu">
    <el-dropdown trigger="click" @command="handleCommand">
      <el-button type="primary" circle class="admin-btn">
        <el-icon><Plus /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="addTool">添加工具</el-dropdown-item>
          <el-dropdown-item command="addCategory">添加分类</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <el-dialog v-model="toolDialogVisible" title="添加工具" width="400px">
    <tool-manager @success="handleSuccess" @cancel="toolDialogVisible = false" />
  </el-dialog>

  <el-dialog v-model="categoryDialogVisible" :title="categoryDialogTitle" width="350px">
    <category-manager 
      @success="handleSuccess" 
      @cancel="categoryDialogVisible = false"
      :is-edit="isEditCategory"
      :category-data="currentCategory"
    />
  </el-dialog>
</template>

<script setup>
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import ToolsList from "@/components/tools-list";
import FastOpen from "@/components/fast-open";
import { useStore } from "vuex";
import { onMounted, ref, computed, provide } from "vue";
//便签组件
import Bianqian from "@/components/fast-open/note/index.vue";
import { Plus } from '@element-plus/icons-vue'
import ToolManager from '@/components/tool-manager/index.vue'
import CategoryManager from '@/components/category-manager/index.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import dataService from '@/services/data'
import BottomNav from "@/components/bottom-nav/index.vue";

const dialogVisible = ref(false);
const showRiseVComponent = ref(false);
const toolDialogVisible = ref(false)
const categoryDialogVisible = ref(false)
const isEditCategory = ref(false)
const currentCategory = ref(null)
const categoryDialogTitle = computed(() => isEditCategory.value ? '编辑分类' : '添加分类')

const clickRiseVComponent = () => {
  showRiseVComponent.value = !showRiseVComponent.value;
};

const handleCommand = (command) => {
  switch (command) {
    case 'addTool':
      toolDialogVisible.value = true
      break
    case 'addCategory':
      isEditCategory.value = false
      currentCategory.value = null
      categoryDialogVisible.value = true
      break
  }
}

const handleEditCategory = (category) => {
  currentCategory.value = { ...category }
  isEditCategory.value = true
  categoryDialogVisible.value = true
}

const handleDeleteCategory = async (category) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await dataService.deleteCategory(category.weight)
    ElMessage.success('删除成功')
    
    // 删除成功后重新加载页面，此时会使用默认分类
    window.location.reload()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleSuccess = () => {
  toolDialogVisible.value = false
  categoryDialogVisible.value = false
  // 刷新数据
  window.location.reload()
}

// 提供方法给子组件
provide('categoryActions', {
  handleEditCategory,
  handleDeleteCategory
})

const isEditTool = ref(false);
const currentTool = ref(null);
const toolDialogTitle = computed(() => isEditTool.value ? '编辑工具' : '添加工具');

const handleEditTool = (tool) => {
  currentTool.value = { ...tool };
  isEditTool.value = true;
  toolDialogVisible.value = true;
}
</script>

<style lang="less" scoped>
.index {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-repeat: no-repeat;
  background-image: var(--body-img) !important;
  background-size: cover;
  background-color: #f5f7ff !important;
  color: var(--text-color) !important;
  display: flex;
  flex-direction: column;

  .main-container {
    flex: 1 1 1px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .search-bar {
      margin-top: 30px;
    }

    .tools-list {
      margin-top: 40px;
      flex: 1 1 1px;
    }
  }
}

.toggle-theme {
  position: fixed;
  right: 30px;
  top: 50px;
  width: 42px;
  height: 42px;
  border-radius: 50px;
  box-shadow: var(--el-box-shadow-lighter) !important;
  cursor: pointer;

  .icon {
    width: 100%;
    height: 100%;
    color: #333;
  }
}

.feedback {
  position: fixed;
  right: 30px;
  bottom: 75px;
  width: 42px;
  height: 42px;
  border-radius: 50px;
  box-shadow: var(--el-box-shadow-light) !important;
  cursor: pointer;

  .icon {
    width: 100%;
    height: 100%;
    color: #333;
    font-size: 20px;
  }
}

.more {
  position: fixed;
  right: 30px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  box-shadow: var(--el-box-shadow-light) !important;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-risev {
  padding-bottom: 14px;
}

.gongchuang {
  width: 100%;
  height: auto;
  overflow-y: auto;
}

.admin-menu {
  position: fixed;
  right: 30px;
  bottom: 80px;
  z-index: 999;
}

.admin-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.logo-text {
  font-size: 36px;
  font-weight: bold;
  color: #4169E1;
}

.logo-suffix {
  font-size: 24px;
  margin-left: 8px;
  color: var(--text-color);
}
</style>
<style lang="less">
.el-dialog {
  border-radius: 10px;
  color: var(--text-color) !important;
}

.el-dialog__body {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
