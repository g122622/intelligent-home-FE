import { defineFakeRoute } from "vite-plugin-fake-server/client";
import type { Device, DeviceGroup, Scene, Room } from "@/api/device";

// 模拟设备数据
const mockDevices: Device[] = [
  {
    id: "light-1",
    name: "客厅主灯",
    type: "light",
    room: "客厅",
    status: true,
    brightness: 80,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "light-2",
    name: "卧室床头灯",
    type: "light",
    room: "卧室",
    status: false,
    brightness: 50,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "ac-1",
    name: "客厅空调",
    type: "ac",
    room: "客厅",
    status: true,
    temperature: 26,
    mode: "cool",
    fanSpeed: 3,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "ac-2",
    name: "卧室空调",
    type: "ac",
    room: "卧室",
    status: false,
    temperature: 24,
    mode: "auto",
    fanSpeed: 2,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "curtain-1",
    name: "客厅窗帘",
    type: "curtain",
    room: "客厅",
    status: true,
    position: 50,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "sensor-1",
    name: "温度传感器",
    type: "sensor",
    room: "客厅",
    status: true,
    lastUpdate: new Date().toISOString()
  },
  {
    id: "switch-1",
    name: "总开关",
    type: "switch",
    room: "走廊",
    status: true,
    lastUpdate: new Date().toISOString()
  }
];

// 模拟设备分组
const mockDeviceGroups: DeviceGroup[] = [
  {
    id: "group-1",
    name: "客厅照明",
    deviceIds: ["light-1"],
    actions: {
      "light-1": { status: true, brightness: 100 }
    }
  },
  {
    id: "group-2",
    name: "夜间模式",
    deviceIds: ["light-2", "ac-2"],
    actions: {
      "light-2": { status: true, brightness: 30 },
      "ac-2": { status: true, temperature: 26, mode: "cool", fanSpeed: 1 }
    }
  }
];

// 模拟场景
const mockScenes: Scene[] = [
  {
    id: "scene-home",
    name: "回家模式",
    description: "打开所有灯光和空调",
    actions: {
      "light-1": { status: true, brightness: 80 },
      "light-2": { status: true, brightness: 60 },
      "ac-1": { status: true, temperature: 24, mode: "cool", fanSpeed: 2 },
      "curtain-1": { status: true, position: 100 }
    },
    isActive: false
  },
  {
    id: "scene-leave",
    name: "离家模式",
    description: "关闭所有设备",
    actions: {
      "light-1": { status: false },
      "light-2": { status: false },
      "ac-1": { status: false },
      "ac-2": { status: false },
      "curtain-1": { status: false },
      "switch-1": { status: false }
    },
    isActive: false
  },
  {
    id: "scene-movie",
    name: "观影模式",
    description: "调暗灯光，关闭窗帘",
    actions: {
      "light-1": { status: true, brightness: 20 },
      "curtain-1": { status: true, position: 0 }
    },
    isActive: false
  }
];

// 模拟房间
const mockRooms: Room[] = [
  { id: "living-room", name: "客厅", deviceCount: 3 },
  { id: "bedroom", name: "卧室", deviceCount: 2 },
  { id: "corridor", name: "走廊", deviceCount: 1 }
];

