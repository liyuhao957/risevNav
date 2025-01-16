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

### 1. 安装依赖
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

### 2. 环境配置

1. 前端环境配置
```bash
# 复制并配置环境变量
cp .env.example .env.development
cp monitor-frontend/.env.example monitor-frontend/.env.development

# .env.development 配置示例
VUE_APP_API_BASE_URL=http://localhost:3000/api
VUE_APP_MONITOR_API_BASE_URL=http://localhost:3001/api
```

2. 后端环境配置
```bash
# server/.env 配置示例
NODE_ENV=development
PORT=3000

# monitor-server/.env 配置示例
NODE_ENV=development
PORT=3001
```

3. Python 脚本配置
```bash
# 复制并配置 Python 环境
cp scripts/config.example.py scripts/config.py
```

### 3. 启动服务

#### 开发环境
```bash
# 导航网前端
npm run serve

# 导航网后端
cd server
NODE_ENV=development npm run dev

# 监控系统前端
cd monitor-frontend
npm run dev

# 监控系统后端
cd monitor-server
NODE_ENV=development npm run dev

# 监控脚本
ENV=development python scripts/huaweiSM.py
ENV=development python scripts/huaweiJZQ.py
```

#### 生产环境
```bash
# 构建前端
npm run build
cd monitor-frontend && npm run build

# 启动服务
./bin/start.sh        # 启动所有服务
./bin/start.sh --frontend  # 只启动前端服务
./bin/start.sh --backend   # 只启动后端服务
./bin/start.sh --monitor   # 只启动监控脚本
```

## 部署说明

### 1. 环境要求
- 系统：Debian GNU/Linux 12 (bookworm)
- CPU：2核+
- 内存：1GB+
- 磁盘：50GB+
- Python：3.11+
- Node.js：18.x
- Nginx：1.22+

### 2. 访问地址
- 导航网站：http://服务器IP:8080
- 监控系统：http://服务器IP:8081

### 3. 部署步骤
1. 克隆代码：
```bash
git clone <仓库地址> /var/www/risevNav
cd /var/www/risevNav
```

2. 安装依赖：
```bash
npm install
cd server && npm install
cd ../monitor-frontend && npm install
cd ../monitor-server && npm install
```

3. 配置环境：
```bash
# 复制并修改环境配置
cp .env.example .env.production
cp monitor-frontend/.env.example monitor-frontend/.env.production
```

4. 构建前端：
```bash
npm run build
cd monitor-frontend && npm run build
```

5. 启动服务：
```bash
./bin/start.sh
```

## 维护说明

### 1. 日志管理
- 日志位置：/logs
- 自动轮转：每12小时
- 日志压缩：自动压缩

### 2. 进程管理
```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs

# 重启服务
pm2 restart all
```

### 3. 更新部署
```bash
# 在项目根目录执行
./update.sh
```

### 4. 常见问题处理
1. 如果服务无法启动：
```bash
# 检查日志
pm2 logs
tail -f logs/nav-frontend.log
```

2. 如果需要重启服务：
```bash
pm2 restart all
```

3. 如果需要清理日志：
```bash
pm2 flush
```

## 更新历史
- 2024-01-16: 添加环境配置管理
- 2024-01-15: 添加监控系统
- 2024-01-14: 优化部署流程
- 2024-01-13: 添加自动更新功能
