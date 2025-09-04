<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import { useHomeStore } from "@/store/modules/home";

const props = defineProps<{
  visible: boolean;
  home?: any;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "submit"): void;
}>();

const homeStore = useHomeStore();
const loading = ref(false);

const form = ref({
  name: "",
  address: ""
});

const rules = {
  name: [
    { required: true, message: "请输入家庭名称", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "家庭名称长度在 2 到 20 个字符",
      trigger: "blur"
    }
  ],
  address: [
    { required: true, message: "请输入家庭地址", trigger: "blur" },
    {
      min: 5,
      max: 100,
      message: "家庭地址长度在 5 到 100 个字符",
      trigger: "blur"
    }
  ]
};

const isEditing = computed(() => !!props.home);
const dialogTitle = computed(() => (isEditing.value ? "编辑家庭" : "创建家庭"));

// 重置表单
const resetForm = () => {
  form.value = {
    name: "",
    address: ""
  };
};

// 提交表单
const submitForm = async () => {
  loading.value = true;
  try {
    if (isEditing.value) {
      // 编辑家庭
      await homeStore.updateName(props.home.id, form.value.name);
      await homeStore.updateAddress(props.home.id, form.value.address);
      ElMessage.success("家庭信息更新成功");
    } else {
      // 创建家庭
      await homeStore.createNewHome(form.value);
      ElMessage.success("家庭创建成功");
    }
    emit("submit");
    closeDialog();
  } catch (error) {
    console.error("表单提交失败:", error);
  } finally {
    loading.value = false;
  }
};

// 关闭对话框
const closeDialog = () => {
  emit("update:visible", false);
  resetForm();
};

// 监听visible变化
watch(
  () => props.visible,
  visible => {
    if (visible && props.home) {
      // 编辑模式，填充表单
      form.value = {
        name: props.home.name,
        address: props.home.address
      };
    } else if (!visible) {
      resetForm();
    }
  }
);
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="500px"
    :before-close="closeDialog"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="家庭名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入家庭名称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="家庭地址" prop="address">
        <el-input
          v-model="form.address"
          type="textarea"
          :rows="3"
          placeholder="请输入详细地址"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ isEditing ? "更新" : "创建" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 12px;

  .el-dialog__header {
    padding: 20px 20px 0;
    margin: 0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .el-dialog__body {
    padding: 20px;

    .el-form {
      .el-form-item {
        margin-bottom: 20px;

        .el-form-item__label {
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 8px;
        }

        .el-input,
        .el-textarea {
          .el-input__inner,
          .el-textarea__inner {
            border-radius: 8px;
            border: 1px solid var(--el-border-color);
            transition: all 0.3s ease;

            &:focus {
              border-color: var(--el-color-primary);
              box-shadow: 0 0 0 2px var(--el-color-primary-light-7);
            }
          }
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 0 20px 20px;
    border-top: 1px solid var(--el-border-color-light);

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  }
}

@media (max-width: 600px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 20px auto;

    .el-dialog__body {
      padding: 16px;
    }

    .el-dialog__footer {
      padding: 16px;
    }
  }
}
</style>
