<template>
  <div class="note-container">
    <div class="note-header">
      <span>便签</span>
      <el-icon class="close-icon" @click="$emit('close')">
        <Close />
      </el-icon>
    </div>
    <div class="note-content">
      <el-input
        v-model="noteContent"
        type="textarea"
        :rows="8"
        placeholder="写点什么..."
        @input="saveNote"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Close } from '@element-plus/icons-vue'

const noteContent = ref('')

const saveNote = () => {
  localStorage.setItem('risev_note_content', noteContent.value)
}

onMounted(() => {
  const savedNote = localStorage.getItem('risev_note_content')
  if (savedNote) {
    noteContent.value = savedNote
  }
})
</script>

<style lang="less" scoped>
.note-container {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  
  .note-header {
    padding: 12px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .close-icon {
      cursor: pointer;
      color: #909399;
      
      &:hover {
        color: #409EFF;
      }
    }
  }
  
  .note-content {
    padding: 12px;
    
    :deep(.el-textarea__inner) {
      border: none;
      
      &:focus {
        box-shadow: none;
      }
    }
  }
}
</style> 