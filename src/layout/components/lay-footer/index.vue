<script setup lang="ts">
import { getConfig } from "@/config";

const TITLE = getConfig("Title");
</script>

<template>
  <footer
    class="layout-footer text-[rgba(0,0,0,0.6)] dark:text-[rgba(220,220,242,0.8)]"
  >
    <a
      class="hover:text-primary!"
      href="https://github.com/Crossng/intelligent-home-FE"
      target="_blank"
    >
      {{ TITLE }}&nbsp;&nbsp;&nbsp;
    </a>
    Copyright © 2025 - 重庆大学计算机学院软件实训项目2部 - 第5组
  </footer>
</template>

<style lang="scss" scoped>
.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 0 8px;
  font-size: 14px;
}
</style>
