import { loadOml2d } from "oh-my-live2d";
import { idleMessages } from "./idleMessages";

export const loadLive2D = () => {
  loadOml2d({
    dockedPosition: "left",
    initialStatus: "active",
    models: [
      {
        path: "/models/mai/model.json",
        position: [60, 60],
        scale: 0.18,
        stageStyle: {
          height: 370,
          width: 300
        }
      },
      {
        path: "/models/HK416-2-normal/model.json",
        position: [0, 60],
        scale: 0.08,
        stageStyle: {
          height: 450
        }
      }
    ],
    tips: {
      idleTips: {
        wordTheDay: false,
        message: idleMessages,
        duration: 5000,
        interval: 6000
      },
      messageLine: 10,
      welcomeTips: {
        duration: 3000
      },
      style: {
        width: "100%",
        height: "100px"
      }
    }
  });
};
