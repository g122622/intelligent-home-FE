<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Device } from "@/api/device";

const props = defineProps<{
  modelValue: boolean;
  group?: any;
  devices: Device[];
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "save", data: any): void;
}>();

const form = ref({
  name: "",
  deviceIds: [] as string[],
  actions: {} as { [deviceId: string]: Partial<Device> }
});

// 设备选项
const deviceOptions = computed(() => {
  return props.devices.map(device => ({
    value: device.id,
    label: `${device.name} (${device.room})`
  }));
});

// 初始化表单
watch(() => props.group, (newGroup) => {
  if (newGroup) {
    form.value = {
      name: newGroup.name,
      deviceIds: newGroup.deviceIds,
      actions: { ...newGroup.actions }
    };
  } else {
    form.value = {
      name: "",
      deviceIds: [],
      actions: {}
    };
  }
}, { immediate: true });

// 处理设备选择变化
const handleDeviceChange = (deviceIds: string[]) => {
  form.value.deviceIds = deviceIds;
  
  // 为新选择的设备设置默认动作
  deviceIds.forEach(deviceId => {
    if (!form.value.actions[deviceId]) {
      const device = props.devices.find(d => d.id === deviceId);
      if (device) {
        form.value.actions[deviceId] = {
          status: device.status,
          brightness: device.brightness,
          temperature: device.temperature,
          mode: device.mode,
          fanSpeed: device.fanSpeed,
          position: device.position
        };
      }
    }
  });
};

// 处理设备动作变化
const handleActionChange = (deviceId: string, updates: Partial<Device>) => {
  form.value.actions[deviceId] = {
    ...form.value.actions[deviceId],
    ...updates
  };
};

// 提交表单
const handleSubmit = () => {
  if (!form.value.name.trim()) {
    return;
  }

  emit("save", {
    name: form.value.name.trim(),
    deviceIds: form.value.deviceIds,
    actions: form.value.actions
  });
};

// 关闭对话框
const handleClose = () => {
  emit("update:modelValue", false);
};
</script>

<template>
  <el-dialog
    :model-value="props.modelValue"
    @update:model-value="handleClose"
    :title="props.group ? '编辑分组' : '创建分组'"
    width="600px"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="分组名称" required>
        <el-input v-model="form.name" placeholder="请输入分组名称" />
      </el-form-item>

      <el-form-item label="选择设备">
        <el-select
          v-model="form.deviceIds"
          multiple
          placeholder="请选择设备"
          style="width: 100%"
          @change="handleDeviceChange"
        >
          <el-option
            v-for="option in deviceOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <!-- 设备动作配置 -->
      <div v-if="form.deviceIds.length > 0" class="actions-section">
        <h4>设备动作配置</h4>
        <div v-for="deviceId in form.deviceIds" :key="deviceId" class="device-action">
          <h5>{{ props.devices.find(d => d.id === deviceId)?.name }}</h5>
          
          <!-- 开关状态 -->
          <el-form-item label="开关状态">
            <el-switch
              :model-value="form.actions[deviceId]?.status"
              @change="(val: boolean) => handleActionChange(deviceId, { status: val })"
            />
          </el-form-item>

          <!-- 灯光亮度 -->
          <el-form-item v-if="props.devices.find(d => d.id === deviceId)?.type === 'light'" label="亮度">
            <el-slider
              :model-value="form.actions[deviceId]?.brightness || 50"
              :min="0"
              :max="100"
              @change="(val: number) => handleActionChange(deviceId, { brightness: val })"
              show-input
            />
          </el-form-item>

          <!-- 空调设置 -->
          <template v-if="props.devices.find(d => d.id === deviceId)?.type === 'ac'">
            <el-form-item label="温度">
              <el-slider
                :model-value="form.actions[deviceId]?.temperature || 24"
                :min="16"
                :max="30"
                @change="(val: number) => handleActionChange(deviceId, { temperature: val })"
                show-input
              />
            </el-form-item>
            <el-form-item label="模式">
              <el-select
                :model-value="form.actions[deviceId]?.mode || 'cool'"
                @change="(val: string) => handleActionChange(deviceId, { mode: val })"
              >
                <el-option label="制冷" value="cool" />
                <el-option label="制热" value="heat" />
                <el-option label="送风" value="fan" />
                <el-option label="自动" value="auto" />
              </el-select>
            </el-form-item>
          </template>

          <!-- 窗帘位置 -->
          <el-form-item v-if="props.devices.find(d => d.id === deviceId)?.type === 'curtain'" label="位置">
            <el-slider
              :model-value="form.actions[deviceId]?.position || 0"
              :min="0"
              :max="100"
              @change="(val: number) => handleActionChange(deviceId, { position: val })"
              show-input
            />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="!form.name.trim()">
        {{ props.group ? '保存' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.actions-section {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.actions-section h4 {
  margin: 0 0 16px 0;
  color: var(--el-text-color-primary);
}

.device-action {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
}

.device-action h5 {
  margin: 0 0 12px 0;
  color: var(--el-text-color-primary);
}

.device-action:last-child {
  margin-bottom: 0;
}
</style>