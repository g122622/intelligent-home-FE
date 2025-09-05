//实时安防监控主界面
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useSecurityStore } from "@/store/modules/security";
import { ElNotification } from "element-plus";

const securityStore = useSecurityStore();

// 闪烁动画状态
const isFlashing = ref(false);

// 检查浏览器通知权限
const checkNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("此浏览器不支持桌面通知");
    return false;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return Notification.permission === "granted";
};

// 处理异常传感器变化
const abnormalSensorsCount = computed(
  () => securityStore.abnormalSensors.length
);

// 闪烁效果
let flashInterval: number;

onMounted(async () => {
  await checkNotificationPermission();

  // 启动闪烁效果（如果有异常）
  if (securityStore.hasAlarm) {
    startFlashing();
  }

  // 模拟实时更新（每30秒刷新一次传感器状态）
  const updateInterval = setInterval(() => {
    securityStore.fetchSecuritySensors();
  }, 30000);

  // 清理定时器
  onUnmounted(() => {
    clearInterval(updateInterval);
    if (flashInterval) {
      clearInterval(flashInterval);
    }
  });
});

// 启动闪烁效果
const startFlashing = () => {
  isFlashing.value = true;
  flashInterval = setInterval(() => {
    isFlashing.value = !isFlashing.value;
  }, 500) as unknown as number;
};

// 停止闪烁效果
const stopFlashing = () => {
  if (flashInterval) {
    clearInterval(flashInterval);
    isFlashing.value = false;
  }
};

// 监听异常传感器变化
watch(abnormalSensorsCount, (newCount, oldCount) => {
  if (newCount > 0 && oldCount === 0) {
    // 新的异常出现
    startFlashing();
    playAlarmSound();
    showAlarmNotification();
  } else if (newCount === 0 && oldCount > 0) {
    // 所有异常解除
    stopFlashing();
  }
});

// 播放报警声音
const playAlarmSound = () => {
  // 这里可以添加音频播放逻辑
  console.log("播放报警声音");
};

// 显示报警通知
const showAlarmNotification = () => {
  const abnormalSensors = securityStore.abnormalSensors;
  const sensorNames = Array.isArray(abnormalSensors)
    ? abnormalSensors.map(s => s?.name || "未知传感器").join("、")
    : "未知传感器";

  ElNotification({
    title: "安全警报",
    message: `检测到异常: ${sensorNames}`,
    type: "warning",
    duration: 0, // 不自动关闭
    onClick: () => {
      // 点击通知时的处理
      console.log("用户点击了报警通知");
    }
  });
};

// 获取传感器图标
const getSensorIcon = (type: string) => {
  const icons = {
    flame: "🔥",
    gas: "💨"
  };
  return icons[type as keyof typeof icons] || "⚠️";
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  return status === "abnormal" ? "#f56c6c" : "#67c23a";
};

// 获取状态文本
const getStatusText = (status: string) => {
  return status === "abnormal" ? "异常" : "正常";
};
</script>

<template>
  <div class="security-status-panel">
    <div class="panel-header">
      <h2>实时安防状态</h2>
      <div
        class="status-indicator"
        :class="{ 'has-alarm': securityStore.hasAlarm }"
      >
        <span class="indicator-dot" :class="{ flashing: isFlashing }" />
        {{ securityStore.hasAlarm ? "异常报警" : "一切正常" }}
      </div>
    </div>

    <div class="sensors-grid">
      <div
        v-for="sensor in securityStore.sensors"
        :key="sensor.id"
        class="sensor-card"
        :class="{ abnormal: sensor.status === 'abnormal' }"
      >
        <div class="sensor-icon">
          {{ getSensorIcon(sensor.type) }}
        </div>
        <div class="sensor-info">
          <h3 class="sensor-name">{{ sensor.name }}</h3>
          <p class="sensor-type">
            {{ sensor.type === "flame" ? "火焰传感器" : "燃气传感器" }}
          </p>
          <div class="sensor-details">
            <span class="value">当前值: {{ sensor.value }}</span>
            <span class="threshold">阈值: {{ sensor.threshold }}</span>
          </div>
        </div>
        <div class="sensor-status">
          <span
            class="status-badge"
            :style="{ backgroundColor: getStatusColor(sensor.status) }"
          >
            {{ getStatusText(sensor.status) }}
          </span>
          <div class="last-update">
            {{ new Date(sensor.lastUpdate).toLocaleTimeString() }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="securityStore.abnormalSensors.length > 0" class="alarm-warning">
      <el-alert
        title="安全警报"
        :description="`检测到 ${securityStore.abnormalSensors.length} 个异常传感器`"
        type="error"
        show-icon
        :closable="false"
      />
    </div>
  </div>
</template>

<style scoped>
.security-status-panel {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #67c23a;
}

.status-indicator.has-alarm {
  color: #f56c6c;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #67c23a;
}

.indicator-dot.flashing {
  background-color: #f56c6c;
  animation: flash 1s infinite;
}

@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.sensors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.sensor-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.sensor-card.abnormal {
  border-color: #f56c6c;
  background: #fef0f0;
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.3);
}

.sensor-icon {
  font-size: 32px;
  margin-right: 16px;
}

.sensor-info {
  flex: 1;
}

.sensor-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.sensor-type {
  font-size: 12px;
  color: #909399;
  margin: 0 0 8px 0;
}

.sensor-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.value,
.threshold {
  font-size: 12px;
  color: #606266;
}

.sensor-status {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.last-update {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
}

.alarm-warning {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .sensors-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
