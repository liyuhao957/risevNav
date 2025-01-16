# 上下文
任务文件名称: 2024-01-16_1_deploy_project
创建时间: 2024-01-16_10:30:00
创建者: ct
快速模式: off

# 任务描述
将 RisevNav 项目完整部署到服务器中，包括导航系统和监控系统的所有组件。

# 项目概述
RisevNav 是一个集成了导航和监控功能的系统，主要包含导航网站和监控系统两个主要部分。
需要部署的组件包括：
1. 导航网站前端（Vue 3）
2. 导航网站后端（Express）
3. 监控系统前端（Vue 3）
4. 监控系统后端（Express）
5. 监控脚本（Python）

# 任务分析
## 目的
- 在服务器上完整部署 RisevNav 项目的所有组件
- 确保所有服务正常运行和互相通信
- 建立自动化的部署和维护流程

## 已识别的问题
1. 环境依赖
   - 需要安装和配置 Node.js、Python、Nginx 等环境
   - 需要管理多个服务的进程
2. 配置要求
   - 需要正确配置各个服务的端口和通信
   - 需要设置环境变量和配置文件
3. 维护考虑
   - 需要设置日志管理
   - 需要配置进程管理
   - 需要建立备份策略

# 主分支
main

# 任务分支
task/deploy_project_2024-01-16_1

# 部署步骤
1. 服务器环境准备
   - 安装基础软件包
   - 配置 Node.js 环境
   - 配置 Python 环境
   - 安装和配置 Nginx
   - 安装 PM2

2. 代码部署
   - 克隆代码到服务器
   - 安装项目依赖
   - 构建前端项目
   - 配置环境变量

3. 服务配置
   - 配置 Nginx
   - 配置 PM2
   - 设置开机自启
   - 配置日志轮转

4. 启动服务
   - 启动所有服务
   - 验证服务状态
   - 检查日志输出

5. 测试验证
   - 测试所有功能点
   - 验证监控脚本
   - 检查日志记录

6. 代码配置检查

### 前端配置检查
1. 导航网站前端 (Vue)
   - [ ] 检查 `src/services/api.js` 中的 API 基础URL配置
   - [ ] 检查 `.env`、`.env.development`、`.env.production` 文件中的环境变量
   - [ ] 检查 `vue.config.js` 中的代理配置
   - [ ] 检查是否有硬编码的 API 地址

2. 监控系统前端
   - [ ] 检查 `monitor-frontend/src/services/api.js` 中的 API 配置
   - [ ] 检查 `monitor-frontend/.env*` 文件中的环境变量
   - [ ] 检查 WebSocket 连接配置（如果有）
   - [ ] 检查是否有硬编码的监控后端地址

### 后端配置检查
1. 导航网站后端
   - [ ] 检查 `server/src/config.js` 中的服务配置
   - [ ] 检查监听地址和端口配置
   - [ ] 检查 CORS 配置
   - [ ] 检查数据库连接配置（如果有）

2. 监控系统后端
   - [ ] 检查 `monitor-server/src/config.js` 中的服务配置
   - [ ] 检查监听地址和端口配置
   - [ ] 检查 CORS 配置
   - [ ] 检查与监控脚本的通信配置

### Python 脚本检查
1. 华为说明监控脚本
   - [ ] 检查 `scripts/huaweiSM.py` 中的配置
   - [ ] 检查与监控后端的通信地址
   - [ ] 检查日志路径配置

2. 华为加载器监控脚本
   - [ ] 检查 `scripts/huaweiJZQ.py` 中的配置
   - [ ] 检查与监控后端的通信地址
   - [ ] 检查日志路径配置

### 需要修改的配置项
1. 前端配置
```javascript
// 需要支持从环境变量读取 API 地址
VUE_APP_API_BASE_URL=http://localhost:3000/api  // 开发环境
VUE_APP_API_BASE_URL=/api                       // 生产环境

VUE_APP_MONITOR_API_BASE_URL=http://localhost:3001/api  // 开发环境
VUE_APP_MONITOR_API_BASE_URL=/api                       // 生产环境
```

