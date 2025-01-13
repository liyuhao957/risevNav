export const RISEV_MENU_LIST = [{
        "name": "精品整理",
        "id": 1,
        "icon": require("@/assets/images/menus/hot.svg")
    },
    {
        "name": "文件处理",
        "id": 2,
        "icon": require("@/assets/images/menus/wenjian.svg")
    }, {
        "name": "图像处理",
        "id": 3,
        "icon": require("@/assets/images/menus/picture_interpretation.svg")
    }, {
        "name": "设计制作",
        "id": 4,
        "icon": require("@/assets/images/menus/sheji.svg")
    }, {
        "name": "编程助手",
        "id": 5,
        "icon": require("@/assets/images/menus/biancheng.svg")
    }, {
        "name": "效率工具",
        "id": 6,
        "icon": require("@/assets/images/menus/xiaolv.svg")
    }, {
        "name": "RiseV专属",
        "id": 7,
        "icon": require("@/assets/images/menus/zhuanshu.svg")
    }, {
        "name": "我的收藏",
        "id": 8,
        "icon": require("@/assets/images/menus/shoucang.svg")
    }
]

export const TOOLS_LIST = [
  {
    name: 'Kimi AI',
    description: '智谱AI出品的智能助手',
    target: 'https://kimi.moonshot.cn',
    shorthand: 'kimi ai chat',
    menuId: [1]
  },
  {
    name: '华为',
    description: '华为华为',
    target: 'https://developer.huawei.com/consumer/cn/doc/Tools-Library/quickapp-ide-download-0000001101172926#ZH-CN_TOPIC_0000001101172926__section9347192715112',
    shorthand: 'huawei 华为',
    menuId: [1]
  },
  {
    name: '百度',
    description: 'b',
    target: 'www.baidu.com',
    shorthand: 'baidu 百度',
    menuId: [1]
  },
  {
    name: 'Claude',
    description: 'Anthropic出品的AI助手',
    target: 'https://claude.ai',
    shorthand: 'claude ai chat',
    menuId: [1]
  },
  {
    name: 'ChatGPT',
    description: 'OpenAI出品的AI助手',
    target: 'https://chat.openai.com',
    shorthand: 'chatgpt ai',
    menuId: [5]
  },
  {
    name: 'Midjourney',
    description: 'AI绘画',
    target: 'https://www.midjourney.com',
    shorthand: 'mj ai draw',
    menuId: [3]
  }
  // ... 其他工具配置
]