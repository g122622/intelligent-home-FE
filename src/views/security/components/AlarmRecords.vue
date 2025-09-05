//历史报警记录管理
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSecurityStore } from "@/store/modules/security";
import { ElMessage } from "element-plus";
import type { AlarmRecord } from "@/api/device";

const securityStore = useSecurityStore();

// 筛选条件
const filterForm = ref({
  startTime: "",
  endTime: "",
  alarmType: "",
  status: ""
});

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 获取报警类型选项
const alarmTypeOptions = [
  { label: "全部", value: "" },
  { label: "火焰报警", value: "flame" },
  { label: "燃气报警", value: "gas" }
];

// 获取状态选项
const statusOptions = [
  { label: "全部", value: "" },
  { label: "待处理", value: "pending" },
  { label: "已确认", value: "confirmed" },
  { label: "已忽略", value: "ignored" }
];

// 分页后的报警记录
const paginatedAlarms = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return securityStore.alarmRecords.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(securityStore.alarmRecords.length / pageSize.value);
});

// 处理报警
const handleAlarmAction = async (
  alarm: AlarmRecord,
  action: "confirm" | "ignore"
) => {
  try {
    if (action === "confirm") {
      await securityStore.confirmAlarmRecord(1, alarm.id);
      ElMessage.success("报警已确认");
    } else {
      await securityStore.ignoreAlarmRecord(1, alarm.id);
      ElMessage.success("报警已忽略");
    }
  } catch (error) {
    ElMessage.error("操作失败");
  }
};

// 筛选报警记录
const handleFilter = async () => {
  await securityStore.fetchAlarmRecords(1, filterForm.value);
  currentPage.value = 1; // 重置到第一页
};

// 重置筛选
const handleReset = async () => {
  filterForm.value = {
    startTime: "",
    endTime: "",
    alarmType: "",
    status: ""
  };
  await securityStore.fetchAlarmRecords(1);
  currentPage.value = 1;
};

// 导出报警记录
const exportAlarms = () => {
  const headers = ["时间", "设备", "报警类型", "状态", "描述"];
  const data = securityStore.alarmRecords.map(alarm => [
    new Date(alarm.alarmTime).toLocaleString(),
    alarm.deviceName,
    alarm.alarmType === "flame" ? "火焰报警" : "燃气报警",
    getStatusText(alarm.status),
    alarm.description
  ]);

  const csvContent = [
    headers.join(","),
    ...data.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `报警记录_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap = {
    pending: "待处理",
    confirmed: "已确认",
    ignored: "已忽略"
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 获取报警类型文本
const getAlarmTypeText = (type: string) => {
  return type === "flame" ? "火焰报警" : "燃气报警";
};

// 获取状态标签类型
const getStatusType = (status: string) => {
  const typeMap = {
    pending: "warning",
    confirmed: "success",
    ignored: "info"
  } as const;
  return typeMap[status as keyof typeof typeMap] || undefined;
};

onMounted(() => {
  securityStore.fetchAlarmRecords(1);
});
</script>

<template>
  <div class="alarm-records">
    <div class="panel-header">
      <h2>历史报警记录</h2>
      <el-button
        type="primary"
        :loading="securityStore.isLoading"
        @click="exportAlarms"
      >
        <el-icon><Download /></el-icon>
        导出记录
      </el-button>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <el-form :model="filterForm" inline>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="filterForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker
            v-model="filterForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="报警类型">
          <el-select v-model="filterForm.alarmType" placeholder="选择报警类型">
            <el-option
              v-for="option in alarmTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status" placeholder="选择处理状态">
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="securityStore.isLoading"
            @click="handleFilter"
          >
            筛选
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 报警记录表格 -->
    <div class="alarm-table">
      <el-table
        v-loading="securityStore.isLoading"
        :data="paginatedAlarms"
        empty-text="暂无报警记录"
      >
        <el-table-column prop="alarmTime" label="报警时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.alarmTime).toLocaleString() }}
          </template>
        </el-table-column>

        <el-table-column prop="deviceName" label="设备名称" width="150" />

        <el-table-column prop="alarmType" label="报警类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.alarmType === 'flame' ? 'danger' : 'warning'">
              {{ getAlarmTypeText(row.alarmType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="报警描述" min-width="200" />

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button
                v-if="row.status === 'pending'"
                size="small"
                type="success"
                @click="handleAlarmAction(row, 'confirm')"
              >
                确认
              </el-button>
              <el-button
                v-if="row.status === 'pending'"
                size="small"
                type="info"
                @click="handleAlarmAction(row, 'ignore')"
              >
                忽略
              </el-button>
              <span v-else class="action-completed">已处理</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页控件 -->
    <div v-if="securityStore.alarmRecords.length > 0" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="securityStore.alarmRecords.length"
      />
    </div>
  </div>
</template>

<style scoped>
.alarm-records {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
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

.filter-toolbar {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.filter-toolbar .el-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-toolbar .el-form-item {
  margin-bottom: 0;
}

.alarm-table {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-completed {
  color: #909399;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .filter-toolbar .el-form {
    flex-direction: column;
    align-items: stretch;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
