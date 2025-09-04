<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps<{
  homeId: number;
}>();

const homeStore = useHomeStore();
const loading = ref(false);
const showPermissionForm = ref(false);
const editingPermission = ref<any>(null);

// 加载权限数据
const loadPermissions = async () => {
  loading.value = true;
  try {
    // 这里需要实现获取权限列表的API调用
    // await homeStore.fetchPermissions(props.homeId);
  } catch (error) {
    ElMessage.error("加载权限数据失败");
  } finally {
    loading.value = false;
  }
};

// 添加权限
const addPermission = () => {
  editingPermission.value = null;
  showPermissionForm.value = true;
};

// 编辑权限
const editPermission = (permission: any) => {
  editingPermission.value = { ...permission };
  showPermissionForm.value = true;
};

// 删除权限
const deletePermission = async (permission: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除权限吗？此操作不可恢复。`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    await homeStore.cancelPermission(permission.id);
    ElMessage.success("权限删除成功");
    await loadPermissions();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除权限失败");
    }
  }
};

// 提交权限表单
const submitPermissionForm = async (formData: any) => {
  try {
    if (editingPermission.value) {
      // 编辑权限
      // await homeStore.updatePermission(props.homeId, formData);
    } else {
      // 添加权限
      await homeStore.addPermission(props.homeId, formData);
    }
    ElMessage.success("权限操作成功");
    showPermissionForm.value = false;
    await loadPermissions();
  } catch (error) {
    ElMessage.error("权限操作失败");
  }
};

onMounted(() => {
  loadPermissions();
});
</script>

<template>
  <el-card class="permission-manager-card">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">权限管理</h3>
        <el-button type="primary" size="small" @click="addPermission">
          <el-icon><plus /></el-icon>
          添加权限
        </el-button>
      </div>
    </template>

    <div class="permission-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="homeStore.permissions.length === 0" class="empty-state">
        <el-empty description="暂无权限数据" />
        <div class="empty-actions">
          <el-button type="primary" @click="addPermission">
            添加第一个权限
          </el-button>
        </div>
      </div>

      <el-table v-else :data="homeStore.permissions" style="width: 100%">
        <el-table-column label="权限ID" prop="id" width="80" />
        <el-table-column label="用户ID" prop="userId" width="100" />
        <el-table-column label="设备ID" prop="deviceId" width="100" />
        <el-table-column label="操作权限" prop="operationId" width="120">
          <template #default="{ row }">
            <el-tag size="small">
              {{ row.operationId }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="有效期" width="180">
          <template #default="{ row }">
            {{ new Date(row.endTime).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.hasPermission ? 'success' : 'danger'"
              size="small"
            >
              {{ row.hasPermission ? "有效" : "无效" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="editPermission(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              @click="deletePermission(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 权限表单对话框 -->
    <el-dialog
      v-model="showPermissionForm"
      :title="editingPermission ? '编辑权限' : '添加权限'"
      width="600px"
    >
      <el-form :model="editingPermission" label-width="100px">
        <el-form-item label="用户ID">
          <el-input
            v-model="editingPermission.userId"
            type="number"
            placeholder="请输入用户ID"
          />
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input
            v-model="editingPermission.deviceId"
            type="number"
            placeholder="请输入设备ID"
          />
        </el-form-item>
        <el-form-item label="操作权限">
          <el-select
            v-model="editingPermission.operationId"
            placeholder="请选择操作权限"
          >
            <el-option label="查看" :value="1" />
            <el-option label="控制" :value="2" />
            <el-option label="管理" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="editingPermission.endTime"
            type="datetime"
            placeholder="选择有效期"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="权限状态">
          <el-switch
            v-model="editingPermission.hasPermission"
            active-text="有效"
            inactive-text="无效"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showPermissionForm = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitPermissionForm(editingPermission)"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.permission-manager-card {
  border: none;
  border-radius: 12px;

  :deep(.el-card__header) {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  :deep(.el-card__body) {
    padding: 20px;
  }

  .permission-content {
    .loading-container {
      padding: 40px 0;
    }

    .empty-state {
      padding: 40px 0;
      text-align: center;

      .empty-actions {
        margin-top: 20px;
      }
    }
  }
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start !important;
  }

  :deep(.el-table) {
    .el-table__cell {
      padding: 8px 0;
    }
  }
}

@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 90% !important;

    .el-form {
      .el-form-item {
        margin-bottom: 16px;

        .el-form-item__label {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
