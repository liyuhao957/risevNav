# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 日志轮转函数
rotate_logs() {
    local log_file="$1"
    local max_size="$2"
    local current_size=$(stat -f%z "$log_file" 2>/dev/null || echo "0")
    
    # 检查文件大小是否超过限制
    if [ "$current_size" -gt "$((${max_size%M} * 1024 * 1024))" ]; then
        local timestamp=$(date +"$LOG_DATE_FORMAT")
        local rotated_file="${log_file}.${timestamp}"
        
        # 移动当前日志文件
        mv "$log_file" "$rotated_file"
        touch "$log_file"
        
        # 如果启用压缩，延迟压缩旧日志
        if [ "$LOG_COMPRESS" = true ] && [ -f "$rotated_file" ]; then
            (sleep $((LOG_COMPRESS_DELAY * 3600)) && gzip "$rotated_file") &
        fi
    fi
    
    # 清理旧日志（超过12小时的）
    find "$(dirname "$log_file")" -name "$(basename "$log_file").*" -mmin +$((LOG_KEEP_HOURS * 60)) -delete
}

# 日志函数
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local message="$1"
    local color="${2:-$GREEN}"
    local log_file="$3"
    
    # 输出到控制台
    echo -e "${color}[$timestamp] $message${NC}"
    
    # 输出到日志文件
    if [ -n "$log_file" ]; then
        echo "[$timestamp] $message" >> "$log_file"
        # 检查是否需要轮转日志
        rotate_logs "$log_file" "$LOG_MAX_SIZE"
    fi
}
