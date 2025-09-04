<script setup lang="ts">
import { ref } from "vue";
import { MemberInfo } from "@/api/home";
import { useHomeStore } from "@/store/modules/home";
import { ElMessage, ElMessageBox } from "element-plus";
import { User, Plus } from "@element-plus/icons-vue";

const props = defineProps<{
  members: MemberInfo[];
}>();

const homeStore = useHomeStore();
const showMemberForm = ref(false);
const editingMember = ref<MemberInfo | null>(null);

// 角色标签类型映射
const roleTagType = (role: number) => {
  switch (role) {
    case 0:
      return "success"; // 房主
    case 1:
      return "primary"; // 成员
    case 2:
      return "info"; // 访客
    default:
      return "info";
  }
};

// 添加成员
const addMember = () => {
  editingMember.value = null;
  showMemberForm.value = true;
};

// 编辑成员
const editMember = (member: MemberInfo) => {
  editingMember.value = { ...member };
  showMemberForm.value = true;
};

// 删除成员
const deleteMember = async (member: MemberInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要移除成员 "${member.username}" 吗？`,
      "确认移除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    ElMessage.success("成员移除成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("移除成员失败");
    }
  }
};

// 更改成员角色
const changeRole = async (member: MemberInfo) => {
  try {
    const { value: newRole } = await ElMessageBox.prompt(
      `请输入 ${member.username} 的新角色`,
      "更改角色",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-2]$/,
        inputErrorMessage: "请输入有效的角色编号 (0-房主, 1-成员, 2-访客)"
      }
    );

    ElMessage.success("角色更改成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("更改角色失败");
    }
  }
};
</script>

<template>
  <el-card class="member-list-card">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">成员管理</h3>
        <el-button type="primary" size="small" @click="addMember">
          <el-icon><user /></el-icon>
          添加成员
        </el-button>
      </div>
    </template>

    <div class="member-list">
      <div v-if="members.length === 0" class="empty-state">
        <el-empty description="暂无成员数据" />
      </div>

      <el-table v-else :data="members" style="width: 100%">
        <el-table-column label="用户ID" prop="userId" width="100" />
        <el-table-column label="用户名" prop="username" min-width="120" />
        <el-table-column label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="roleTagType(row.role)" size="small">
              {{ row.roleName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="right">
          <template #default="{ row }">
            <el-button
              v-if="
                homeStore.ownedHomes.some(
                  h => h.homeId === homeStore.selectedHomeId
                )
              "
              type="primary"
              link
              size="small"
              @click="changeRole(row)"
            >
              改角色
            </el-button>
            <el-button
              v-if="
                homeStore.ownedHomes.some(
                  h => h.homeId === homeStore.selectedHomeId
                ) && row.role !== 0
              "
              type="danger"
              link
              size="small"
              @click="deleteMember(row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 成员统计 -->
    <template #footer>
      <div class="member-stats">
        <div class="stat-item">
          <span class="stat-label">房主:</span>
          <span class="stat-value">{{
            members.filter(m => m.role === 0).length
          }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">成员:</span>
          <span class="stat-value">{{
            members.filter(m => m.role === 1).length
          }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">访客:</span>
          <span class="stat-value">{{
            members.filter(m => m.role === 2).length
          }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总计:</span>
          <span class="stat-value">{{ members.length }}</span>
        </div>
      </div>
    </template>

    <!-- 成员表单对话框 -->
    <el-dialog
      v-model="showMemberForm"
      :title="editingMember ? '编辑成员' : '添加成员'"
      width="500px"
    >
      <el-form label-width="80px">
        <el-form-item label="用户ID">
          <el-input
            v-model="editingMember?.userId"
            type="number"
            placeholder="请输入用户ID"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editingMember?.role" placeholder="请选择角色">
            <el-option label="房主" :value="0" />
            <el-option label="成员" :value="1" />
            <el-option label="访客" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showMemberForm = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.member-list-card {
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

  :deep(.el-card__footer) {
    border-top: 1px solid var(--el-border-color-light);
    padding: 20px;
  }

  .member-list {
    .empty-state {
      padding: 40px 0;
    }
  }

  .member-stats {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 20px;

    .stat-item {
      text-align: center;
      padding: 12px;
      background: var(--el-fill-color-light);
      border-radius: 8px;
      border: 1px solid var(--el-border-color);
      min-width: 80px;

      .stat-label {
        display: block;
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin-bottom: 4px;
      }

      .stat-value {
        display: block;
        font-size: 18px;
        font-weight: 700;
        color: var(--el-color-primary);
      }
    }
  }
}

@media (max-width: 768px) {
  .member-stats {
    flex-wrap: wrap;
    gap: 12px;

    .stat-item {
      flex: 1;
      min-width: 60px;
    }
  }

  :deep(.el-table) {
    .el-table__cell {
      padding: 8px 0;
    }
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start !important;
  }

  .member-stats {
    .stat-item {
      min-width: 50px;

      .stat-value {
        font-size: 16px;
      }
    }
  }
}
</style>
