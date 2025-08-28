<template>
  <div class="permission-test">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限系统测试</span>
          <el-button @click="refresh">刷新权限状态</el-button>
        </div>
      </template>

      <el-alert :title="`当前用户角色: ${currentRole}`" type="info" class="mb-4" />
      
      <div class="test-section">
        <h3>权限指令测试</h3>
        <div class="test-buttons">
          <el-button v-perms="{ role: 'owner' }" type="primary">
            房主按钮 (v-perms="{ role: 'owner' }")
          </el-button>
          <el-button v-perms="{ role: 'member' }" type="success">
            成员按钮 (v-perms="{ role: 'member' }")
          </el-button>
          <el-button v-perms="{ role: 'guest' }" type="warning">
            访客按钮 (v-perms="{ role: 'guest' }")
          </el-button>
        </div>
      </div>

      <div class="test-section">
        <h3>编程式权限检查</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="hasRole('owner')">
            {{ hasOwnerPermission }}
          </el-descriptions-item>
          <el-descriptions-item label="hasRole('member')">
            {{ hasMemberPermission }}
          </el-descriptions-item>
          <el-descriptions-item label="hasRole('guest')">
            {{ hasGuestPermission }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="test-section">
        <h3>切换角色测试</h3>
        <el-radio-group v-model="testRole" @change="changeTestRole">
          <el-radio-button label="owner">房主</el-radio-button>
          <el-radio-button label="member">家庭成员</el-radio-button>
          <el-radio-button label="guest">访客</el-radio-button>
        </el-radio-group>
        <p class="tip">注意：这只是前端模拟，实际角色由登录时确定</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { hasRole } from '@/utils/auth'

const currentRole = ref('')
const testRole = ref('')

const hasOwnerPermission = computed(() => hasRole('owner'))
const hasMemberPermission = computed(() => hasRole('member'))
const hasGuestPermission = computed(() => hasRole('guest'))

const refresh = () => {
  currentRole.value = localStorage.getItem('userRole') || '未登录'
}

const changeTestRole = (role: string) => {
  localStorage.setItem('userRole', role)
  currentRole.value = role
  location.reload() // 重新加载页面使权限生效
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.permission-test {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-section {
  margin-bottom: 30px;
}

.test-section h3 {
  margin-bottom: 15px;
  color: #606266;
}

.test-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tip {
  margin-top: 10px;
  color: #909399;
  font-size: 12px;
}

.mb-4 {
  margin-bottom: 20px;
}
</style>