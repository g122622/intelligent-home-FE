<script setup lang="ts">
import "deep-chat";
import { ref, onMounted, onUnmounted } from "vue";
const chatRef = ref();
const isVisible = ref(false);
const hideTimeout = ref<NodeJS.Timeout | null>(null);
const edgeTriggerArea = ref<HTMLElement | null>(null);

const prompt =
  `
接下来的对话中，你将要扮演如下人物：
姓名：小埋
生日：9月26日 （16岁）/ 身高：160cm
头脑聪明长相漂亮，有着奶橘色长发的天才女生。
披着仓鼠型斗篷、十分好吃懒惰并沉迷于ACG
在家几乎只吃饭、睡觉、玩游戏、看漫画，并把家中弄得凌乱不堪。生活起居饮食基本上全部由大平一手承担，是个生活白痴；但是在学校谎称自己会帮大平做便当[作3]。虽然会指使大平做东做西，但其实非常重视和依赖大平；重度兄控，在大平去滨松出差时看到大美女叶就追问大平两人的关系，一开始也极度反对缠着大平的小光来家里玩。
养有两只仓鼠作为宠物，分别命名“仓鼠次郎”和“仓鼠三郎”[作5][注2]。喜欢可乐、泡面、比萨、薯片等食物，讨厌吃青椒[作6]。

你的知识储备如下：
 "你知道吗？智能摄像头不仅能实时监控，还能识别异常声音，比如玻璃破碎，及时向你手机报警。",
  "小贴士：红外人体感应器只能探测移动的人，静止时可能无法识别，建议与其他传感器配合使用。",
  "你知道吗？门窗磁感应器在门或窗被非法打开时，会立刻向你的手机发送报警通知，守护家庭安全。",
  "小贴士：智能门锁没电时，可以用充电宝通过应急接口供电，轻松开门，记得及时更换电池哦。",
  "你知道吗？可视对讲门禁系统支持远程开门，访客来访时你不在家也能一键开门，安全又便捷。",
  "小贴士：燃气泄漏传感器检测到泄漏时，会自动关闭燃气阀并打开排气扇，还能向你手机报警。",
  "你知道吗？声光报警器在触发时会发出高分贝警报和强光，有效震慑入侵者，提醒家人和邻居。",
  "小贴士：完整的安防系统应包含燃气、烟雾、门磁和人体传感器，全方位守护你的家。",
  "你知道吗？当任一传感器报警时，系统可自动录像、启动警报，并推送通知到你的手机。",
  "小贴士：使用语音指令‘打开离家模式’，系统会自动布防并关闭不必要的电器。",
  "你知道吗？收到入侵警报时，可先通过摄像头查看实时画面，判断是误报还是真实威胁。",
  "小贴士：门窗传感器误报可能是因为门窗未关紧或传感器未对齐，定期检查可避免问题。",
  "你知道吗？智能照明系统能根据光线和人员活动自动开关灯，避免‘长明灯’浪费电。",
  "小贴士：智能温控系统会在冬季室温达标后自动降低功率，节省能源又保持舒适。",
  "你知道吗？智能插座可以监控每个电器的耗电量，帮你找出家里的‘电老虎’。",
  "小贴士：使用智能插座定时关闭热水器，既能保证热水供应，又能避免全天加热浪费电。",
  "你知道吗？太阳能光伏发电系统不仅能自用，多余的电还能卖给电网，降低电费支出。",
  "小贴士：系统检测到窗户打开时，会自动关闭空调，防止冷气/暖气外泄，节约能源。",
  "你知道吗？夜间或离家后，系统可自动关闭非必要电器，彻底切断待机功耗。",
  "小贴士：创建‘离家自动关空调’的自动化规则，只需设置‘地理围栏’触发即可。",
  "你知道吗？空调在开窗时持续运行会造成巨大浪费，自动关闭功能帮你省电又环保。",
  "小贴士：开启空调‘睡眠模式’，温度会随时间自动调节，舒适又节能。",
  "你知道吗？通过App的‘能耗监测’功能，可以查看每月耗电排名，优化用电习惯。",
  "小贴士：为电视、游戏机等设备设置‘离家断电’自动化，杜绝待机能耗，轻松省电费。"

【你的任务】
扮演小埋，用户会在接下来询问你一些问题，请根据上述资料回答。回答的风格可以风趣幽默一些。
  `

onMounted(() => {
  console.log("AIChat.vue");
  edgeTriggerArea.value = document.createElement("div");
  edgeTriggerArea.value.style.position = "fixed";
  edgeTriggerArea.value.style.left = "0";
  edgeTriggerArea.value.style.top = "0";
  edgeTriggerArea.value.style.width = "20px";
  edgeTriggerArea.value.style.height = "100vh";
  edgeTriggerArea.value.style.zIndex = "99998";
  edgeTriggerArea.value.style.cursor = "pointer";
  document.body.appendChild(edgeTriggerArea.value);

  edgeTriggerArea.value.addEventListener("mouseenter", handleEdgeMouseEnter);
  document.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  if (edgeTriggerArea.value) {
    edgeTriggerArea.value.removeEventListener("mouseenter", handleEdgeMouseEnter);
    document.body.removeChild(edgeTriggerArea.value);
  }
  document.removeEventListener("mousemove", handleMouseMove);
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
  }
});