2. 后端配置
```javascript
// 需要支持从环境变量读取监听地址
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
```

3. Python 脚本配置
```python
# 需要支持从环境变量或配置文件读取
MONITOR_API_URL = os.getenv('MONITOR_API_URL', 'http://localhost:3001/api')
LOG_PATH = os.getenv('LOG_PATH', '/var/www/risevNav/logs')
```

### 配置文件管理
1. 创建配置模板
   ```bash
   # 复制环境变量模板
   cp .env.example .env
   cp monitor-frontend/.env.example monitor-frontend/.env
   ```

2. 更新生产环境配置
   ```bash
   # 导航网站前端 .env.production
   VUE_APP_API_BASE_URL=/api
   
   # 监控系统前端 .env.production
   VUE_APP_API_BASE_URL=/api
   ```

3. 创建 Python 配置
   ```bash
   # config.py
   import os
   
   # 默认配置
   DEFAULT_CONFIG = {
       'api_url': 'http://localhost:3001/api',
       'log_path': '/var/www/risevNav/logs'
   }
   
   # 从环境变量加载配置
   config = {
       'api_url': os.getenv('MONITOR_API_URL', DEFAULT_CONFIG['api_url']),
       'log_path': os.getenv('LOG_PATH', DEFAULT_CONFIG['log_path'])
   }
   ```

注意：这些检查和修改应该在部署前完成，以确保服务能够正常通信。

### 环境配置管理说明

为了确保本地开发和服务器部署都能正常工作，我们采用以下配置管理策略：

1. 前端环境配置
```bash
# .env.development（本地开发环境）
VUE_APP_API_BASE_URL=http://localhost:3000/api
VUE_APP_MONITOR_API_BASE_URL=http://localhost:3001/api

# .env.production（服务器生产环境）
VUE_APP_API_BASE_URL=/api
VUE_APP_MONITOR_API_BASE_URL=/api
```

2. Vue 开发环境代理配置
```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/monitor/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
}
```

3. 后端环境配置
```javascript
// server/src/config.js
const config = {
  // 根据环境变量决定配置
  host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  port: process.env.PORT || 3000,
  // 开发环境允许跨域
  cors: process.env.NODE_ENV === 'development' ? {
    origin: ['http://localhost:8080', 'http://localhost:8081'],
    credentials: true
  } : undefined
};
```

4. Python 脚本环境配置
```python
# scripts/config.py
import os

class Config:
    # 根据环境变量决定配置
    ENV = os.getenv('ENV', 'development')
    
    # API 地址配置
    API_URL = os.getenv('MONITOR_API_URL', 
                       'http://localhost:3001/api' if ENV == 'development' else '/api')
    
    # 日志路径配置
    LOG_PATH = os.getenv('LOG_PATH', 
                        './logs' if ENV == 'development' else '/var/www/risevNav/logs')

```

### 环境切换说明

1. 本地开发：
   ```bash
   # 前端开发
   npm run serve  # 自动使用 .env.development 配置

   # 后端开发
   cd server
   NODE_ENV=development npm run dev

   # 监控脚本开发
   ENV=development python scripts/huaweiSM.py
   ```

2. 服务器部署：
   ```bash
   # 前端构建
   npm run build  # 自动使用 .env.production 配置

   # 后端启动
   cd server
   NODE_ENV=production npm start

   # 监控脚本启动
   ENV=production python scripts/huaweiSM.py
   ```

这样的配置管理可以确保：
1. 本地开发时，所有服务都使用 localhost 和对应端口
2. 服务器部署时，使用相对路径和正确的生产环境配置
3. 不需要手动修改代码，只通过环境变量和配置文件区分环境
4. 开发环境和生产环境的配置完全分离，互不影响

# 具体执行步骤

## 1. 服务器环境准备
```bash
# 更新系统包
apt update && apt upgrade -y

# 安装基础工具
apt install -y git curl wget vim

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 安装 Python 3.11
apt install -y python3.11 python3.11-venv

# 安装 Nginx
apt install -y nginx

# 安装 PM2
npm install -g pm2
```

