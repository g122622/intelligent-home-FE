<template>
  <div class="guest-permission">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>访客权限管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            添加访客
          </el-button>
        </div>
      </template>

      <!-- 访客列表 -->
      <el-table :data="guestList" style="width: 100%">
        <el-table-column prop="username" label="访客姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="权限设备">
          <template #default="{ row }">
            <el-tag
              v-for="device in row.devices"
              :key="device.id"
              class="mx-1"
              type="info"
            >
              {{ device.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expireTime" label="有效期" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '活跃' : '已过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              size="small"
              type="danger"
              @click="revokePermission(row.id)"
              v-if="row.status === 'active'"
            >
              回收权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加访客对话框 -->
    <el-dialog v-model="showAddDialog" title="添加访客权限" width="600px">
      <el-form :model="guestForm" label-width="80px">
        <el-form-item label="手机号" required>
          <el-input v-model="guestForm.phone" placeholder="请输入访客手机号" />
        </el-form-item>
        <el-form-item label="有效期" required>
          <el-date-picker
            v-model="guestForm.expireTime"
            type="datetime"
            placeholder="选择权限有效期"
          />
        </el-form-item>
        <el-form-item label="设备权限">
          <el-checkbox-group v-model="guestForm.devicePermissions">
            <el-checkbox
              v-for="device in availableDevices"
              :key="device.id"
              :label="device.id"
            >
              {{ device.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addGuestPermission">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from '@/utils/message'
import { getHomeDetail } from '@/api/home'

interface GuestPermission {
  id: number
  username: string
  phone: string
  devices: Array<{ id: number; name: string }>
  expireTime: string
  status: 'active' | 'expired'
}

interface DeviceInfo {
  id: number
  name: string
  typeName: string
}

const showAddDialog = ref(false)
const guestList = ref<GuestPermission[]>([])
const availableDevices = ref<DeviceInfo[]>([])

const guestForm = reactive({
  phone: '',
  expireTime: '',
  devicePermissions: [] as number[]
})

// 加载家庭设备和访客权限数据
const loadHomeData = async () => {
  try {
    // 这里应该调用API获取家庭详情，包含设备信息
    // 假设homeId为1，实际应该从store或路由参数获取
    const response = await getHomeDetail(1)
    availableDevices.value = response.data?.devices || []
    
    // 模拟访客数据（实际应该从API获取）
    guestList.value = [
      {
        id: 1,
        username: '访客用户',
        phone: '13800138001',
        devices: availableDevices.value.slice(0, 2),
        expireTime: '2024-12-31 23:59:59',
        status: 'active'
      }
    ]
  } catch (error) {
    message('加载数据失败', { type: 'error' })
  }
}

// 添加访客权限
const addGuestPermission = () => {
  // 这里应该调用API添加访客权限
  message('访客权限添加成功', { type: 'success' })
  showAddDialog.value = false
  loadHomeData()
}

// 回收权限
const revokePermission = (id: number) => {
  // 这里应该调用API回收权限
  message('权限回收成功', { type: 'success' })
  loadHomeData()
}

onMounted(() => {
  loadHomeData()
})
</script>

<style scoped>
.guest-permission {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mx-1 {
  margin: 0 4px;
}
</style>