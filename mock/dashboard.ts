import { MockMethod } from "vite-plugin-mock";
import { Random } from "mockjs";

export default [
  {
    url: "/api/dashboard/overview",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: {
          overview: {
            deviceStatus: {
              online: Random.integer(15, 25),
              offline: Random.integer(0, 5),
              total: 30
            },
            environment: {
              temperature: Random.float(18, 28, 1, 1),
              humidity: Random.integer(40, 80),
              pm25: Random.integer(10, 100),
              co2: Random.integer(400, 1000),
              timestamp: new Date().toISOString()
            },
            energy: {
              total: Random.float(50, 200, 1, 1),
              lighting: Random.float(10, 30, 1, 1),
              appliances: Random.float(20, 80, 1, 1),
              hvac: Random.float(30, 100, 1, 1),
              other: Random.float(5, 20, 1, 1),
              timestamp: new Date().toISOString()
            },
            security: {
              doorsLocked: Random.integer(3, 5),
              windowsClosed: Random.integer(8, 12),
              motionDetected: Random.integer(0, 2),
              alarmsActive: Random.integer(0, 1)
            }
          },
          temperatureTrend: {
            timestamps: Array.from({ length: 24 }, (_, i) => 
              new Date(Date.now() - (23 - i) * 3600000).toISOString()
            ),
            values: Array.from({ length: 24 }, () => Random.float(18, 28, 1, 1))
          },
          energyDistribution: [
            { category: "照明", value: Random.float(10, 30, 1, 1), percentage: Random.float(5, 15, 1, 1) },
            { category: "家电", value: Random.float(20, 80, 1, 1), percentage: Random.float(20, 40, 1, 1) },
            { category: "空调", value: Random.float(30, 100, 1, 1), percentage: Random.float(30, 50, 1, 1) },
            { category: "其他", value: Random.float(5, 20, 1, 1), percentage: Random.float(5, 15, 1, 1) }
          ],
          humidityGauge: Random.integer(40, 80)
        }
      };
    }
  },
  {
    url: "/api/dashboard/temperature-trend",
    method: "get",
    response: ({ query }) => {
      const hours = parseInt(query.hours) || 24;
      return {
        code: 200,
        message: "success",
        data: {
          timestamps: Array.from({ length: hours }, (_, i) => 
            new Date(Date.now() - (hours - 1 - i) * 3600000).toISOString()
          ),
          values: Array.from({ length: hours }, () => Random.float(18, 28, 1, 1))
        }
      };
    }
  },
  {
    url: "/api/dashboard/energy-distribution",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: [
          { category: "照明", value: Random.float(10, 30, 1, 1), percentage: Random.float(5, 15, 1, 1) },
          { category: "家电", value: Random.float(20, 80, 1, 1), percentage: Random.float(20, 40, 1, 1) },
          { category: "空调", value: Random.float(30, 100, 1, 1), percentage: Random.float(30, 50, 1, 1) },
          { category: "其他", value: Random.float(5, 20, 1, 1), percentage: Random.float(5, 15, 1, 1) }
        ]
      };
    }
  },
  {
    url: "/api/dashboard/security-status",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: {
          doorsLocked: Random.integer(3, 5),
          windowsClosed: Random.integer(8, 12),
          motionDetected: Random.integer(0, 2),
          alarmsActive: Random.integer(0, 1)
        }
      };
    }
  },
  {
    url: "/api/dashboard/switch-mode",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "视图模式切换成功"
      };
    }
  },
  {
    url: "/api/dashboard/save-layout",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "布局保存成功"
      };
    }
  },
  {
    url: "/api/dashboard/get-layout",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "success",
        data: {
          layout: null
        }
      };
    }
  }
] as MockMethod[];