## 2. 代码部署
```bash
# 创建项目目录
mkdir -p /var/www/risevNav
cd /var/www/risevNav

# 克隆代码
git clone <你的仓库地址> .

# 安装依赖
npm install
cd server && npm install
cd ../monitor-frontend && npm install
cd ../monitor-server && npm install

# 创建并激活 Python 虚拟环境
python3 -m venv venv
source venv/bin/activate
pip install -r scripts/requirements.txt

# 构建前端项目
npm run build
cd monitor-frontend && npm run build
```

## 3. Nginx 配置
```nginx
# /etc/nginx/conf.d/risevnav.conf

# 导航网站配置
server {
    listen 8080;  # 导航网站使用 8080 端口
    
    # 导航网站前端
    location / {
        root /var/www/risevNav/dist;
        try_files $uri $uri/ /index.html;
    }

    # 导航网站后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 监控系统配置
server {
    listen 8081;  # 监控系统使用 8081 端口
    
    # 监控系统前端
    location / {
        root /var/www/risevNav/monitor-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 监控系统后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 4. PM2 配置
```json
// ecosystem.config.js
{
  "apps": [
    {
      "name": "nav-backend",
      "cwd": "/var/www/risevNav/server",
      "script": "src/app.js",
      "watch": false,
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000
      }
    },
    {
      "name": "monitor-backend",
      "cwd": "/var/www/risevNav/monitor-server",
      "script": "src/app.js",
      "watch": false,
      "env": {
        "NODE_ENV": "production",
        "PORT": 3001
      }
    },
    {
      "name": "monitor-sm",
      "cwd": "/var/www/risevNav",
      "script": "scripts/huaweiSM.py",
      "interpreter": "/var/www/risevNav/venv/bin/python3",
      "watch": false
    },
    {
      "name": "monitor-jzq",
      "cwd": "/var/www/risevNav",
      "script": "scripts/huaweiJZQ.py",
      "interpreter": "/var/www/risevNav/venv/bin/python3",
      "watch": false
    }
  ]
}
```

## 5. 日志配置
```bash
# /etc/logrotate.d/risevnav
/var/www/risevNav/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
```

## 6. 启动服务
```bash
# 启动 Nginx
systemctl start nginx
systemctl enable nginx

# 启动所有服务
cd /var/www/risevNav
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 7. 验证检查清单
- [ ] Nginx 配置测试：`nginx -t`
- [ ] 前端访问测试：访问网站首页
- [ ] 后端 API 测试：测试 API 接口
- [ ] 监控系统测试：访问监控页面
- [ ] Python 脚本测试：检查监控日志
- [ ] PM2 进程状态：`pm2 status`
- [ ] 日志检查：检查所有日志文件
- [ ] 自启动测试：重启服务器测试

## 8. 代码配置检查

### 前端配置检查
1. 导航网站前端 (Vue)
   - [ ] 检查 `src/services/api.js` 中的 API 基础URL配置
   - [ ] 检查 `.env`、`.env.development`、`.env.production` 文件中的环境变量
   - [ ] 检查 `vue.config.js` 中的代理配置
   - [ ] 检查是否有硬编码的 API 地址

2. 监控系统前端
   - [ ] 检查 `monitor-frontend/src/services/api.js` 中的 API 配置
   - [ ] 检查 `monitor-frontend/.env*` 文件中的环境变量
   - [ ] 检查 WebSocket 连接配置（如果有）
   - [ ] 检查是否有硬编码的监控后端地址

### 后端配置检查
1. 导航网站后端
   - [ ] 检查 `server/src/config.js` 中的服务配置
   - [ ] 检查监听地址和端口配置
   - [ ] 检查 CORS 配置
   - [ ] 检查数据库连接配置（如果有）

