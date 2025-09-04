import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import type {
  HomeInfo,
  RoomInfo,
  MemberInfo,
  DeviceSummary,
  HomeDetailResponse,
  UserHomeRole,
  UserHomesResponse,
  SearchHomeResponse,
  PermissionInfo
} from "@/api/home";
import {
  getUserHomes,
  createHome,
  deleteHome,
  getHomeDetail,
  getMyHome,
  updateHomeName,
  updateHomeAddress,
  searchHomes,
  addHomeMember,
  addUserPermission,
  cancelUserPermission
} from "@/api/home";

export const useHomeStore = defineStore("home", () => {
  // 状态
  const homes = ref<HomeInfo[]>([]);
  const currentHome = ref<HomeInfo | null>(null);
  const homeDetail = ref<HomeDetailResponse | null>(null);
  const myHomes = ref<UserHomeRole[]>([]);
  const searchResults = ref<SearchHomeResponse | null>(null);
  const permissions = ref<PermissionInfo[]>([]);
  const isLoading = ref(false);
  const selectedHomeId = ref<number | null>(null);

  // 计算属性
  const currentHomeRooms = computed(() => homeDetail.value?.rooms || []);
  const currentHomeMembers = computed(() => homeDetail.value?.users || []);
  const currentHomeDevices = computed(() => homeDetail.value?.devices || []);
  const ownedHomes = computed(() =>
    myHomes.value.filter(home => home.role === 0)
  );
  const memberHomes = computed(() =>
    myHomes.value.filter(home => home.role === 1)
  );
  const guestHomes = computed(() =>
    myHomes.value.filter(home => home.role === 2)
  );

  // API 操作
  const fetchUserHomes = async () => {
    isLoading.value = true;
    try {
      const response = await getUserHomes();
      homes.value = response.homes;
      return response;
    } catch (error) {
      ElMessage.error("获取家庭列表失败");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createNewHome = async (data: { name: string; address: string }) => {
    try {
      const response = await createHome(data);
      ElMessage.success("家庭创建成功");
      await fetchUserHomes();
      return response;
    } catch (error) {
      ElMessage.error("创建家庭失败");
      throw error;
    }
  };

  const removeHome = async (homeId: number) => {
    try {
      const response = await deleteHome(homeId);
      ElMessage.success("家庭删除成功");
      await fetchUserHomes();
      return response;
    } catch (error) {
      ElMessage.error("删除家庭失败");
      throw error;
    }
  };

  const fetchHomeDetail = async (homeId: number) => {
    isLoading.value = true;
    try {
      const response = await getHomeDetail(homeId);
      homeDetail.value = response;
      currentHome.value = response.home;
      selectedHomeId.value = homeId;
      return response;
    } catch (error) {
      ElMessage.error("获取家庭详情失败");
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMyHomes = async () => {
    try {
      const response = await getMyHome();
      myHomes.value = response.home;
      return response;
    } catch (error) {
      ElMessage.error("获取我的家庭失败");
      throw error;
    }
  };

  const updateName = async (homeId: number, name: string) => {
    try {
      const response = await updateHomeName(homeId, name);
      ElMessage.success("家庭名称更新成功");
      await fetchHomeDetail(homeId);
      return response;
    } catch (error) {
      ElMessage.error("更新家庭名称失败");
      throw error;
    }
  };

  const updateAddress = async (homeId: number, address: string) => {
    try {
      const response = await updateHomeAddress(homeId, address);
      ElMessage.success("家庭地址更新成功");
      await fetchHomeDetail(homeId);
      return response;
    } catch (error) {
      ElMessage.error("更新家庭地址失败");
      throw error;
    }
  };

  const searchHomesByKeyword = async (keyword: string) => {
    try {
      const response = await searchHomes(keyword);
      searchResults.value = response;
      return response;
    } catch (error) {
      ElMessage.error("搜索家庭失败");
      throw error;
    }
  };

  const addMember = async (data: {
    userId: number;
    homeId: number;
    role: number;
  }) => {
    try {
      const response = await addHomeMember(data);
      ElMessage.success("成员添加成功");
      await fetchHomeDetail(data.homeId);
      return response;
    } catch (error) {
      ElMessage.error("添加成员失败");
      throw error;
    }
  };

  const addPermission = async (
    homeId: number,
    data: Omit<PermissionInfo, "homeId">
  ) => {
    try {
      const response = await addUserPermission(homeId, data);
      ElMessage.success("权限添加成功");
      return response;
    } catch (error) {
      ElMessage.error("添加权限失败");
      throw error;
    }
  };

  const cancelPermission = async (permissionId: number) => {
    try {
      const response = await cancelUserPermission(permissionId);
      ElMessage.success("权限取消成功");
      return response;
    } catch (error) {
      ElMessage.error("取消权限失败");
      throw error;
    }
  };

  // 初始化
  const initialize = async () => {
    isLoading.value = true;
    try {
      await Promise.all([fetchUserHomes(), fetchMyHomes()]);
    } catch (error) {
      console.error("初始化家庭数据失败:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 重置状态
  const reset = () => {
    homes.value = [];
    currentHome.value = null;
    homeDetail.value = null;
    myHomes.value = [];
    searchResults.value = null;
    permissions.value = [];
    selectedHomeId.value = null;
  };

  return {
    // 状态
    homes,
    currentHome,
    homeDetail,
    myHomes,
    searchResults,
    permissions,
    isLoading,
    selectedHomeId,

    // 计算属性
    currentHomeRooms,
    currentHomeMembers,
    currentHomeDevices,
    ownedHomes,
    memberHomes,
    guestHomes,

    // 操作
    fetchUserHomes,
    createNewHome,
    removeHome,
    fetchHomeDetail,
    fetchMyHomes,
    updateName,
    updateAddress,
    searchHomesByKeyword,
    addMember,
    addPermission,
    cancelPermission,
    initialize,
    reset
  };
});
