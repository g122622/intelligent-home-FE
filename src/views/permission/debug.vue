<template>
  <div class="permission-debug">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限调试页面</span>
          <el-button @click="refresh">刷新状态</el-button>
        </div>
      </template>

      <el-alert :title="`当前用户角色: ${currentRole}`" type="info" class="mb-4" />
      <el-alert :title="`user-info 存储: ${userInfoStr}`" type="warning" class="mb-4" />
      
      <div class="debug-section">
        <h3>权限指令测试</h3>
        <div class="test-items">
          <div class="test-item">
            <span>房主按钮: </span>
            <el-button v-perms="{ role: 'owner' }" size="small">房主专属</el-button>
            <span class="status">{{ hasOwnerPermission ? '可见' : '隐藏' }}</span>
          </div>
          <div class="test-item">
            <span>成员按钮: </span>
            <el-button v-perms="{ role: 'member' }" size="small">成员专属</el-button>
            <span class="status">{{ hasMemberPermission ? '可见' : '隐藏' }}</span>
          </div>
          <div class="test-item">
            <span>访客按钮: </span>
            <el-button v-perms="{ role: 'guest' }" size="small">访客专属</el-button>
            <span class="status">{{ hasGuestPermission ? '可见' : '隐藏' }}</span>
          </div>
        </div>
      </div>

      <div class="debug-section">
        <h3>路由权限测试</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="访客权限管理路由">
            {{ canAccessGuestPermission ? '可访问' : '不可访问' }}
          </el-descriptions-item>
          <el-descriptions-item label="权限演示路由">
            {{ canAccessDemo ? '可访问' : '不可访问' }}
          </el-descriptions-item>
          <el-descriptions-item label="权限测试路由">
            {{ canAccessTest ? '可访问' : '不可访问' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="debug-section">
        <h3>存储状态</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="userRole (localStorage)">
            {{ localStorage.userRole || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="user-info (localStorage)">
            {{ localStorageInfo }}
          </el-descriptions-item>
          <el-descriptions-item label="Store 中的角色">
            {{ storeRoles }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { hasRole } from '@/utils/auth'
import { useUserStoreHook } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStoreHook()
const currentRole = ref('')
const userInfoStr = ref('')

const hasOwnerPermission = computed(() => hasRole('owner'))
const hasMemberPermission = computed(() => hasRole('member'))
const hasGuestPermission = computed(() => hasRole('guest'))

const canAccessGuestPermission = computed(() => hasRole('owner'))
const canAccessDemo = computed(() => hasRole('owner') || hasRole('member') || hasRole('guest'))
const canAccessTest = computed(() => hasRole('owner') || hasRole('member') || hasRole('guest'))

const localStorageInfo = computed(() => {
  const info = localStorage.getItem('user-info')
  return info ? JSON.parse(info) : '未设置'
})

const storeRoles = computed(() => {
  return userStore.roles.join(', ') || '未设置'
})

const refresh = () => {
  currentRole.value = localStorage.getItem('userRole') || '未登录'
  const userInfo = localStorage.getItem('user-info')
  userInfoStr.value = userInfo ? JSON.stringify(JSON.parse(userInfo)) : '未设置'
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
.permission-debug {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-section {
  margin-bottom: 30px;
}

.debug-section h3 {
  margin-bottom: 15px;
  color: #606266;
}

.test-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.test-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  color: #67c23a;
  font-weight: bold;
}

.mb-4 {
  margin-bottom: 20px;
}
</style>