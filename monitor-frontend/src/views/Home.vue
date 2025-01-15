<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="monitor-card" @click="$router.push('/version')">
          <h2>版本说明监控</h2>
          <p>监控快应用版本说明更新</p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="monitor-card" @click="$router.push('/loader')">
          <h2>加载器监控</h2>
          <p>监控快应用加载器更新</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.home {
  padding: 20px;
}

.monitor-card {
  cursor: pointer;
  transition: all 0.3s;
}

.monitor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

h2 {
  margin: 0 0 10px 0;
}

p {
  margin: 0;
  color: #666;
}
</style> 