2. 监控系统后端
   - [ ] 检查 `monitor-server/src/config.js` 中的服务配置
   - [ ] 检查监听地址和端口配置
   - [ ] 检查 CORS 配置
   - [ ] 检查与监控脚本的通信配置

### Python 脚本检查
1. 华为说明监控脚本
   - [ ] 检查 `scripts/huaweiSM.py` 中的配置
   - [ ] 检查与监控后端的通信地址
   - [ ] 检查日志路径配置

2. 华为加载器监控脚本
   - [ ] 检查 `scripts/huaweiJZQ.py` 中的配置
   - [ ] 检查与监控后端的通信地址
   - [ ] 检查日志路径配置

### 需要修改的配置项
1. 前端配置
```javascript
// 需要支持从环境变量读取 API 地址
VUE_APP_API_BASE_URL=http://localhost:3000/api  // 开发环境
VUE_APP_API_BASE_URL=/api                       // 生产环境

VUE_APP_MONITOR_API_BASE_URL=http://localhost:3001/api  // 开发环境
VUE_APP_MONITOR_API_BASE_URL=/api                       // 生产环境
```

2. 后端配置
```javascript
// 需要支持从环境变量读取监听地址
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
```

3. Python 脚本配置
```python
# 需要支持从环境变量或配置文件读取
MONITOR_API_URL = os.getenv('MONITOR_API_URL', 'http://localhost:3001/api')
LOG_PATH = os.getenv('LOG_PATH', '/var/www/risevNav/logs')
```

### 配置文件管理
1. 创建配置模板
   ```bash
   # 复制环境变量模板
   cp .env.example .env
   cp monitor-frontend/.env.example monitor-frontend/.env
   ```

2. 更新生产环境配置
   ```bash
   # 导航网站前端 .env.production
   VUE_APP_API_BASE_URL=/api
   
   # 监控系统前端 .env.production
   VUE_APP_API_BASE_URL=/api
   ```

3. 创建 Python 配置
   ```bash
   # config.py
   import os
   
   # 默认配置
   DEFAULT_CONFIG = {
       'api_url': 'http://localhost:3001/api',
       'log_path': '/var/www/risevNav/logs'
   }
   
   # 从环境变量加载配置
   config = {
       'api_url': os.getenv('MONITOR_API_URL', DEFAULT_CONFIG['api_url']),
       'log_path': os.getenv('LOG_PATH', DEFAULT_CONFIG['log_path'])
   }
   ```

注意：这些检查和修改应该在部署前完成，以确保服务能够正常通信。

# 当前执行步骤：1

# 任务进度
- 2024-01-16_10:30:00 创建部署任务文件，规划部署步骤
- 2024-01-16_10:30:00 添加代码配置检查部分
- 2024-01-16_11:30:00 开始创建环境配置文件
- 2024-01-16_11:45:00 完成环境配置文件创建：
  - 创建前端环境配置（.env.example, .env.development, .env.production）
  - 创建监控前端环境配置
  - 创建后端环境配置
  - 创建 Python 配置文件
  - 更新 Vue 配置文件
- 2024-01-16_12:00:00 完成配置文件复制：
  - 复制 .env.example → .env
  - 复制 monitor-frontend/.env.example → monitor-frontend/.env
  - 复制 server/.env.example → server/.env
  - 复制 monitor-server/.env.example → monitor-server/.env
  - 复制 scripts/config.example.py → scripts/config.py
- 2024-01-16_14:30:00 清理服务器上的旧部署：
  - 停止并删除所有 PM2 进程（monitor-backend, monitor-frontend, monitor-sm, nav-backend, monitor-jzq, nav-frontend）
  - 停止 Nginx 服务
  - 删除旧的项目目录 /var/www/risevNav

# 要采取的步骤
1. 创建前端环境配置文件
   - [x] 创建 `.env.example`
   - [x] 创建 `.env.development`
   - [x] 创建 `.env.production`
   - [x] 创建 `monitor-frontend/.env.example`
   - [x] 创建 `monitor-frontend/.env.development`
   - [x] 创建 `monitor-frontend/.env.production`

