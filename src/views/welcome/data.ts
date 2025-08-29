import { dayjs, cloneDeep, getRandomIntBetween } from "./utils";

export interface DeviceStatusData {
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

export interface TemperatureTrend {
  timestamps: string[];
  values: number[];
}

export interface EnergyDistribution {
  category: string;
  value: number;
  percentage: number;
}

/** 设备状态卡片数据 */
const deviceStatusData = {
  icon: "ri:device-line",
  bgColor: "#effaff",
  color: "#41b6ff",
  duration: 2200,
  name: "设备状态",
  value: 25,
  percent: "83%在线",
  data: [18, 22, 20, 25, 23, 24, 25]
};

/** 环境数据卡片数据 */
const environmentData = {
  icon: "ri:temperature-line",
  bgColor: "#fff5f4",
  color: "#e85f33",
  duration: 1600,
  name: "环境数据",
  value: 24.5,
  percent: "舒适",
  data: [22.1, 23.5, 24.2, 25.8, 24.5, 23.8, 24.5]
};

/** 能耗统计卡片数据 */
const energyData = {
  icon: "ri:flashlight-line",
  bgColor: "#eff8f4",
  color: "#26ce83",
  duration: 1500,
  name: "能耗统计",
  value: 156.8,
  percent: "-12%",
  data: [180.2, 165.3, 158.7, 152.4, 148.9, 156.8, 142.3]
};

/** 安防状态卡片数据 */
const securityData = {
  icon: "ri:shield-check-line",
  bgColor: "#f6f4fe",
  color: "#7846e5",
  duration: 100,
  name: "安防状态",
  value: 100,
  percent: "正常",
  data: [100]
};

/** 综合数据看板 */
export const dashboardCards = [
  deviceStatusData,
  environmentData,
  energyData,
  securityData
];

/** 温度趋势数据 */
export const temperatureTrendData: TemperatureTrend = {
  timestamps: Array.from({ length: 24 }, (_, i) => 
    dayjs().subtract(23 - i, "hour").format("HH:mm")
  ),
  values: Array.from({ length: 24 }, () => getRandomIntBetween(18, 28))
};

/** 能耗分布数据 */
export const energyDistributionData: EnergyDistribution[] = [
  { category: "照明", value: 28.5, percentage: 18.2 },
  { category: "家电", value: 65.3, percentage: 41.7 },
  { category: "空调", value: 48.9, percentage: 31.2 },
  { category: "其他", value: 14.1, percentage: 9.0 }
];

/** 湿度仪表盘数据 */
export const humidityGaugeData = getRandomIntBetween(40, 80);

/** 安防状态数据 */
export const securityStatusData: SecurityStatus = {
  doorsLocked: 4,
  windowsClosed: 10,
  motionDetected: 0,
  alarmsActive: 0
};

/** 视图模式选项 */
export const viewModeOptions = [
  { label: "概览模式", value: "overview" },
  { label: "安防模式", value: "security" },
  { label: "能耗模式", value: "energy" },
  { label: "环境模式", value: "environment" }
];

export {
  deviceStatusData,
  environmentData,
  energyData,
  securityData,
  temperatureTrendData,
  energyDistributionData,
  humidityGaugeData,
  securityStatusData,
  viewModeOptions
};