<template>
  <div class="loader">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>加载器监控</h2>
          <div class="header-actions">
            <el-button type="primary" @click="refreshData">刷新</el-button>
            <el-button @click="$router.push('/')">返回首页</el-button>
          </div>
        </div>
      </template>
      <div class="content">
        <!-- 最新版本信息 -->
        <el-descriptions title="最新版本" :column="1" border v-loading="loading">
          <el-descriptions-item label="版本号">
            <el-tag size="large">{{ latestLoader.version || '-' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="规范版本">
            <el-tag type="success" size="large">{{ latestLoader.spec || '-' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="文件名">
            <div class="file-info">
              <el-tag type="info">{{ latestLoader.text || '-' }}</el-tag>
              <el-link 
                v-if="latestLoader.url" 
                :href="latestLoader.url" 
                type="primary" 
                target="_blank"
              >
                <el-button type="primary" link>
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
              </el-link>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(latestLoader.lastCheck) || '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 历史记录 -->
        <div class="history-section">
          <h3>历史记录</h3>
          <el-timeline v-loading="historyLoading">
            <el-timeline-item
              v-for="(loader, index) in loaderHistory"
              :key="index"
              :timestamp="formatDate(loader.lastCheck)"
              placement="top"
              type="primary"
            >
              <el-card>
                <template #header>
                  <div class="history-card-header">
                    <el-tag size="large">版本 {{ loader.version }}</el-tag>
                    <el-tag type="success">规范 {{ loader.spec }}</el-tag>
                  </div>
                </template>
                <div class="history-content">
                  <div class="file-info">
                    <el-tag type="info">{{ loader.text }}</el-tag>
                    <el-link 
                      v-if="loader.url" 
                      :href="loader.url" 
                      type="primary" 
                      target="_blank"
                    >
                      <el-button type="primary" link>
                        <el-icon><Download /></el-icon>
                        下载
                      </el-button>
                    </el-link>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLatestLoader, getLoaderHistory } from '@/services/api'
import { Download } from '@element-plus/icons-vue'

const latestLoader = ref({})
const loaderHistory = ref([])
const loading = ref(false)
const historyLoading = ref(false)
let refreshTimer = null

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取最新加载器数据
const fetchLatestData = async () => {
  try {
    loading.value = true
    latestLoader.value = await getLatestLoader()
  } catch (error) {
    console.error('获取加载器数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 获取历史记录
const fetchHistoryData = async () => {
  try {
    historyLoading.value = true
    const history = await getLoaderHistory()
    loaderHistory.value = history.sort((a, b) => {
      // 按日期降序排序
      return new Date(b.lastCheck) - new Date(a.lastCheck)
    })
  } catch (error) {
    console.error('获取历史记录失败:', error)
    ElMessage.error('获取历史记录失败，请稍后重试')
  } finally {
    historyLoading.value = false
  }
}

// 手动刷新
const refreshData = async () => {
  await Promise.all([fetchLatestData(), fetchHistoryData()])
  ElMessage.success('数据已刷新')
}

// 自动刷新（每5分钟）
const startAutoRefresh = () => {
  refreshTimer = setInterval(refreshData, 5 * 60 * 1000)
}

// 组件挂载时
onMounted(() => {
  refreshData()
  startAutoRefresh()
})

// 组件卸载时
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
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

.header-actions {
  display: flex;
  gap: 10px;
}

.card-header h2 {
  margin: 0;
}

.content {
  margin-top: 20px;
}

.history-section {
  margin-top: 40px;
}

.history-section h3 {
  margin-bottom: 20px;
  color: #409EFF;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.history-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-content {
  padding: 10px 0;
}

:deep(.el-timeline-item__content) {
  min-width: 300px;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
}

:deep(.el-descriptions__cell) {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 10px 15px;
}

:deep(.el-card__body) {
  padding: 15px;
}
</style> 