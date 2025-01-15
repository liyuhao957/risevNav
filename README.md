# RiseVNav - 导航与监控系统

## 项目介绍
RiseVNav 是一个集成了导航和监控功能的系统，主要包含：
1. 导航网站：提供便捷的导航服务
2. 监控系统：实时监控华为快应用版本更新和加载器更新

## 项目结构
```bash
risevNav/                # 项目根目录
├── bin/               # 启动脚本
│   ├── start.sh      # 主启动脚本
│   ├── utils.sh      # 工具函数
│   └── config.sh     # 配置文件
│
├── logs/             # 日志文件
│   ├── nav-frontend.log
│   ├── nav-backend.log
│   ├── mon-frontend.log
│   ├── mon-backend.log
│   ├── monitor-sm.log
│   └── monitor-jzq.log
│
├── scripts/          # 监控脚本
│   ├── huaweiSM.py   # 华为说明监控脚本
│   └── huaweiJZQ.py  # 华为加载器监控脚本
│
├── src/              # 导航网前端
│   ├── views/        # 页面组件
│   ├── components/   # 通用组件
│   └── App.vue       # 根组件
│
├── server/           # 导航网后端
│   └── src/          # 源码目录
│
├── monitor-frontend/ # 监控系统前端
│   └── src/          # 源码目录
│
├── monitor-server/   # 监控系统后端
│   ├── src/          # 源码目录
│   └── data/         # 数据文件
│
├── update.sh         # 代码更新脚本
└── README.md         # 项目说明
```

## 技术栈
- 前端：Vue 3 + Element Plus
- 后端：Express + Node.js
- 监控脚本：Python 3
- 进程管理：PM2
- 服务器：Nginx

## 开发环境要求
- Node.js 18.x
- Python 3.11+
- Nginx 1.22+

## 本地开发
1. 安装依赖
```bash
# 导航网前端
npm install

# 导航网后端
cd server
npm install

# 监控系统前端
cd monitor-frontend
npm install

# 监控系统后端
cd monitor-server
npm install

# Python环境
python3 -m venv venv
source venv/bin/activate
pip install -r scripts/requirements.txt
```

2. 启动服务
```bash
# 导航网前端
npm run serve

# 导航网后端
cd server
npm run dev

# 监控系统前端
cd monitor-frontend
npm run dev

# 监控系统后端
cd monitor-server
npm run dev

# 监控脚本
python scripts/huaweiSM.py
python scripts/huaweiJZQ.py
```

## 部署说明
1. 环境要求
- 系统：Debian GNU/Linux 12 (bookworm)
- CPU：2核+
- 内存：1GB+
- 磁盘：50GB+
- Python：3.11+
- Node.js：18.x
- Nginx：1.22+

2. 访问地址
- 导航网：http://24.233.2.86:8080
- 监控系统：http://24.233.2.86:8081

3. 更新部署
在项目根目录执行：
```bash
./update.sh
```

## 功能特性
1. 导航网
   - 工具分类管理
   - 快速搜索
   - 个性化设置

2. 监控系统
   - 实时监控华为快应用版本更新
   - 监控加载器更新
   - 历史记录查看
   - 自动更新检测

## 维护说明
1. 日志管理
   - 日志位置：/logs
   - 自动轮转：每12小时
   - 日志压缩：自动压缩

2. 进程管理
   - 使用PM2管理所有进程
   - 支持开机自启动
   - 自动进程恢复

3. 备份策略
   - 每次更新前自动备份
   - 备份位置：/var/www/
   - 支持快速回滚

## 更新历史
- 2024-01-15: 添加监控系统
- 2024-01-14: 优化部署流程
- 2024-01-13: 添加自动更新功能

## 启动脚本说明
1. 脚本位置
```bash
bin/
├── start.sh      # 主启动脚本
├── utils.sh      # 工具函数
└── config.sh     # 配置文件
```

2. 使用方法
```bash
# 启动所有服务
./bin/start.sh

# 只启动前端服务
./bin/start.sh --frontend

# 只启动后端服务
./bin/start.sh --backend

# 只启动监控脚本
./bin/start.sh --monitor
```

3. 脚本功能
- 自动检查环境依赖
- 自动检查端口占用
- 自动激活Python虚拟环境
- 彩色输出区分不同服务
- 独立的日志文件
- 支持单独启动服务
- 自动错误恢复

4. 日志查看
```bash
# 查看导航网前端日志
tail -f logs/nav-frontend.log

# 查看导航网后端日志
tail -f logs/nav-backend.log

# 查看监控前端日志
tail -f logs/mon-frontend.log

# 查看监控后端日志
tail -f logs/mon-backend.log

# 查看监控脚本日志
tail -f logs/monitor-sm.log
tail -f logs/monitor-jzq.log
```
