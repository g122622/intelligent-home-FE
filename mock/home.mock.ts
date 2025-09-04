// 家庭管理接口mock数据
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/home/get",
    method: "get",
    response: () => {
      return {
        homes: [
          {
            id: 1,
            name: "我的家",
            address: "北京市朝阳区xxx街道",
            createTime: "2024-01-01T10:00:00"
          },
          {
            id: 2,
            name: "度假别墅",
            address: "上海市浦东新区xxx路",
            createTime: "2024-02-15T14:30:00"
          }
        ]
      };
    }
  },
  {
    url: "/home/create",
    method: "post",
    response: () => {
      return {
        message: "创建成功"
      };
    }
  },
  {
    url: "/home/delete/:homeId",
    method: "delete",
    response: () => {
      return {
        message: "删除成功"
      };
    }
  },
  {
    url: "/home/view/:homeId",
    method: "get",
    response: ({ params }) => {
      const homeId = parseInt(params.homeId);

      if (homeId === 1) {
        return {
          home: {
            id: 1,
            name: "我的家",
            address: "北京市朝阳区xxx街道"
          },
          rooms: [
            {
              id: 1,
              name: "客厅",
              homeId: 1
            },
            {
              id: 2,
              name: "主卧室",
              homeId: 1
            },
            {
              id: 3,
              name: "厨房",
              homeId: 1
            }
          ],
          members: [
            {
              userId: 1,
              username: "房主用户",
              role: 0,
              roleName: "房主"
            },
            {
              userId: 2,
              username: "家庭成员",
              role: 1,
              roleName: "成员"
            }
          ],
          devices: [
            {
              id: 1,
              name: "客厅灯",
              typeName: "智能灯泡",
              onlineStatus: 1,
              activeStatus: 1
            },
            {
              id: 2,
              name: "空调",
              typeName: "智能空调",
              onlineStatus: 1,
              activeStatus: 0
            },
            {
              id: 3,
              name: "门锁",
              typeName: "智能门锁",
              onlineStatus: 1,
              activeStatus: 1
            }
          ]
        };
      } else {
        return {
          home: {
            id: homeId,
            name: "家庭" + homeId,
            address: "地址" + homeId
          },
          rooms: [],
          members: [],
          devices: []
        };
      }
    }
  },
  {
    url: "/home/:homeId/room/create",
    method: "post",
    response: () => {
      return {
        message: "创建成功"
      };
    }
  },
  {
    url: "/home/:homeId/room/list",
    method: "get",
    response: ({ params }) => {
      const homeId = parseInt(params.homeId);

      return {
        rooms: [
          {
            id: 1,
            name: "客厅",
            homeId: homeId
          },
          {
            id: 2,
            name: "卧室",
            homeId: homeId
          },
          {
            id: 3,
            name: "厨房",
            homeId: homeId
          }
        ]
      };
    }
  },
  {
    url: "/home/:homeId/room/delete/:roomId",
    method: "delete",
    response: () => {
      return {
        message: "删除成功"
      };
    }
  }
]);
