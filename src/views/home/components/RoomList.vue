<script setup lang="ts">
import { ref } from "vue";
import { RoomInfo } from "@/api/home";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { createRoom, deleteRoom } from "@/api/room";
import { useHomeStore } from "@/store/modules/home";

const homeStore = useHomeStore();

const props = defineProps<{
  rooms: RoomInfo[];
  homeId: number;
}>();

const showRoomForm = ref(false);
const editingRoom = ref<RoomInfo | null>({
  id: 0,
  name: "",
  homeId: props.homeId
});

// 添加房间
const addRoom = () => {
  editingRoom.value = {
    id: 0,
    name: "",
    homeId: props.homeId
  };
  showRoomForm.value = true;
};

// 编辑房间
const editRoom = (room: RoomInfo) => {
  editingRoom.value = { ...room };
  showRoomForm.value = true;
};

// 删除房间
const deleteRoom_ = async (room: RoomInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除房间 "${room.name}" 吗？`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    await deleteRoom(props.homeId, room.id);
    await homeStore.fetchHomeDetail(props.homeId);
    ElMessage.success("房间删除成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除房间失败");
    }
  }
};
</script>

<template>
  <el-card class="room-list-card">
    <template #header>
      <div class="card-header">
        <h3 class="card-title">房间管理</h3>
        <el-button type="primary" size="small" @click="addRoom">
          <el-icon><plus /></el-icon>
          添加房间
        </el-button>
      </div>
    </template>

    <div class="room-list">
      <div v-if="rooms.length === 0" class="empty-state">
        <el-empty description="暂无房间数据" />
      </div>

      <div v-else class="room-grid">
        <el-card
          v-for="room in rooms"
          :key="room.id"
          class="room-card"
          shadow="hover"
        >
          <template #header>
            <div class="room-header">
              <h4 class="room-name">{{ room.name }}</h4>
              <div class="room-actions">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="editRoom(room)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="deleteRoom_(room)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>

          <div class="room-content">
            <div class="room-info">
              <div class="info-item">
                <span class="info-label">房间ID:</span>
                <span class="info-value">{{ room.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">家庭ID:</span>
                <span class="info-value">{{ room.homeId }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 房间表单对话框 -->
    <el-dialog
      v-model="showRoomForm"
      :title="editingRoom.name ? '编辑房间' : '添加房间'"
      width="400px"
    >
      <el-form label-width="80px">
        <el-form-item label="房间名称">
          <el-input v-model="editingRoom.name" placeholder="请输入房间名称" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showRoomForm = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            async () => {
              await createRoom(editingRoom.homeId, editingRoom.name);
              showRoomForm = false;
              await homeStore.fetchHomeDetail(props.homeId);
            }
          "
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.room-list-card {
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

  .room-list {
    .empty-state {
      padding: 40px 0;
    }

    .room-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;

      .room-card {
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        :deep(.el-card__header) {
          padding: 16px;
          border-bottom: 1px solid var(--el-border-color-light);

          .room-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .room-name {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: var(--el-text-color-primary);
            }

            .room-actions {
              display: flex;
              gap: 8px;
            }
          }
        }

        :deep(.el-card__body) {
          padding: 16px;

          .room-content {
            .room-info {
              .info-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;

                &:last-child {
                  margin-bottom: 0;
                }

                .info-label {
                  font-size: 12px;
                  color: var(--el-text-color-secondary);
                }

                .info-value {
                  font-size: 12px;
                  color: var(--el-text-color-primary);
                  font-weight: 500;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .room-grid {
    grid-template-columns: 1fr !important;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start !important;
  }
}
</style>
