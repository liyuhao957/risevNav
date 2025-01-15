#!/bin/bash

# 导入配置和工具函数
source "$(dirname "$0")/config.sh"
source "$(dirname "$0")/utils.sh"

# 解析命令行参数
FRONTEND=false
BACKEND=false
MONITOR=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --frontend) FRONTEND=true ;;
        --backend) BACKEND=true ;;
        --monitor) MONITOR=true ;;
        *) echo "未知参数: $1"; exit 1 ;;
    esac
    shift
done

# 如果没有指定参数，则启动所有服务
if ! $FRONTEND && ! $BACKEND && ! $MONITOR; then
    FRONTEND=true
    BACKEND=true
    MONITOR=true
fi

# 检查环境
check_environment() {
    log "检查环境依赖..." "$YELLOW"
    
    # 检查 Node.js
    if ! command -v node >/dev/null 2>&1; then
        log "错误: 未安装 Node.js" "$RED"
        exit 1
    fi
    
    # 检查 Python3
    if ! command -v python3 >/dev/null 2>&1; then
        log "错误: 未安装 Python3" "$RED"
        exit 1
    fi
    
    # 检查虚拟环境
    if [ ! -f "$PYTHON_VENV/bin/activate" ]; then
        log "错误: Python 虚拟环境未创建" "$RED"
        exit 1
    fi
    
    log "环境检查通过" "$GREEN"
}

# 检查端口
check_ports() {
    local ports=()
    if $FRONTEND; then
        ports+=($NAV_FRONTEND_PORT $MON_FRONTEND_PORT)
    fi
    if $BACKEND; then
        ports+=($NAV_BACKEND_PORT $MON_BACKEND_PORT)
    fi
    
    for port in "${ports[@]}"; do
        if lsof -i:$port > /dev/null 2>&1; then
            log "错误: 端口 $port 已被占用" "$RED"
            exit 1
        fi
    done
    
    log "端口检查通过" "$GREEN"
}

# 创建必要的目录
create_directories() {
    log "创建必要的目录..." "$YELLOW"
    
    # 创建日志目录
    mkdir -p "$LOG_DIR"
    
    # 创建数据目录
    if $BACKEND; then
        mkdir -p "$MONITOR_DATA_DIR"
    fi
    
    log "目录创建完成" "$GREEN"
}

# 启动后端服务
start_backend_services() {
    log "启动后端服务..." "$YELLOW"
    
    cd "$NAV_BACKEND_DIR" && npm run dev > "$LOG_NAV_BACKEND" 2>&1 &
    NAV_BACKEND_PID=$!
    log "导航网后端服务已启动 (PID: $NAV_BACKEND_PID)" "$GREEN"
    
    cd "$MON_BACKEND_DIR" && npm run dev > "$LOG_MON_BACKEND" 2>&1 &
    MON_BACKEND_PID=$!
    log "监控系统后端服务已启动 (PID: $MON_BACKEND_PID)" "$GREEN"
    
    # 等待服务启动
    sleep 5
}

# 启动前端服务
start_frontend_services() {
    log "启动前端服务..." "$YELLOW"
    
    cd "$NAV_FRONTEND_DIR" && npm run serve > "$LOG_NAV_FRONTEND" 2>&1 &
    NAV_FRONTEND_PID=$!
    log "导航网前端服务已启动 (PID: $NAV_FRONTEND_PID)" "$GREEN"
    
    cd "$MON_FRONTEND_DIR" && npm run dev > "$LOG_MON_FRONTEND" 2>&1 &
    MON_FRONTEND_PID=$!
    log "监控系统前端服务已启动 (PID: $MON_FRONTEND_PID)" "$GREEN"
}

