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

export const TOOLS_LIST = [{
        "logo": require('@/assets/images/kimi.png'),
        "name": "Kimi Ai",
        "desc": "人工智能助手",
        "target": "https://kimi.moonshot.cn/",
        "jp": "km",
        "menuId": [1, 6]
    },
    {
        "logo": require('@/assets/images/wenxinyiyan.svg'),
        "name": "文心一言",
        "desc": "百度文心一言",
        'jp': 'wxyy',
        "target": "https://www.yiyan.baidu.com/",
        "menuId": [1, 6]
    },
    {
        "logo": require('@/assets/images/bdfy.svg'),
        "name": "百度翻译",
        "desc": "在线翻译",
        "jp": "bdfy",
        "target": "https://fanyi.baidu.com/mtpe-individual/multimodal#/",
        "menuId": [6, 1]
    },
    {
        "logo": require('@/assets/images/tinypng.png'),
        "name": "TinyPng",
        "desc": "免费无损压缩图片",
        'jp': 'tiny',
        "target": "https://tinypng.com/",
        "menuId": [3, 1]
    },
    {
        "logo": require('@/assets/images/processon.png'),
        "name": "Processon",
        "desc": "免费在线流程图思维导图",
        'jp': 'processon',
        "target": "https://www.processon.com/",
        "menuId": [4, 1]
    },
    {
        "logo": require('@/assets/images/lovepdf.png'),
        "name": "I❤PDF",
        "desc": "免费PDF合并、拆分、压缩、转换图片等",
        'jp': 'pdf',
        "target": "https://www.ilovepdf.com/zh-cn",
        "menuId": [2, 1]
    },
    {
        "logo": require('@/assets/images/tutieshi.png'),
        "name": "图贴士",
        'jp': 'tts',
        "desc": "gif制作",
        "target": "https://www.ilovepdf.com/zh-cn",
        "menuId": [3]
    },
    {
        "logo": require('@/assets/images/jezh.svg'),
        "name": "金额转换",
        'jp': 'jezh',
        "desc": "在线金额大小写转换",
        "target": "https://www.xiezq.com/",
        "menuId": [6]
    },
    {
        "logo": require('@/assets/images/Fliki.png'),
        "name": "Fliki",
        'jp': 'fli',
        "desc": "文本转视频AI工具",
        "target": "https://kimi.moonshot.cn/",
        "menuId": [3]
    },
    {
        "logo": require('@/assets/images/docsmall.jpg'),
        "name": "DocSmall",
        "desc": "在线压缩文件大小",
        'jp': 'doc',
        "target": "https://docsmall.com/",
        "menuId": [1, 2]
    },
    {
        "logo": require('@/assets/images/cdkm.png'),
        "name": "CDKM",
        'jp': 'zh',
        "desc": "在线文件转换器，完全免费，用完就删！",
        "target": "https://cdkm.com/cn/",
        "menuId": [2]
    },
    {
        "logo": require('@/assets/images/chuangkit.jpeg'),
        "name": "创可贴",
        'jp': 'ckt',
        "desc": "在线作图与视频必备工具",
        "target": "https://www.chuangkit.com/",
        "menuId": [1, 4]
    },
    {
        "logo": require('@/assets/images/clippingmagic.png'),
        "name": "ClippingMagic",
        'jp': 'kt',
        "desc": "在线抠图工具",
        "target": "https://clippingmagic.com/",
        "menuId": [1, 3]
    },
    {
        "logo": require('@/assets/images/cli.png'),
        "name": "草料二维码",
        'jp': 'cl',
        "desc": "在线创建二维码",
        "target": "https://cli.im/",
        "menuId": [1, 4]
    },
    {
        "logo": require('@/assets/images/gaoding.png'),
        "name": "UUPOOP",
        'jp': 'ps',
        "desc": "在线PS处理",
        "target": "https://www.uupoop.com/",
        "menuId": [3, 1]
    },
    {
        "logo": require('@/assets/images/gamma.png'),
        "name": "Gamma",
        'jp': 'ppt',
        "desc": "最好用的AI生成PPT工具",
        "target": "https://gamma.app/",
        "menuId": [2, 6]
    },
    {
        "logo": require('@/assets/images/billfish.png'),
        "name": "Billfish",
        'jp': 'billfish',
        "desc": "收集和整理创意灵感",
        "target": "https://www.billfish.cn/",
        "menuId": [4]
    },
    {
        "logo": require('@/assets/images/xunjie.png'),
        "name": "迅捷思维导图",
        'jp': 'swdt',
        "desc": "支持多人协作",
        "target": "https://www.liuchengtu.com/",
        "menuId": [4]
    },
    {
        "logo": require('@/assets/images/removebg.png'),
        "name": "Remove.bg",
        "desc": "图片背景消除",
        'jp': 'bjxc',
        "target": "www.remove.bg/",
        "menuId": [3, 1]
    },
    {
        "logo": require('@/assets/images/bro.svg'),
        "name": "BrowserFrame",
        "desc": "网页截图嵌入浏览器",
        'jp': 'jt',
        "target": "https://browserframe.com/",
        "menuId": [6]
    },
    {
        "logo": require('@/assets/images/tengxunwendang.png'),
        "name": "腾讯文档",
        "desc": "支持多人在线编辑Word、Excel",
        'jp': 'wd',
        "target": "https://docs.qq.com/home",
        "menuId": [2, 1]
    },
    {
        "logo": require('@/assets/images/convertio.png'),
        "name": "Convertio",
        "desc": "在线文档文件转换器",
        'jp': 'zh',
        "target": "https://convertio.co/zh/document-converter/",
        "menuId": [2, 1]
    }, {
        "logo": require('@/assets/images/videvo.svg'),
        "name": "VIDEVO",
        "desc": "视频素材下载",
        'jp': 'video',
        "target": "https://www.videvo.net/",
        "menuId": [3]
    }, {
        "logo": require('@/assets/images/loading.png'),
        "name": "Loading",
        "desc": "制作GIF、SVG、CSS加载动画图标",
        'jp': 'load',
        "target": "https://loading.io/",
        "menuId": [4]
    }, {
        "logo": require('@/assets/images/iconfont.png'),
        "name": "iconfont",
        "desc": "阿里团队图标字体及图标素材下载",
        'jp': 'iconfont',
        "target": "https://www.iconfont.cn/plus",
        "menuId": [4]
    }, {
        "logo": require('@/assets/images/trianglify.png'),
        "name": "Trianglify",
        "desc": "炫酷多边形背景色块生成",
        'jp': 'ys',
        "target": "https://trianglify.io/",
        "menuId": [4]
    }, {
        "logo": require('@/assets/images/lingdaima.svg'),
        "name": "零代码",
        "desc": "专为前端打造",
        'jp': 'code',
        "target": "http://www.lingdaima.com/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/erjinzhi.png'),
        "name": "进制转换",
        "desc": "在线进制转换",
        'jp': 'jz',
        "target": "https://tool.lu/hexconvert/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/cardbon.png'),
        "name": "carbon",
        "desc": "代码生成海报",
        'jp': 'hb',
        "target": "https://carbon.now.sh/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/jiami.png'),
        "name": "加密解密",
        "desc": "在线加密解密",
        'jp': 'dec',
        "target": "https://tool.lu/encdec/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/bejson.svg'),
        "name": "bejson",
        "desc": "json格式化",
        'jp': 'json',
        "target": "https://www.bejson.com/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/yanse.svg'),
        "name": "颜色转换",
        "desc": "RGB转16进制",
        'jp': 'ys',
        "target": "https://www.jyshare.com/front-end/55/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/cubic.png'),
        "name": "cubic",
        "desc": "贝塞尔曲线生成",
        'jp': 'bse',
        "target": "https://cubic-bezier.com/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/codepen.png'),
        "name": "codepen",
        "desc": "在线炫酷样式技能效果",
        'jp': 'code',
        "target": "https://codepen.io/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/modao.svg'),
        "name": "墨刀",
        "desc": "让原型设计更简单",
        'jp': 'md',
        "target": "https://modao.cc/",
        "menuId": [4, 1]
    }, {
        "logo": require('@/assets/images/codepen.png'),
        "name": "codepen",
        "desc": "变量命名转换",
        'jp': 'code',
        "target": "https://www.iamwawa.cn/namingconverter.html",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/mahua-logo.jpeg'),
        "name": "mahua",
        "desc": "在线markdown编辑器",
        'jp': 'markdown',
        "target": "http://mahua.jser.me/",
        "menuId": [5]
    }, {
        "logo": require('@/assets/images/zhongguose.png'),
        "name": "中国传统颜色",
        "desc": "中科院色谱的中国传统色",
        'jp': 'ps',
        "target": "https://www.zhongguose.com/",
        "menuId": [4]
    }, {
        "logo": require('@/assets/images/lanhu.svg'),
        "name": "蓝湖",
        "desc": "产品设计协作平台",
        'jp': 'lh',
        "target": "https://lanhuapp.com/",
        "menuId": [1, 4]
    }
]

export const ACCOUNT_TYPE_LIST = [{
    "logo": require('@/assets/images/icon-chatgpt.svg'),
    "name": "Chatgpt",
    "desc": "最强人工智能，免费使用",
    "type": "账号共享",
    "target": "",
    "id": 1,
    "accountList": []
}]