<template>
  <div class="tool-manager">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="工具名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入工具名称" />
      </el-form-item>
      
      <el-form-item label="工具链接" prop="url">
        <el-input v-model="form.url" placeholder="请输入工具链接" />
      </el-form-item>
      
      <el-form-item label="工具简介" prop="shorthand">
        <el-input v-model="form.shorthand" placeholder="请输入工具简介" />
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
      <el-button type="primary" @click="submitForm(formRef)">
        {{ isEdit ? '保存' : '确认' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dataService from '@/services/data'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  toolData: {
    type: Object,
    default: () => ({})
  }
})

const formRef = ref()
const form = ref({
  name: '',
  url: '',
  shorthand: '',
  category: ''
})
const categories = ref([])

const rules = {
  name: [{ required: true, message: '请输入工具名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入工具链接', trigger: 'blur' }],
  shorthand: [{ required: true, message: '请输入工具简介', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

onMounted(async () => {
  // 获取分类列表
  categories.value = await dataService.getCategories()
  
  if (props.isEdit && props.toolData) {
    form.value = { ...props.toolData }
  }
})

const submitForm = async (formEl) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (props.isEdit) {
          await dataService.updateTool(props.toolData.id, form.value)
          ElMessage.success('更新成功')
        } else {
          await dataService.addTool(form.value)
          ElMessage.success('添加成功')
        }
        emit('success')
      } catch (error) {
        console.error(props.isEdit ? '更新工具失败:' : '添加工具失败:', error)
        ElMessage.error(error.message || (props.isEdit ? '更新失败' : '添加失败'))
      }
    }
  })
}

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