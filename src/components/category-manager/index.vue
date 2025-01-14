<template>
  <div class="category-manager">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      
      <el-form-item label="排序权重" prop="weight">
        <el-input-number v-model="form.weight" :min="1" :max="9999" />
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="submitForm(formRef)">
        {{ isEdit ? '保存' : '确认' }}
      </el-button>
    </div>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="30%"
      :before-close="handleCloseDelete"
    >
      <span>确定要删除该分类吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dataService from '@/services/data.js'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  categoryData: {
    type: Object,
    default: () => ({})
  }
})

const formRef = ref()
const form = ref({
  name: '',
  weight: 1,
  is_active: true
})

const deleteDialogVisible = ref(false)

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入排序权重', trigger: 'blur' }]
}

onMounted(async () => {
  if (props.isEdit && props.categoryData) {
    form.value = { ...props.categoryData }
  } else {
    // 新增时自动获取下一个权重值
    try {
      form.value.weight = await dataService.getNextWeight()
    } catch (error) {
      console.error('获取权重值失败:', error)
      ElMessage.error('获取权重值失败')
    }
  }
})

const submitForm = async (formEl) => {
  if (!formEl) return
  
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (props.isEdit) {
          await dataService.updateCategory(props.categoryData.weight, form.value)
          ElMessage.success('更新成功')
        } else {
          await dataService.addCategory(form.value)
          ElMessage.success('添加成功')
        }
        emit('success')
      } catch (error) {
        console.error(props.isEdit ? '更新分类失败:' : '添加分类失败:', error)
        ElMessage.error(error.message || (props.isEdit ? '更新失败' : '添加失败'))
      }
    }
  })
}

const handleDelete = () => {
  deleteDialogVisible.value = true
}

const handleCloseDelete = () => {
  deleteDialogVisible.value = false
}

const confirmDelete = async () => {
  try {
    await dataService.deleteCategory(props.categoryData.id)
    ElMessage.success('删除成功')
    deleteDialogVisible.value = false
    emit('success')
  } catch (error) {
    console.error('删除分类失败:', error)
    ElMessage.error(error.message || '删除失败')
  }
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