export default defineFakeRoute([
  // 获取设备列表
  {
    url: "/devices",
    method: "get",
    response: () => {
      return {
        success: true,
        data: mockDevices
      };
    }
  },

  // 获取单个设备
  {
    url: "/devices/:id",
    method: "get",
    response: ({ query }) => {
      const device = mockDevices.find(d => d.id === query.id);
      return {
        success: !!device,
        data: device || null
      };
    }
  },

  // 更新设备状态
  {
    url: "/devices/:id",
    method: "patch",
    response: ({ query, body }) => {
      const deviceIndex = mockDevices.findIndex(d => d.id === query.id);
      if (deviceIndex !== -1) {
        mockDevices[deviceIndex] = {
          ...mockDevices[deviceIndex],
          ...body,
          lastUpdate: new Date().toISOString()
        };
        return {
          success: true,
          data: mockDevices[deviceIndex]
        };
      }
      return {
        success: false,
        message: "设备不存在"
      };
    }
  },

  // 批量更新设备状态
  {
    url: "/devices/batch-update",
    method: "post",
    response: ({ body }) => {
      const updates = body as Array<{ id: string; updates: Partial<Device> }>;
      const updatedDevices: Device[] = [];

      updates.forEach(({ id, updates: deviceUpdates }) => {
        const deviceIndex = mockDevices.findIndex(d => d.id === id);
        if (deviceIndex !== -1) {
          mockDevices[deviceIndex] = {
            ...mockDevices[deviceIndex],
            ...deviceUpdates,
            lastUpdate: new Date().toISOString()
          };
          updatedDevices.push(mockDevices[deviceIndex]);
        }
      });

      return {
        success: true,
        data: updatedDevices
      };
    }
  },

  // 获取设备分组列表
  {
    url: "/device-groups",
    method: "get",
    response: () => {
      return {
        success: true,
        data: mockDeviceGroups
      };
    }
  },

  // 创建设备分组
  {
    url: "/device-groups",
    method: "post",
    response: ({ body }) => {
      const newGroup: DeviceGroup = {
        id: `group-${Date.now()}`,
        name: body.name,
        deviceIds: body.deviceIds,
        actions: body.actions
      };
      mockDeviceGroups.push(newGroup);
      return {
        success: true,
        data: newGroup
      };
    }
  },

  // 更新设备分组
  {
    url: "/device-groups/:id",
    method: "patch",
    response: ({ query, body }) => {
      const groupIndex = mockDeviceGroups.findIndex(g => g.id === query.id);
      if (groupIndex !== -1) {
        mockDeviceGroups[groupIndex] = {
          ...mockDeviceGroups[groupIndex],
          ...body
        };
        return {
          success: true,
          data: mockDeviceGroups[groupIndex]
        };
      }
      return {
        success: false,
        message: "分组不存在"
      };
    }
  },

  // 删除设备分组
  {
    url: "/device-groups/:id",
    method: "delete",
    response: ({ query }) => {
      const groupIndex = mockDeviceGroups.findIndex(g => g.id === query.id);
      if (groupIndex !== -1) {
        mockDeviceGroups.splice(groupIndex, 1);
        return {
          success: true
        };
      }
      return {
        success: false,
        message: "分组不存在"
      };
    }
  },

  // 执行设备分组操作
  {
    url: "/device-groups/:id/execute",
    method: "post",
    response: ({ query }) => {
      const group = mockDeviceGroups.find(g => g.id === query.id);
      if (group) {
        const updatedDevices: Device[] = [];

        Object.entries(group.actions).forEach(([deviceId, actions]) => {
          const deviceIndex = mockDevices.findIndex(d => d.id === deviceId);
          if (deviceIndex !== -1) {
            mockDevices[deviceIndex] = {
              ...mockDevices[deviceIndex],
              ...actions,
              lastUpdate: new Date().toISOString()
            };
            updatedDevices.push(mockDevices[deviceIndex]);
          }
        });

        return {
          success: true,
          data: updatedDevices
        };
      }
      return {
        success: false,
        message: "分组不存在"
      };
    }
  },

  // 获取场景列表
  {
    url: "/scenes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: mockScenes
      };
    }
  },

  // 创建场景
  {
    url: "/scenes",
    method: "post",
    response: ({ body }) => {
      const newScene: Scene = {
        id: `custom-${Date.now()}`,
        name: body.name,
        description: body.description,
        actions: body.actions,
        isActive: false
      };
      mockScenes.push(newScene);
      return {
        success: true,
        data: newScene
      };
    }
  },

  // 更新场景
  {
    url: "/scenes/:id",
    method: "patch",
    response: ({ query, body }) => {
      const sceneIndex = mockScenes.findIndex(s => s.id === query.id);
      if (sceneIndex !== -1) {
        mockScenes[sceneIndex] = {
          ...mockScenes[sceneIndex],
          ...body
        };
        return {
          success: true,
          data: mockScenes[sceneIndex]
        };
      }
      return {
        success: false,
        message: "场景不存在"
      };
    }
  },

  // 删除场景
  {
    url: "/scenes/:id",
    method: "delete",
    response: ({ query }) => {
      const sceneIndex = mockScenes.findIndex(s => s.id === query.id);
      if (sceneIndex !== -1) {
        mockScenes.splice(sceneIndex, 1);
        return {
          success: true
        };
      }
      return {
        success: false,
        message: "场景不存在"
      };
    }
  },

  // 执行场景
  {
    url: "/scenes/:id/execute",
    method: "post",
    response: ({ query }) => {
      const scene = mockScenes.find(s => s.id === query.id);
      if (scene) {
        scene.isActive = true;

        const updatedDevices: Device[] = [];

        Object.entries(scene.actions).forEach(([deviceId, actions]) => {
          const deviceIndex = mockDevices.findIndex(d => d.id === deviceId);
          if (deviceIndex !== -1) {
            mockDevices[deviceIndex] = {
              ...mockDevices[deviceIndex],
              ...actions,
              lastUpdate: new Date().toISOString()
            };
            updatedDevices.push(mockDevices[deviceIndex]);
          }
        });

        // 模拟场景执行完成
        setTimeout(() => {
          scene.isActive = false;
        }, 3000);

        return {
          success: true,
          data: updatedDevices
        };
      }
      return {
        success: false,
        message: "场景不存在"
      };
    }
  },

  // 获取房间列表
  {
    url: "/rooms",
    method: "get",
    response: () => {
      return {
        success: true,
        data: mockRooms
      };
    }
  },

  // 获取WebSocket URL
  {
    url: "/websocket-url",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          url: "ws://localhost:3000/ws/device-status"
        }
      };
    }
  },

  // ==================== 设备管理接口 ====================

  // 获取设备类型列表
  {
    url: "/home/:homeId/room/device/type/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "智能灯泡",
            description: "可调节亮度和颜色的智能灯泡"
          },
          {
            id: 2,
            name: "智能插座",
            description: "可远程控制的智能插座"
          },
          {
            id: 3,
            name: "火焰传感器",
            description: "检测火焰的安防传感器"
          },
          {
            id: 4,
            name: "可燃气体传感器",
            description: "检测可燃气体的安防传感器"
          }
        ]
      };
    }
  },

  // 添加设备
  {
    url: "/home/:homeId/room/device/add",
    method: "post",
    response: ({ body }) => {
      return {
        success: true,
        data: {
          status: "success",
          message: "添加设备成功",
          deviceId: Math.floor(Math.random() * 1000) + 1
        }
      };
    }
  },

  // 获取设备列表
  {
    url: "/home/:homeId/room/device/list",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          devices: [
            {
              id: 1,
              name: "客厅灯",
              ipAddress: "192.168.1.100",
              homeId: 1,
              roomId: 1,
              typeId: 1,
              onlineStatus: 1,
              activeStatus: 1,
              lastActiveTime: new Date().toISOString()
            },
            {
              id: 2,
              name: "厨房插座",
              ipAddress: "192.168.1.101",
              homeId: 1,
              roomId: 2,
              typeId: 2,
              onlineStatus: 1,
              activeStatus: 0,
              lastActiveTime: new Date().toISOString()
            },
            {
              id: 3,
              name: "火焰传感器",
              ipAddress: "192.168.1.102",
              homeId: 1,
              roomId: 3,
              typeId: 3,
              onlineStatus: 1,
              activeStatus: 1,
              lastActiveTime: new Date().toISOString()
            },
            {
              id: 4,
              name: "燃气传感器",
              ipAddress: "192.168.1.103",
              homeId: 1,
              roomId: 3,
              typeId: 4,
              onlineStatus: 1,
              activeStatus: 1,
              lastActiveTime: new Date().toISOString()
            }
          ]
        }
      };
    }
  },

  // 更新设备
  {
    url: "/home/:homeId/room/device/update",
    method: "post",
    response: ({ body }) => {
      return {
        success: true,
        data: {
          status: "success",
          message: "更新成功"
        }
      };
    }
  },

  // 删除设备
  {
    url: "/home/:homeId/room/device/delete",
    method: "delete",
    response: ({ query }) => {
      return {
        success: true,
        data: {
          status: "success",
          message: "删除成功"
        }
      };
    }
  },

  // ==================== 设备交互接口 ====================

  // 设备操作
  {
    url: "/home/:homeId/device/operation",
    method: "post",
    response: ({ body }) => {
      return {
        success: true,
        data: {
          message: "操作成功"
        }
      };
    }
  },

  // 获取设备操作列表
  {
    url: "/home/:homeId/device/:deviceId/operations",
    method: "get",
    response: () => {
      return {
        success: true,
        data: {
          operations: [
            {
              id: 1,
              name: "开关",
              description: "设备的开关操作"
            },
            {
              id: 2,
              name: "调节亮度",
              description: "调节设备亮度"
            },
            {
              id: 3,
              name: "报警确认",
              description: "确认报警信息"
            },
            {
              id: 4,
              name: "报警忽略",
              description: "忽略报警信息"
            }
          ]
        }
      };
    }
  },

  // ==================== 安防监控接口 ====================

  // 获取安防传感器状态
  {
    url: "/home/:homeId/security/sensors",
    method: "get",
    response: () => {
      const mockSecuritySensors = [
        {
          id: 1,
          name: "厨房火焰传感器",
          type: "flame" as const,
          status: "normal" as const,
          value: 0.2,
          threshold: 1.0,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 2,
          name: "厨房燃气传感器",
          type: "gas" as const,
          status: "normal" as const,
          value: 50,
          threshold: 1000,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 3,
          name: "客厅火焰传感器",
          type: "flame" as const,
          status: "normal" as const,
          value: 0.1,
          threshold: 1.0,
          lastUpdate: new Date().toISOString()
        }
      ];

      return mockSecuritySensors;
    }
  },

  // 获取报警记录
  {
    url: "/home/:homeId/security/alarms",
    method: "get",
    response: ({ query }) => {
      const mockAlarmRecords = [
        {
          id: 1,
          deviceId: 1,
          deviceName: "厨房火焰传感器",
          alarmType: "flame",
          alarmTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "confirmed" as const,
          description: "检测到火焰异常"
        },
        {
          id: 2,
          deviceId: 2,
          deviceName: "厨房燃气传感器",
          alarmType: "gas",
          alarmTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "ignored" as const,
          description: "检测到燃气浓度异常"
        },
        {
          id: 3,
          deviceId: 1,
          deviceName: "厨房火焰传感器",
          alarmType: "flame",
          alarmTime: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: "pending" as const,
          description: "检测到火焰异常"
        }
      ];

      let filteredRecords = [...mockAlarmRecords];

      // 根据查询参数过滤
      if (query.startTime) {
        filteredRecords = filteredRecords.filter(
          record =>
            new Date(record.alarmTime) >= new Date(query.startTime as string)
        );
      }
      if (query.endTime) {
        filteredRecords = filteredRecords.filter(
          record =>
            new Date(record.alarmTime) <= new Date(query.endTime as string)
        );
      }
      if (query.alarmType) {
        filteredRecords = filteredRecords.filter(
          record => record.alarmType === query.alarmType
        );
      }
      if (query.status) {
        filteredRecords = filteredRecords.filter(
          record => record.status === query.status
        );
      }

      return filteredRecords;
    }
  },

  // 确认报警
  {
    url: "/home/:homeId/security/alarms/:alarmId/confirm",
    method: "post",
    response: ({ query }) => {
      const alarmId = parseInt(query.alarmId as string);
      // 在实际应用中，这里应该更新数据库中的报警状态
      return {
        success: true,
        data: {
          message: "报警确认成功"
        }
      };
    }
  },

  // 忽略报警
  {
    url: "/home/:homeId/security/alarms/:alarmId/ignore",
    method: "post",
    response: ({ query }) => {
      const alarmId = parseInt(query.alarmId as string);
      // 在实际应用中，这里应该更新数据库中的报警状态
      return {
        success: true,
        data: {
          message: "报警忽略成功"
        }
      };
    }
  }
]);
