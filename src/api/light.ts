import { http } from "@/utils/http";

/** 开灯 */
export const openLight = () => {
  const data = {
    device: "48:11:31:A8:14:6A",
    Code: 1,
    LightCode: "A", //选择ABC三种灯的其中一个
    Result: 1 //1为开启，0为关闭，-1为不存在
  };
  return http.request<void>("post", "/sendMessage", { data });
};
