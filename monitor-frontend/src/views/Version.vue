<template>
  <div class="version">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>版本说明监控</h2>
          <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        </div>
      </template>
      <div class="content">
        <el-descriptions title="最新版本" :column="1" border>
          <el-descriptions-item label="版本号">{{ latestVersion.version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="更新日期">{{ latestVersion.date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="更新内容">
            <div v-if="latestVersion.updates">
              <div v-for="(update, index) in latestVersion.updates" :key="index">
                {{ update }}
              </div>
            </div>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const latestVersion = ref({})

// TODO: 实现数据获取逻辑
</script>

<style scoped>
.version {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
}

.content {
  margin-top: 20px;
}
</style> 