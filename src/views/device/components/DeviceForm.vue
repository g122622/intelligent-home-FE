<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import type { DeviceDetail } from "@/api/device";
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElButton
} from "element-plus";
import { ElMessage } from "element-plus";

interface Props {
  visible: boolean;
  device?: DeviceDetail | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "submit"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const deviceStore = useDeviceStore();
const formRef = ref();
const loading = ref(false);

// 表单数据
const formData = ref({
  name: "",
  ipAddress: "",
  homeId: 1,
  roomId: 1,
  typeId: 1,
  onlineStatus: 0,
  activeStatus: 0
});

// 表单规则
const formRules = {
  name: [
    { required: true, message: "请输入设备名称", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "设备名称长度在 2 到 20 个字符",
      trigger: "blur"
    }
  ],
  ipAddress: [
    { required: true, message: "请输入IP地址", trigger: "blur" },
    {
      pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
      message: "请输入有效的IP地址",
      trigger: "blur"
    }
  ],
  homeId: [{ required: true, message: "请输入家庭ID", trigger: "blur" }],
  roomId: [{ required: true, message: "请输入房间ID", trigger: "blur" }],
  typeId: [{ required: true, message: "请选择设备类型", trigger: "change" }]
};

// 设备类型选项
const deviceTypeOptions = computed(() => [
  { value: 1, label: "智能灯泡" },
  { value: 2, label: "智能插座" },
  { value: 3, label: "传感器" },
  { value: 4, label: "智能锁" },
  { value: 5, label: "摄像头" },
  { value: 6, label: "温控器" }
]);

// 状态选项
const statusOptions = [
  { value: 0, label: "离线" },
  { value: 1, label: "在线" }
];

// 激活状态选项
const activeOptions = [
  { value: 0, label: "未激活" },
  { value: 1, label: "已激活" }
];

// 监听visible变化
watch(
  () => props.visible,
  visible => {
    if (visible) {
      resetForm();
      if (props.device) {
        // 编辑模式：填充表单数据
        formData.value = { ...props.device };
      } else {
        // 添加模式：重置表单
        formData.value = {
          name: "",
          ipAddress: "",
          homeId: 1,
          roomId: 1,
          typeId: 1,
          onlineStatus: 0,
          activeStatus: 0
        };
      }
    }
  }
);

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;

    if (props.device) {
      // 编辑设备
      await deviceStore.updateDevice(formData.value.homeId, props.device.id, {
        name: formData.value.name,
        roomId: formData.value.roomId
      });
      ElMessage.success("设备更新成功");
    } else {
      // 添加设备
      await deviceStore.addNewDevice(formData.value);
      ElMessage.success("设备添加成功");
    }

    emit("submit");
    emit("update:visible", false);
  } catch (error) {
    console.error("表单提交失败:", error);
    ElMessage.error(props.device ? "更新设备失败" : "添加设备失败");
  } finally {
    loading.value = false;
  }
};

// 关闭对话框
const handleClose = () => {
  emit("update:visible", false);
};

// 获取对话框标题
const dialogTitle = computed(() => (props.device ? "编辑设备" : "添加设备"));
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="dialogTitle"
    width="600px"
    :before-close="handleClose"
    destroy-on-close
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="right"
      size="large"
    >
      <!-- 设备名称 -->
      <ElFormItem label="设备名称" prop="name">
        <ElInput
          v-model="formData.name"
          placeholder="请输入设备名称"
          clearable
        />
      </ElFormItem>

      <!-- IP地址 -->
      <ElFormItem label="IP地址" prop="ipAddress">
        <ElInput
          v-model="formData.ipAddress"
          placeholder="请输入设备IP地址"
          clearable
        />
      </ElFormItem>

      <!-- 家庭ID -->
      <ElFormItem label="家庭ID" prop="homeId">
        <ElInputNumber
          v-model="formData.homeId"
          :min="1"
          :max="999"
          controls-position="right"
        />
      </ElFormItem>

      <!-- 房间ID -->
      <ElFormItem label="房间ID" prop="roomId">
        <ElInputNumber
          v-model="formData.roomId"
          :min="1"
          :max="999"
          controls-position="right"
        />
      </ElFormItem>

      <!-- 设备类型 -->
      <ElFormItem label="设备类型" prop="typeId">
        <ElSelect
          v-model="formData.typeId"
          placeholder="请选择设备类型"
          clearable
        >
          <ElOption
            v-for="option in deviceTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>

      <!-- 在线状态 -->
      <ElFormItem label="在线状态" prop="onlineStatus">
        <ElSelect v-model="formData.onlineStatus" placeholder="请选择在线状态">
          <ElOption
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>

      <!-- 激活状态 -->
      <ElFormItem label="激活状态" prop="activeStatus">
        <ElSelect v-model="formData.activeStatus" placeholder="请选择激活状态">
          <ElOption
            v-for="option in activeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="dialog-footer">
        <ElButton :disabled="loading" @click="handleClose"> 取消 </ElButton>
        <ElButton type="primary" :loading="loading" @click="handleSubmit">
          {{ props.device ? "更新" : "添加" }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;

  .el-dialog__header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--el-border-color-light);
    margin: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid var(--el-border-color-light);
  }
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .el-form-item__label {
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 响应式设计
@media (max-width: 640px) {
  :deep(.el-dialog) {
    width: 90% !important;
    max-width: 400px;

    .el-dialog__body {
      padding: 16px;
    }
  }

  :deep(.el-form) {
    .el-form-item {
      margin-bottom: 16px;

      .el-form-item__label {
        width: 80px !important;
      }

      .el-form-item__content {
        margin-left: 80px !important;
      }
    }
  }
}

// 暗色模式适配
:deep() {
  .el-dialog {
    background: var(--el-bg-color);

    .el-dialog__header,
    .el-dialog__footer {
      background: var(--el-fill-color-light);
    }
  }

  .el-input__wrapper,
  .el-select__wrapper {
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color);

    &:hover {
      border-color: var(--el-color-primary);
    }

    &.is-focus {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 2px var(--el-color-primary-light-5);
    }
  }
}
</style>
