<template>
  <div class="category-manager">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      
      <el-form-item label="排序权重" prop="weight">
        <el-input-number v-model="form.weight" :min="1" />
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import dataService from '@/services/data.js'

const formRef = ref()
const form = ref({
  name: '',
  weight: 1,
  is_active: true
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入排序权重', trigger: 'blur' }]
}

const submitForm = async (formEl) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 调用数据服务添加分类
        await dataService.addCategory(form.value)
        ElMessage.success('添加成功')
        emit('success')
      } catch (error) {
        console.error('添加分类失败:', error)
        ElMessage.error('添加失败')
      }
    }
  })
}

const emit = defineEmits(['cancel', 'success'])
</script>

<style lang="less" scoped>
.category-manager {
  padding: 20px;
}

.dialog-footer {
  margin-top: 20px;
  text-align: right;
}
</style> 