# 启动监控脚本
start_monitor_scripts() {
    log "启动监控脚本..." "$YELLOW"
    
    # 激活 Python 虚拟环境
    source "$PYTHON_VENV/bin/activate"
    
    cd "$SCRIPTS_DIR"
    # 使用 nohup 启动脚本
    nohup python3 "$PYTHON_SM_SCRIPT" >> "$LOG_MONITOR_SM" 2>&1 & 
    SM_PID=$!
    log "说明监控脚本已启动 (PID: $SM_PID)" "$GREEN"
    
    nohup python3 "$PYTHON_JZQ_SCRIPT" >> "$LOG_MONITOR_JZQ" 2>&1 &
    JZQ_PID=$!
    log "加载器监控脚本已启动 (PID: $JZQ_PID)" "$GREEN"
    
    # 保存 PID 到变量中，方便后续使用
    echo "$SM_PID" > "/tmp/monitor_sm.pid"
    echo "$JZQ_PID" > "/tmp/monitor_jzq.pid"
    
    # 退出虚拟环境
    deactivate
}

# 主函数
main() {
    log "开始启动服务..." "$YELLOW"
    
    # 检查环境和端口
    check_environment
    check_ports
    
    # 创建目录
    create_directories
    
    # 启动服务
    if $BACKEND; then
        start_backend_services
    fi
    
    if $FRONTEND; then
        start_frontend_services
    fi
    
    if $MONITOR; then
        start_monitor_scripts
    fi
    
    log "所有服务启动完成" "$GREEN"
    log "使用 Ctrl+C 停止服务" "$YELLOW"
    
    # 等待用户中断
    wait
}

# 清理函数
cleanup() {
    log "正在停止服务..." "$YELLOW"
    
    # 获取监控脚本的 PID
    local sm_pid=""
    local jzq_pid=""
    [ -f "/tmp/monitor_sm.pid" ] && sm_pid=$(cat "/tmp/monitor_sm.pid")
    [ -f "/tmp/monitor_jzq.pid" ] && jzq_pid=$(cat "/tmp/monitor_jzq.pid")
    
    log "监控脚本PID - 说明: $sm_pid, 加载器: $jzq_pid" "$YELLOW"
    
    # 先停止监控脚本
    if [ -n "$sm_pid" ]; then
        log "正在停止说明监控脚本 (PID: $sm_pid)..." "$YELLOW"
        kill -SIGINT $sm_pid 2>/dev/null
        if [ $? -eq 0 ]; then
            log "成功发送停止信号到说明监控脚本" "$GREEN"
        else
            log "发送停止信号到说明监控脚本失败" "$RED"
        fi
    else
        log "未找到说明监控脚本的PID" "$RED"
    fi
    
    if [ -n "$jzq_pid" ]; then
        log "正在停止加载器监控脚本 (PID: $jzq_pid)..." "$YELLOW"
        kill -SIGINT $jzq_pid 2>/dev/null
        if [ $? -eq 0 ]; then
            log "成功发送停止信号到加载器监控脚本" "$GREEN"
        else
            log "发送停止信号到加载器监控脚本失败" "$RED"
        fi
    else
        log "未找到加载器监控脚本的PID" "$RED"
    fi
    
    # 等待监控脚本处理完停止信号
    log "等待监控脚本停止（5秒）..." "$YELLOW"
    sleep 5
    
    # 检查脚本是否还在运行
    if [ -n "$sm_pid" ] && ps -p $sm_pid > /dev/null 2>&1; then
        log "说明监控脚本仍在运行，尝试强制终止..." "$RED"
        kill -9 $sm_pid 2>/dev/null
    fi
    
    if [ -n "$jzq_pid" ] && ps -p $jzq_pid > /dev/null 2>&1; then
        log "加载器监控脚本仍在运行，尝试强制终止..." "$RED"
        kill -9 $jzq_pid 2>/dev/null
    fi
    
    # 获取其他子进程的 PID
    local pids=$(jobs -p)
    if [ -n "$pids" ]; then
        log "正在停止其他服务 (PIDs: $pids)..." "$YELLOW"
        kill $pids 2>/dev/null
    fi
    
    # 清理临时文件
    log "清理临时文件..." "$YELLOW"
    rm -f "/tmp/monitor_sm.pid" "/tmp/monitor_jzq.pid"
    
    log "服务已停止" "$GREEN"
    exit 0
}

# 注册清理函数
trap cleanup SIGINT SIGTERM

# 运行主函数
main
