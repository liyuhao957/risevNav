#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# 服务器信息
SERVER_IP="24.233.2.86"
SERVER_PORT="30887"
SERVER_USER="root"
DEPLOY_PATH="/var/www/risevNav"

echo -e "${BLUE}开始更新代码...${NC}"

# 1. 备份远程代码
echo -e "${BLUE}备份远程代码...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd /var/www && tar -czf risevNav_backup_\$(date +%Y%m%d).tar.gz risevNav/"

# 2. 上传新代码
echo -e "${BLUE}上传新代码...${NC}"
scp -P $SERVER_PORT -r ./* $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/

# 3. 在服务器上执行更新操作
echo -e "${BLUE}在服务器上执行更新操作...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd $DEPLOY_PATH && \
    echo '安装主项目依赖...' && \
    npm install && \
    echo '构建主项目...' && \
    npm run build && \
    echo '安装并构建监控前端...' && \
    cd monitor-frontend && \
    npm install && \
    npm run build && \
    echo '重启所有服务...' && \
    pm2 restart all"

echo -e "${GREEN}更新完成！${NC}"
echo -e "${GREEN}访问地址：${NC}"
echo -e "${GREEN}导航网：http://$SERVER_IP:8080${NC}"
echo -e "${GREEN}监控系统：http://$SERVER_IP:8081${NC}" 