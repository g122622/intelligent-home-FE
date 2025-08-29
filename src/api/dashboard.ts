import { http } from "@/utils/http";

export interface DeviceStatus {
  online: number;
  offline: number;
  total: number;
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  pm25: number;
  co2: number;
  timestamp: string;
}

export interface EnergyConsumption {
  total: number;
  lighting: number;
  appliances: number;
  hvac: number;
  other: number;
  timestamp: string;
}

export interface SecurityStatus {
  doorsLocked: number;
  windowsClosed: number;
  motionDetected: number;
  alarmsActive: number;
}

export interface DashboardOverview {
  deviceStatus: DeviceStatus;
  environment: EnvironmentData;
  energy: EnergyConsumption;
  security: SecurityStatus;
}

export interface TemperatureTrend {
  timestamps: string[];
  values: number[];
}

export interface EnergyDistribution {
  category: string;
  value: number;
  percentage: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  temperatureTrend: TemperatureTrend;
  energyDistribution: EnergyDistribution[];
  humidityGauge: number;
}

/** 获取大屏概览数据 */
export const getDashboardOverview = () => {
  return http.request<DashboardData>("get", "/dashboard/overview");
};

/** 获取温度趋势数据 */
export const getTemperatureTrend = (hours: number = 24) => {
  return http.request<TemperatureTrend>("get", `/dashboard/temperature-trend?hours=${hours}`);
};

/** 获取能耗分布数据 */
export const getEnergyDistribution = () => {
  return http.request<EnergyDistribution[]>("get", "/dashboard/energy-distribution");
};

/** 获取安防状态数据 */
export const getSecurityStatus = () => {
  return http.request<SecurityStatus>("get", "/dashboard/security-status");
};

/** 切换视图模式 */
export const switchViewMode = (mode: string) => {
  return http.request<{ message: string }>("post", "/dashboard/switch-mode", {
    data: { mode }
  });
};

/** 保存自定义布局 */
export const saveCustomLayout = (layout: any) => {
  return http.request<{ message: string }>("post", "/dashboard/save-layout", {
    data: { layout }
  });
};

/** 获取自定义布局 */
export const getCustomLayout = () => {
  return http.request<{ layout: any }>("get", "/dashboard/get-layout");
};