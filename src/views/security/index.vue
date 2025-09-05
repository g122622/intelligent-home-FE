//安防系统监控主页面
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSecurityStore } from "@/store/modules/security";
import SecurityStatusPanel from "./components/SecurityStatusPanel.vue";
import AlarmRecords from "./components/AlarmRecords.vue";

const securityStore = useSecurityStore();

// 初始化数据
onMounted(async () => {
  await securityStore.initialize();
});
</script>

<template>
  <div class="security-monitor">
    <div class="security-header">
      <h1>安防监控系统</h1>
      <p class="subtitle">实时监控家庭安全状态</p>
    </div>

    <!-- 实时安防状态面板 -->
    <SecurityStatusPanel />

    <!-- 历史警报记录 -->
    <AlarmRecords />
  </div>
</template>

<style scoped>
.security-monitor {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.security-header {
  text-align: center;
  margin-bottom: 32px;
}

.security-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #909399;
}
</style>
