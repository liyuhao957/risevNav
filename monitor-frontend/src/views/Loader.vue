<template>
  <div class="loader">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>加载器监控</h2>
          <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        </div>
      </template>
      <div class="content">
        <el-descriptions title="最新版本" :column="1" border>
          <el-descriptions-item label="版本号">{{ latestLoader.version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="规范版本">{{ latestLoader.spec || '-' }}</el-descriptions-item>
          <el-descriptions-item label="文件名">{{ latestLoader.text || '-' }}</el-descriptions-item>
          <el-descriptions-item label="下载链接">
            <el-link v-if="latestLoader.url" :href="latestLoader.url" type="primary" target="_blank">
              点击下载
            </el-link>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const latestLoader = ref({})

// TODO: 实现数据获取逻辑
</script>

<style scoped>
.loader {
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