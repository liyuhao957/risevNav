<template>
  <div class="tool-manager">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="工具名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入工具名称" />
      </el-form-item>
      
      <el-form-item label="工具链接" prop="url">
        <el-input v-model="form.url" placeholder="请输入工具链接" />
      </el-form-item>
      
      <el-form-item label="搜索关键词" prop="shorthand">
        <el-input v-model="form.shorthand" placeholder="请输入搜索关键词,用空格分隔" />
      </el-form-item>
      
      <el-form-item label="所属分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option
            v-for="item in categories"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dataService from '@/services/data.js'

const formRef = ref()
const categories = ref([])

const form = ref({
  name: '',
  url: '',
  shorthand: '',
  category: ''
})

const rules = {
  name: [{ required: true, message: '请输入工具名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入工具链接', trigger: 'blur' }],
  shorthand: [{ required: true, message: '请输入搜索关键词', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const submitForm = async (formEl) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 调用数据服务添加工具
        await dataService.addTool(form.value)
        ElMessage.success('添加成功')
        emit('success')
      } catch (error) {
        console.error('添加工具失败:', error)
        ElMessage.error('添加失败')
      }
    }
  })
}

onMounted(async () => {
  // 获取分类列表
  categories.value = await dataService.getCategories()
})

const emit = defineEmits(['cancel', 'success'])
</script>

<style lang="less" scoped>
.tool-manager {
  padding: 20px;
}

.dialog-footer {
  margin-top: 20px;
  text-align: right;
}
</style> 