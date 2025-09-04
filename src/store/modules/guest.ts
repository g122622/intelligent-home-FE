import { defineStore } from "pinia";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type {
  AccessibleDevice,
  GuestAccessibleDevicesResponse,
  CheckGuestPermissionResponse,
  GuestPermissionInfoResponse,
  JoinRequest,
  JoinRequestListResponse
} from "@/api/guest";
import {
  getGuestAccessibleDevices,
  checkGuestOperationPermission,
  getGuestPermissionInfo,
  applyToJoinHome,
  getJoinRequests,
  handleJoinRequest
} from "@/api/guest";

export const useGuestStore = defineStore("guest", () => {
  // 状态
  const accessibleDevices = ref<AccessibleDevice[]>([]);
  const permissionInfo = ref<GuestPermissionInfoResponse | null>(null);
  const joinRequests = ref<JoinRequest[]>([]);
  const isLoading = ref(false);
  const userRole = ref<string>("");
  const accessibleDeviceTypes = ref<number[]>([]);

  // 获取访客可访问设备列表
  const fetchAccessibleDevices = async (userId: number, homeId: number) => {
    isLoading.value = true;
    try {
      const response = await getGuestAccessibleDevices(userId, homeId);
      accessibleDevices.value = response.devices;
      userRole.value = response.userRole;
      accessibleDeviceTypes.value = response.accessibleDeviceTypes;
      return response;
    } catch (error) {
      ElMessage.error("获取访客可访问设备失败");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 检查访客操作权限
  const checkOperationPermission = async (
    userId: number,
    homeId: number,
    deviceId: number,
    operationId: number
  ) => {
    try {
      const response = await checkGuestOperationPermission(
        userId,
        homeId,
        deviceId,
        operationId
      );
      return response;
    } catch (error) {
      ElMessage.error("检查操作权限失败");
      throw error;
    }
  };

  // 获取访客权限说明
  const fetchPermissionInfo = async () => {
    isLoading.value = true;
    try {
      const response = await getGuestPermissionInfo();
      permissionInfo.value = response;
      return response;
    } catch (error) {
      ElMessage.error("获取访客权限说明失败");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 发起加入家庭申请
  const applyJoinHome = async (homeId: number) => {
    try {
      const response = await applyToJoinHome(homeId);
      ElMessage.success("加入家庭申请已发送");
      return response;
    } catch (error) {
      ElMessage.error("申请加入家庭失败");
      throw error;
    }
  };

  // 获取加入请求列表
  const fetchJoinRequests = async (homeId: number) => {
    isLoading.value = true;
    try {
      const response = await getJoinRequests(homeId);
      joinRequests.value = response.requests;
      return response;
    } catch (error) {
      ElMessage.error("获取加入请求列表失败");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 处理加入请求
  const handleJoinRequestAction = async (
    homeId: number,
    data: {
      requestId: number;
      userId: number;
      status: number;
    }
  ) => {
    try {
      const response = await handleJoinRequest(homeId, data);
      const statusText = data.status === 1 ? "同意" : "拒绝";
      ElMessage.success(`已${statusText}加入请求`);
      await fetchJoinRequests(homeId);
      return response;
    } catch (error) {
      ElMessage.error("处理加入请求失败");
      throw error;
    }
  };

  // 重置状态
  const reset = () => {
    accessibleDevices.value = [];
    permissionInfo.value = null;
    joinRequests.value = [];
    userRole.value = "";
    accessibleDeviceTypes.value = [];
  };

  return {
    // 状态
    accessibleDevices,
    permissionInfo,
    joinRequests,
    isLoading,
    userRole,
    accessibleDeviceTypes,

    // 操作
    fetchAccessibleDevices,
    checkOperationPermission,
    fetchPermissionInfo,
    applyJoinHome,
    fetchJoinRequests,
    handleJoinRequestAction,
    reset
  };
});