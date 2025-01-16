import os

class Config:
    # 环境配置
    ENV = os.getenv('ENV', 'production')
    
    # API 地址配置
    API_URL = os.getenv('MONITOR_API_URL', 
                       'http://localhost:3001/api' if ENV == 'development' else 'http://24.233.2.86:30887/monitor/api')
    
    # 日志配置
    LOG_PATH = os.getenv('LOG_PATH', 
                        './logs' if ENV == 'development' else '/var/www/risevNav/logs')
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG' if ENV == 'development' else 'INFO')
    
    # 监控配置
    MONITOR_INTERVAL = int(os.getenv('MONITOR_INTERVAL', 300))  # 默认5分钟
    
    # 通知配置
    ENABLE_NOTIFICATION = os.getenv('ENABLE_NOTIFICATION', 'true').lower() == 'true'
    
    @classmethod
    def get_log_file(cls, name):
        """获取日志文件路径"""
        return os.path.join(cls.LOG_PATH, f'{name}.log') 