2. 创建后端环境配置文件
   - [x] 创建 `server/.env.example`
   - [x] 创建 `monitor-server/.env.example`

3. 创建 Python 配置文件
   - [x] 创建 `scripts/config.example.py`

4. 更新 Vue 配置
   - [x] 更新 `vue.config.js`
   - [x] 更新 `monitor-frontend/vue.config.js`

5. 复制配置文件
   - [x] 复制 `.env.example` → `.env`
   - [x] 复制 `monitor-frontend/.env.example` → `monitor-frontend/.env`
   - [x] 复制 `server/.env.example` → `server/.env`
   - [x] 复制 `monitor-server/.env.example` → `monitor-server/.env`
   - [x] 复制 `scripts/config.example.py` → `scripts/config.py`

# 最终审查
[待完成] 

# 服务启动指南

## 方式一：使用启动脚本（推荐）
```bash
# 进入项目目录
cd /var/www/risevNav

# 使用项目自带的启动脚本
./bin/start.sh        # 启动所有服务
./bin/start.sh --frontend  # 只启动前端服务
./bin/start.sh --backend   # 只启动后端服务
./bin/start.sh --monitor   # 只启动监控脚本
```

## 方式二：手动启动各个服务

1. 启动 Nginx（如果没有自动启动）
```bash
sudo systemctl start nginx
sudo systemctl status nginx  # 检查状态
```

2. 使用 PM2 管理服务
```bash
# 进入项目目录
cd /var/www/risevNav

# 启动所有服务
pm2 start ecosystem.config.js

# 查看服务状态
pm2 status

# 常用 PM2 命令：
pm2 list                    # 列出所有服务
pm2 stop all               # 停止所有服务
pm2 restart all            # 重启所有服务
pm2 reload all             # 零停机重载所有服务
pm2 logs                   # 查看所有服务日志
pm2 logs nav-backend       # 查看导航后端日志
pm2 logs monitor-backend   # 查看监控后端日志
pm2 logs monitor-sm        # 查看说明监控脚本日志
pm2 logs monitor-jzq       # 查看加载器监控脚本日志
```

3. 查看各服务日志
```bash
# 导航网站日志
tail -f logs/nav-frontend.log
tail -f logs/nav-backend.log

# 监控系统日志
tail -f logs/mon-frontend.log
tail -f logs/mon-backend.log
tail -f logs/monitor-sm.log
tail -f logs/monitor-jzq.log
```

## 服务访问地址
- 导航网站：http://服务器IP:8080
- 监控系统：http://服务器IP:8081

例如，如果你的服务器 IP 是 192.168.1.100：
- 导航网站：http://192.168.1.100:8080
- 监控系统：http://192.168.1.100:8081

注意事项：
1. 确保服务器防火墙已开放 8080 和 8081 端口：
```bash
# Ubuntu/Debian
sudo ufw allow 8080
sudo ufw allow 8081

# CentOS
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --reload
```

2. 如果使用云服务器，需要在安全组中开放这两个端口

3. 测试端口是否开放：
```bash
# 在服务器上测试端口
nc -zv localhost 8080
nc -zv localhost 8081

# 或者使用 curl 测试
curl http://localhost:8080
curl http://localhost:8081
```

## 常见问题处理

1. 如果服务无法启动：
```bash
# 检查 PM2 日志
pm2 logs

# 检查 Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# 检查端口占用
sudo lsof -i :3000  # 检查导航后端端口
sudo lsof -i :3001  # 检查监控后端端口
sudo lsof -i :80    # 检查 Nginx 端口
```

2. 如果需要重启所有服务：
```bash
# 停止所有服务
pm2 stop all
sudo systemctl stop nginx

# 启动所有服务
sudo systemctl start nginx
pm2 start ecosystem.config.js
```

3. 如果需要更新代码后重启：
```bash
# 拉取最新代码
git pull

# 重新构建前端
npm run build
cd monitor-frontend && npm run build

# 重启服务
pm2 reload all
``` 