<template>
  <div class="security-demo">
    <h2>安防监控系统演示</h2>

    <div class="demo-section">
      <h3>实时安防状态面板</h3>
      <SecurityStatusPanel />
    </div>

    <div class="demo-section">
      <h3>历史报警记录</h3>
      <AlarmRecords />
    </div>
  </div>
</template>

<script setup lang="ts">
import SecurityStatusPanel from "../components/SecurityStatusPanel.vue";
import AlarmRecords from "../components/AlarmRecords.vue";
</script>

<style scoped>
.security-demo {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

.demo-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
</style>