const handleEdgeMouseEnter = () => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
  isVisible.value = true;
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isVisible.value) return;

  const chatBox = document.getElementById("wrapper");
  if (!chatBox) return;

  const rect = chatBox.getBoundingClientRect();
  const isInsideChatBox =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!isInsideChatBox) {
    if (hideTimeout.value) {
      clearTimeout(hideTimeout.value);
    }
    hideTimeout.value = setTimeout(() => {
      isVisible.value = false;
    }, 2000);
  } else {
    if (hideTimeout.value) {
      clearTimeout(hideTimeout.value);
      hideTimeout.value = null;
    }
  }
};
</script>

<template>
  <transition name="chatbox">
    <div id="wrapper" v-if="isVisible">
      <deep-chat ref="chatRef" style="
        background-color: #f9ccaa;
        border-color: #dcdcdc;
        border-radius: 10px;
      " :textInput="{
        styles: {
          container: {
            borderRadius: '20px',
            border: '1px solid #969696',
            boxShadow: 'unset',
            width: '78%',
            marginLeft: '-15px'
          },
          text: { padding: '10px', paddingLeft: '15px', paddingRight: '34px' }
        },
        placeholder: { text: '发送消息', style: { color: '#bcbcbc' } }
      }" :messageStyles="{
        default: {
          shared: {
            bubble: {
              maxWidth: '100%',
              backgroundColor: 'unset',
              marginTop: '10px',
              marginBottom: '10px'
            }
          },
          user: { bubble: { marginLeft: '0px', color: 'black' } },
          ai: {
            innerContainer: { borderRadius: '15px', backgroundColor: 'white' }
          }
        }
      }" :avatars="{
        default: {
          styles: {
            position: 'left',
            container: { marginLeft: '12px', marginRight: '5px' }
          }
        },
        ai: {
          src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh6Z5ta8PtclH9J0m2vljJaUIDZq1YKNlHLQ&s',
          styles: { position: 'left', avatar: { paddingTop: '6px' } }
        }
      }" :speechToText="{
        webSpeech: { language: 'zh-CN' },
        button: {
          default: {
            container: {
              default: {
                bottom: '1em',
                right: '0.6em',
                borderRadius: '20px',
                width: '1.9em',
                height: '1.9em'
              }
            },
            svg: { styles: { default: { bottom: '0.35em', left: '0.35em' } } }
          },
          position: 'inside-right'
        }
      }" :submitButtonStyles="{
        position: 'outside-right',
        submit: {
          container: {
            default: {
              bottom: '0.9em',
              borderRadius: '25px',
              padding: '6px 5px 4px',
              backgroundColor: '#f3f6fc'
            },
            hover: { backgroundColor: '#b0deff4f' },
            click: { backgroundColor: '#b0deffb5' }
          },
          svg: {
            content:
              '<?xml version=&quot;1.0&quot; encoding=&quot;utf-8&quot;?> <svg viewBox=&quot;0 0 24 24&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><path d=&quot;m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z&quot;/></svg>',
            styles: {
              default: {
                filter:
                  'brightness(0) saturate(100%) invert(10%) sepia(86%) saturate(6044%) hue-rotate(205deg) brightness(100%) contrast(100%)'
              }
            }
          }
        },
        loading: {
          svg: {
            styles: {
              default: {
                filter:
                  'brightness(0) saturate(100%) invert(72%) sepia(0%) saturate(3044%) hue-rotate(322deg) brightness(100%) contrast(96%)'
              }
            }
          }
        },
        stop: {
          container: { hover: { backgroundColor: '#ededed' } },
          svg: {
            styles: {
              default: {
                filter:
                  'brightness(0) saturate(100%) invert(59%) sepia(0%) saturate(0%) hue-rotate(348deg) brightness(96%) contrast(93%)'
              }
            }
          }
        }
      }" :history="[
        { text: '你好！', role: 'user' },
        {
          text: '我是小埋啦，能给你唠唠智能家居的各种小知识呀，像安防怎么搞、怎么节能这些好玩的事儿都能跟你掰扯掰扯~',
          role: 'ai'
        }
      ]" :demo="false" :directConnection="{
        openAI: {
          key: '5eb3fb2b-6c29-4fab-8025-53bc6ef97eea',
          chat: {
            model: 'doubao-seed-1-6-flash-250615',
            max_tokens: 1024,
            temperature: 1.5,
            top_p: 0.8,
            system_prompt: prompt
          }
        }
      }" />
    </div>
  </transition>
</template>

<style scoped>
#wrapper {
  position: absolute;
  bottom: 265px;
  left: 0px;
  z-index: 99999;
  transition: all 0.3s ease-in-out;
}

.chatbox-enter-from,
.chatbox-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.chatbox-enter-to,
.chatbox-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.chatbox-enter-active,
.chatbox-leave-active {
  transition: all 0.3s ease-in-out;
}

/* 滚动条样式美化 */
/* #wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

#wrapper::-webkit-scrollbar-track {
  background: #962c2c;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
} */
</style>
