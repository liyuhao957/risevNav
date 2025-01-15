# 项目根目录配置
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 服务目录配置
NAV_FRONTEND_DIR="$PROJECT_ROOT/src"
NAV_BACKEND_DIR="$PROJECT_ROOT/server"
MON_FRONTEND_DIR="$PROJECT_ROOT/monitor-frontend"
MON_BACKEND_DIR="$PROJECT_ROOT/monitor-server"

# 端口配置
NAV_FRONTEND_PORT=8080
NAV_BACKEND_PORT=3000
MON_FRONTEND_PORT=5173
MON_BACKEND_PORT=3001

# Python配置
PYTHON_VENV="$PROJECT_ROOT/venv"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"
PYTHON_SM_SCRIPT="huaweiSM.py"
PYTHON_JZQ_SCRIPT="huaweiJZQ.py"

# 监控数据目录
MONITOR_DATA_DIR="$MON_BACKEND_DIR/data"

# 日志配置
LOG_DIR="$PROJECT_ROOT/logs"
LOG_NAV_FRONTEND="$LOG_DIR/nav-frontend.log"
LOG_NAV_BACKEND="$LOG_DIR/nav-backend.log"
LOG_MON_FRONTEND="$LOG_DIR/mon-frontend.log"
LOG_MON_BACKEND="$LOG_DIR/mon-backend.log"
LOG_MONITOR_SM="$LOG_DIR/monitor-sm.log"
LOG_MONITOR_JZQ="$LOG_DIR/monitor-jzq.log"

# 日志轮转配置
LOG_MAX_SIZE="10M"        # 单个日志文件最大大小
LOG_ROTATE_INTERVAL="12h" # 每12小时轮转一次
LOG_KEEP_HOURS=12        # 保留最近12小时的日志
LOG_COMPRESS=true        # 压缩旧日志
LOG_COMPRESS_DELAY=1     # 延迟1小时后压缩
LOG_DATE_FORMAT="%Y%m%d_%H%M" # 日期格式，包含小时和分钟
