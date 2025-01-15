<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="monitor-card" @click="$router.push('/version')">
          <template #header>
            <div class="card-header">
              <h2>版本说明监控</h2>
              <el-tag v-if="versionData.latest" size="large">{{ versionData.latest.version }}</el-tag>
            </div>
          </template>
          <div class="card-content" v-loading="versionLoading">
            <template v-if="versionData.latest">
              <div class="info-item">
                <span class="label">更新日期：</span>
                <span>{{ versionData.latest.date }}</span>
              </div>
              <div class="info-item">
                <span class="label">最近检查：</span>
                <span>{{ formatDate(versionData.lastCheck) }}</span>
              </div>
              <div class="updates-preview" v-if="versionData.latest.updates">
                <div class="update-item" v-for="(update, index) in versionData.latest.updates.slice(0, 2)" :key="index">
                  {{ update }}
                </div>
                <div class="more" v-if="versionData.latest.updates.length > 2">
                  <el-link type="primary">查看更多</el-link>
                </div>
              </div>
            </template>
            <div v-else class="no-data">暂无数据</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="monitor-card" @click="$router.push('/loader')">
          <template #header>
            <div class="card-header">
              <h2>加载器监控</h2>
              <el-tag v-if="loaderData.latest" size="large" type="success">{{ loaderData.latest.version }}</el-tag>
            </div>
          </template>
          <div class="card-content" v-loading="loaderLoading">
            <template v-if="loaderData.latest">
              <div class="info-item">
                <span class="label">规范版本：</span>
                <el-tag size="small">{{ loaderData.latest.spec }}</el-tag>
              </div>
              <div class="info-item">
                <span class="label">文件名：</span>
                <span class="file-name">{{ loaderData.latest.text }}</span>
              </div>
              <div class="info-item">
                <span class="label">最近检查：</span>
                <span>{{ formatDate(loaderData.lastCheck) }}</span>
              </div>
              <div class="download-link">
                <el-button type="primary" link :href="loaderData.latest.url" target="_blank">
                  <el-icon><Download /></el-icon>
                  下载最新版本
                </el-button>
              </div>
            </template>
            <div v-else class="no-data">暂无数据</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getLatestVersion, getLatestLoader } from '@/services/api'

const versionData = ref({ latest: null, lastCheck: null })
const loaderData = ref({ latest: null, lastCheck: null })
const versionLoading = ref(false)
const loaderLoading = ref(false)

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

const fetchVersionData = async () => {
  try {
    versionLoading.value = true
    const latest = await getLatestVersion()
    const lastCheck = latest.lastCheck || new Date().toISOString()
    versionData.value = { latest, lastCheck }
  } catch (error) {
    console.error('获取版本数据失败:', error)
    ElMessage.error('获取版本数据失败')
  } finally {
    versionLoading.value = false
  }
}

const fetchLoaderData = async () => {
  try {
    loaderLoading.value = true
    const latest = await getLatestLoader()
    const lastCheck = latest.lastCheck || new Date().toISOString()
    loaderData.value = { latest, lastCheck }
  } catch (error) {
    console.error('获取加载器数据失败:', error)
    ElMessage.error('获取加载器数据失败')
  } finally {
    loaderLoading.value = false
  }
}

onMounted(() => {
  fetchVersionData()
  fetchLoaderData()
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.monitor-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.monitor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
}

.card-content {
  min-height: 200px;
  padding: 10px 0;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.label {
  color: #666;
  width: 80px;
}

.file-name {
  color: #409EFF;
  font-family: monospace;
}

.updates-preview {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.update-item {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more {
  text-align: center;
  margin-top: 10px;
}

.download-link {
  margin-top: 15px;
  text-align: center;
}

.no-data {
  text-align: center;
  color: #999;
  margin-top: 50px;
}
</style> 