<template>
  <div class="permission-demo">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限控制演示</span>
        </div>
      </template>

      <el-alert title="当前用户角色" :description="currentRole" type="info" class="mb-4" />
      
      <div class="demo-section">
        <h3>1. 按钮权限控制</h3>
        <div class="button-group">
          <el-button type="primary" v-perms="{ role: 'owner' }">
            房主专属按钮
          </el-button>
          <el-button type="success" v-perms="{ role: 'member' }">
            家庭成员按钮
          </el-button>
          <el-button type="warning" v-perms="{ role: 'guest' }">
            访客按钮
          </el-button>
          <el-button type="info" v-perms="'btn.edit'">
            编辑权限按钮
          </el-button>
        </div>
      </div>

      <div class="demo-section">
        <h3>2. 菜单权限控制</h3>
        <el-menu class="demo-menu">
          <el-menu-item index="1" v-perms="{ role: 'owner' }">
            <template #title>房主专属菜单</template>
          </el-menu-item>
          <el-menu-item index="2" v-perms="{ role: 'member' }">
            <template #title>家庭成员菜单</template>
          </el-menu-item>
          <el-menu-item index="3" v-perms="{ role: 'guest' }">
            <template #title>访客菜单</template>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="demo-section">
        <h3>3. 卡片权限控制</h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card v-perms="{ role: 'owner' }" class="demo-card">
              <template #header>房主专属功能</template>
              <p>只有房主可以看到这个卡片</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card v-perms="{ role: 'member' }" class="demo-card">
              <template #header>家庭成员功能</template>
              <p>家庭成员可以看到这个卡片</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card v-perms="{ role: 'guest' }" class="demo-card">
              <template #header>访客功能</template>
              <p>访客可以看到这个卡片</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentRole = ref('')

onMounted(() => {
  currentRole.value = localStorage.getItem('userRole') || '未登录'
})
</script>

<style scoped>
.permission-demo {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.demo-section {
  margin-bottom: 30px;
}

.demo-section h3 {
  margin-bottom: 15px;
  color: #606266;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.demo-menu {
  width: 300px;
  border: 1px solid #e6e6e6;
}

.demo-card {
  min-height: 120px;
}

.mb-4 {
  margin-bottom: 20px;
}
</style>