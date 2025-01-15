<template>
  <div class="version">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>版本说明监控</h2>
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
            <el-tag size="large">{{ latestVersion.version || '-' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="更新日期">
            {{ formatDate(latestVersion.date) || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="更新内容">
            <div v-if="latestVersion.updates" class="updates-content">
              <div v-for="(update, index) in latestVersion.updates" :key="index" class="update-item">
                <template v-if="update.includes('【组件更新】')">
                  <div class="update-title">🔧 组件更新</div>
                </template>
                <template v-else-if="update.includes('【接口更新】')">
                  <div class="update-title">🔌 接口更新</div>
                </template>
                <template v-else>
                  <div :class="{ 'component-item': update.startsWith('【') }">
                    {{ update }}
                  </div>
                </template>
              </div>
            </div>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 历史记录 -->
        <div class="history-section">
          <h3>历史记录</h3>
          <el-timeline v-loading="historyLoading">
            <el-timeline-item
              v-for="(version, index) in versionHistory"
              :key="index"
              :timestamp="formatDate(version.date)"
              placement="top"
            >
              <el-card>
                <h4>版本 {{ version.version }}</h4>
                <div class="updates-content">
                  <div v-for="(update, uIndex) in version.updates" :key="uIndex" class="update-item">
                    <template v-if="update.includes('【组件更新】')">
                      <div class="update-title">🔧 组件更新</div>
                    </template>
                    <template v-else-if="update.includes('【接口更新】')">
                      <div class="update-title">🔌 接口更新</div>
                    </template>
                    <template v-else>
                      <div :class="{ 'component-item': update.startsWith('【') }">
                        {{ update }}
                      </div>
                    </template>
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
import { getLatestVersion, getVersionHistory } from '@/services/api'

const latestVersion = ref({})
const versionHistory = ref([])
const loading = ref(false)
const historyLoading = ref(false)
let refreshTimer = null

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    // 如果是 "2024-11-12" 这样的格式
    return dateStr
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取最新版本数据
const fetchLatestData = async () => {
  try {
    loading.value = true
    latestVersion.value = await getLatestVersion()
  } catch (error) {
    console.error('获取版本数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 获取历史记录
const fetchHistoryData = async () => {
  try {
    historyLoading.value = true
    const history = await getVersionHistory()
    versionHistory.value = history.sort((a, b) => {
      // 按日期降序排序
      return new Date(b.date) - new Date(a.date)
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
.version {
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

.updates-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.update-item {
  line-height: 1.5;
}

.update-title {
  font-weight: bold;
  color: #409EFF;
  margin: 10px 0;
}

.component-item {
  margin-left: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

:deep(.el-timeline-item__content) {
  min-width: 300px;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
}

:deep(.el-card__body) {
  padding: 15px;
}
</style> 