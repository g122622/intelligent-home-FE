# 安防监控系统功能说明

## 已实现的功能

### 1. 实时安防状态面板
- 显示火焰、可燃气体传感器状态（正常/异常）
- 异常时 UI 高亮警示（红框、闪烁图标）
- 实时状态监控和显示

### 2. 报警通知机制
- 前端接收 WebSocket 推送的报警信息（待集成）
- 弹窗提示功能
- 支持一键"确认报警"或"误报忽略"

### 3. 历史警报记录查询
- 列表展示历史报警时间、类型、处理状态
- 支持按时间、类型筛选
- 支持导出日志功能

## API 接口

### 设备管理接口
- `GET /home/{homeId}/room/device/type/list` - 获取设备类型列表
- `POST /home/{homeId}/room/device/add` - 添加设备
- `GET /home/{homeId}/room/device/list` - 获取设备列表
- `POST /home/{homeId}/room/device/update` - 更新设备
- `DELETE /home/{homeId}/room/device/delete?id={deviceId}` - 删除设备

### 设备交互接口
- `POST /home/{homeId}/device/operation` - 设备操作
- `GET /home/{homeId}/device/{deviceId}/operations` - 获取设备操作列表

### 安防监控接口
- `GET /home/{homeId}/security/sensors` - 获取安防传感器状态
- `GET /home/{homeId}/security/alarms` - 获取报警记录

## 使用方法

1. 访问 `/security` 路由查看安防监控主页面
2. 访问 `/security/demo` 路由查看功能演示页面

## 组件说明

- `SecurityStatusPanel` - 实时安防状态面板组件
- `AlarmRecords` - 历史报警记录组件
- `SecurityStore` - 安防状态管理 Store

## 待完善功能

1. WebSocket 实时推送集成
2. APP 推送通知 SDK 集成
3. 更完善的错误处理和重试机制