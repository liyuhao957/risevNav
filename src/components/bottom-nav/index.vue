<template>
  <div class="bottom-nav">
    <div class="nav-item" @click="openMonitor">
      <el-icon><Monitor /></el-icon>
      <span>监控中心</span>
    </div>
  </div>
</template>

<script setup>
import { Monitor } from '@element-plus/icons-vue'

const openMonitor = () => {
  window.open('/monitor', '_blank')
}
</script>

<style lang="less" scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--el-bg-color);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.3s;
  color: var(--el-text-color-primary);

  .el-icon {
    font-size: 24px;
  }

  span {
    font-size: 12px;
    margin-top: 4px;
  }

  &:hover {
    color: var(--el-color-primary);
  }
}
</style> 