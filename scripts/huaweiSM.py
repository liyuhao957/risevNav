import requests
import time
import hashlib
import json
import os
import shutil
from datetime import datetime
from bs4 import BeautifulSoup
import re
import signal

def signal_handler(monitor_instance, signum, frame):
    """信号处理函数"""
    print("\n收到退出信号，正在停止监控...")
    try:
        print("准备发送停止通知...")
        shutdown_message = {
            "msg_type": "interactive",
            "card": {
                "config": {
                    "wide_screen_mode": True
                },
                "header": {
                    "template": "blue",
                    "title": {
                        "content": "快应用版本说明更新通知",
                        "tag": "plain_text"
                    }
                },
                "elements": [
                    {
                        "tag": "div",
                        "text": {
                            "tag": "lark_md",
                            "content": "🔔 版本说明更新监控服务已停止"
                        }
                    }
                ]
            }
        }
        print("正在发送停止通知...")
        monitor_instance.send_notification(shutdown_message, msg_type="post")
        print("停止通知已发送")
    except Exception as e:
        print(f"发送停止通知时出错: {str(e)}")
    finally:
        # 确保退出进程
        os._exit(0)

class VersionMonitor:
    def __init__(self, url, webhook_url, check_interval=300):
        self.url = url
        self.webhook_url = webhook_url
        self.check_interval = check_interval
        self.last_hash = None
        self.last_content = None
        self.data_file = '../monitor-server/data/version_updates.json'
        self.backup_dir = '../monitor-server/data/backup'
        self.max_backups = 5
        
        # 确保数据和备份目录存在
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        os.makedirs(self.backup_dir, exist_ok=True)
        
        # 初始化或恢复数据文件
        self._init_or_recover_data()
        
        # 注册信号处理函数
        signal.signal(signal.SIGINT, lambda s, f: signal_handler(self, s, f))
        signal.signal(signal.SIGTERM, lambda s, f: signal_handler(self, s, f))
    
    def _init_or_recover_data(self):
        """初始化或恢复数据文件"""
        if not os.path.exists(self.data_file):
            # 尝试从备份恢复
            latest_backup = self._get_latest_backup()
            if latest_backup:
                try:
                    shutil.copy2(latest_backup, self.data_file)
                    print(f"从备份文件恢复数据: {latest_backup}")
                    return
                except Exception as e:
                    print(f"恢复备份失败: {str(e)}")
            
            # 如果没有备份或恢复失败，创建新文件
            self._save_data({"latest": None, "history": [], "lastCheck": None})
    
    def _get_latest_backup(self):
        """获取最新的备份文件"""
        backup_files = [f for f in os.listdir(self.backup_dir) if f.startswith('version_updates_')]
        if not backup_files:
            return None
        
        backup_files.sort(reverse=True)
        return os.path.join(self.backup_dir, backup_files[0])
    
    def _create_backup(self):
        """创建数据文件的备份"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_file = os.path.join(self.backup_dir, f'version_updates_{timestamp}.json')
            shutil.copy2(self.data_file, backup_file)
            print(f"创建备份文件: {backup_file}")
            
            # 清理旧备份
            self._cleanup_old_backups()
        except Exception as e:
            print(f"创建备份失败: {str(e)}")
    
    def _cleanup_old_backups(self):
        """清理旧的备份文件，只保留最新的几个"""
        backup_files = [f for f in os.listdir(self.backup_dir) if f.startswith('version_updates_')]
        if len(backup_files) > self.max_backups:
            backup_files.sort()
            for old_file in backup_files[:-self.max_backups]:
                try:
                    os.remove(os.path.join(self.backup_dir, old_file))
                    print(f"删除旧备份: {old_file}")
                except Exception as e:
                    print(f"删除旧备份失败: {str(e)}")
    
    def _read_data(self):
        """读取数据文件"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError as e:
                print(f"JSON解析错误: {str(e)}")
                if attempt < max_retries - 1:
                    print(f"尝试从备份恢复 ({attempt + 1}/{max_retries})...")
                    self._restore_from_backup()
                else:
                    raise
            except Exception as e:
                print(f"读取数据失败: {str(e)}")
                if attempt < max_retries - 1:
                    print(f"重试 ({attempt + 1}/{max_retries})...")
                    time.sleep(1)
                else:
                    raise
    
    def _restore_from_backup(self):
        """从最新的备份文件恢复"""
        latest_backup = self._get_latest_backup()
        if latest_backup:
            try:
                shutil.copy2(latest_backup, self.data_file)
                print(f"从备份文件恢复成功: {latest_backup}")
            except Exception as e:
                print(f"恢复备份失败: {str(e)}")
                raise
    
    def _save_data(self, data):
        """保存数据到JSON文件"""
        temp_file = f"{self.data_file}.tmp"
        try:
            # 先写入临时文件
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            # 替换原文件
            os.replace(temp_file, self.data_file)
            print(f"数据已保存到: {self.data_file}")
            
            # 创建备份
            self._create_backup()
        except Exception as e:
            print(f"保存数据失败: {str(e)}")
            # 清理临时文件
            if os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                except:
                    pass
            raise
    
    def _update_data(self, content):
        """更新数据文件"""
        try:
            # 读取现有数据
            data = self._read_data()
            
            # 如果是新版本，添加到历史记录
            if data['latest'] is None or data['latest']['version'] != content['version']:
                # 将当前的latest添加到history
                if data['latest'] is not None:
                    history_record = {
                        **data['latest'],
                        'lastCheck': data['lastCheck']
                    }
                    data['history'].insert(0, history_record)
                
                # 更新latest
                data['latest'] = content
                
                # 限制历史记录数量为最近10条
                data['history'] = data['history'][:10]
            
            # 更新最后检查时间
            data['lastCheck'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # 保存数据
            self._save_data(data)
            print(f"数据更新成功: 版本 {content['version']}")
        except Exception as e:
            print(f"更新数据失败: {str(e)}")
            raise
    
    def get_page_content(self):
        """获取网页特定内容"""
        try:
            print("正在获取网页内容...")
            api_url = "https://svc-drcn.developer.huawei.com/community/servlet/consumer/cn/documentPortal/getDocumentById"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Content-Type': 'application/json',
                'Origin': 'https://developer.huawei.com',
                'Referer': 'https://developer.huawei.com/'
            }
            
            data = {
                "objectId": "quickapp-version-updates-0000001079803874",
                "version": "",
                "catalogName": "quickApp-Guides",
                "language": "cn"
            }
            
            print("发送POST请求...")
            response = requests.post(api_url, json=data, headers=headers)
            print(f"响应状态码: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                if data['code'] == 0 and 'value' in data and 'content' in data['value']:
                    html_content = data['value']['content']['content']
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    # 查找所有版本更新信息的标题
                    version_titles = soup.find_all(['h1', 'h2', 'h3', 'h4'])
                    latest_version = None
                    latest_date = None
                    
                    # 遍历所有标题，找出最新的版本信息
                    for title in version_titles:
                        title_text = title.text.strip()
                        if '版本更新说明' in title_text and '（' in title_text:
                            version_number = title_text.split('版本更新说明')[0].strip()
                            version_date = title_text[title_text.find('（')+1:title_text.find('）')]
                            
                            # 找到第一个版本信息就退出，因为最新的版本会在最上面
                            latest_version = version_number
                            latest_date = version_date
                            
                            # 获取所有更新内容
                            updates = []
                            
                            # 1. 查找并解析组件部分
                            component_title = title.find_next(lambda tag: tag.name in ['h4'] and '组件' in tag.text)
                            if component_title:
                                component_table = component_title.find_next('table')
                                if component_table:
                                    updates.append("【组件更新】")
                                    # 解析组件表格
                                    rows = component_table.find_all('tr')[1:]
                                    for row in rows:
                                        cols = row.find_all('td')
                                        if len(cols) >= 2:
                                            component = cols[0].text.strip()
                                            description_cell = cols[1]  # 获取整个单元格
                                            
                                            # 分割描述文本，但保留HTML结构
                                            descriptions = []
                                            for text in description_cell.stripped_strings:
                                                if text.strip():
                                                    descriptions.append(text.strip())
                                            
                                            update_info = [f"【{component}】"]
                                            
                                            # 先添加更新内容
                                            main_content = descriptions[0] if descriptions else ""  # 第一段是主要内容
                                            for desc in main_content.split('。'):
                                                if desc.strip() and '详情请参见' not in desc:
                                                    update_info.append(f"• {desc.strip()}")
                                            
                                            # 再添加参考文档链接
                                            doc_link = description_cell.find('a')
                                            if doc_link:
                                                link_text = doc_link.text.strip()
                                                link_url = "https://developer.huawei.com/consumer/cn/doc/" + doc_link.get('href', '').replace('https://developer.huawei.com/consumer/cn/doc/', '')
                                                update_info.append(f"\n参考文档：{link_text} {link_url}")
                                            
                                            updates.append("\n".join(update_info))
                            
                            # 2. 查找并解析接口部分
                            interface_title = title.find_next(lambda tag: tag.name in ['h4'] and '接口' in tag.text)
                            if interface_title:
                                interface_table = interface_title.find_next('table')
                                if interface_table:
                                    updates.append("\n【接口更新】")
                                    # 解析接口表格
                                    rows = interface_table.find_all('tr')[1:]
                                    for row in rows:
                                        cols = row.find_all('td')
                                        if len(cols) >= 2:
                                            interface = cols[0].text.strip()
                                            description_cell = cols[1]  # 获取整个单元格
                                            
                                            # 分割描述文本，但保留HTML结构
                                            descriptions = []
                                            for text in description_cell.stripped_strings:
                                                if text.strip():
                                                    descriptions.append(text.strip())
                                            
                                            update_info = [f"【{interface}】"]
                                            
                                            # 先添加更新内容
                                            main_content = descriptions[0] if descriptions else ""  # 第一段是主要内容
                                            for desc in main_content.split('。'):
                                                if desc.strip() and '详情请参见' not in desc:
                                                    update_info.append(f"• {desc.strip()}")
                                            
                                            # 再添加参考文档链接
                                            doc_link = description_cell.find('a')
                                            if doc_link:
                                                link_text = doc_link.text.strip()
                                                link_url = "https://developer.huawei.com/consumer/cn/doc/" + doc_link.get('href', '').replace('https://developer.huawei.com/consumer/cn/doc/', '')
                                                update_info.append(f"\n参考文档：{link_text} {link_url}")
                                            
                                            updates.append("\n".join(update_info))
                            
                            result = {
                                'version': latest_version,
                                'updates': updates,
                                'date': latest_date
                            }
                            print(f"解析结果: {result}")
                            return result
                            break
                    else:
                        print("未找到版本标题")
                else:
                    print("API响应格式不正确")
            
            print("未找到目标内容")
            return None
            
        except Exception as e:
            print(f"发生错误: {str(e)}")
            print(f"错误类型: {type(e)}")
            return None
    
    def calculate_hash(self, content):
        """计算内容的哈希值"""
        return hashlib.md5(str(content).encode('utf-8')).hexdigest()
    
    def send_notification(self, message, msg_type="text"):
        """发送飞书通知"""
        headers = {
            'Content-Type': 'application/json'
        }
        
        if msg_type == "post":
            data = {
                "msg_type": "interactive",
                "card": {
                    "config": {
                        "wide_screen_mode": True
                    },
                    "header": {
                        "template": "blue",
                        "title": {
                            "content": "快应用版本说明更新通知",
                            "tag": "plain_text"
                        }
                    },
                    "elements": [
                        {
                            "tag": "markdown",
                            "content": message
                        },
                        {
                            "tag": "hr"
                        },
                        {
                            "tag": "note",
                            "elements": [
                                {
                                    "tag": "plain_text",
                                    "content": f"监控时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
                                }
                            ]
                        }
                    ]
                }
            }
        else:
            data = {
                "msg_type": "text",
                "content": {
                    "text": message
                }
            }
        
        try:
            response = requests.post(self.webhook_url, json=data, headers=headers)
            response.raise_for_status()
            print("通知发送成功")
        except requests.RequestException as e:
            print(f"发送通知失败: {e}")
    
    def monitor(self):
        """开始监控"""
        print(f"开始监控网页: {self.url}")
        
        try:
            # 获取当前信息并发送启动通知
            retries = 3  # 添加重试机制
            for attempt in range(retries):
                try:
                    current_content = self.get_page_content()
                    if current_content:
                        break
                except Exception as e:
                    if attempt == retries - 1:
                        raise
                    print(f"获取内容失败，{attempt + 1}/{retries} 次重试...")
                    time.sleep(5)
            
            if current_content:
                startup_message = self._format_notification(current_content, is_startup=True)
                self.send_notification(startup_message, msg_type="post")
                self.last_hash = self.calculate_hash(current_content)
                self.last_content = current_content
                # 保存初始数据
                self._update_data(current_content)
            
            while True:
                try:
                    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    content = self.get_page_content()
                    
                    if content:
                        # 比较版本号
                        if content['version'] != self.last_content['version']:
                            message = self._format_notification(content)
                            print(f"[{current_time}] 检测到新版本: {content['version']}")
                            self.send_notification(message, msg_type="post")
                            self.last_hash = self.calculate_hash(content)
                            self.last_content = content
                            # 保存更新的数据
                            self._update_data(content)
                        else:
                            print(f"[{current_time}] 未检测到新版本")
                            # 更新最后检查时间
                            self._update_data(self.last_content)
                    
                    time.sleep(self.check_interval)
                
                except Exception as e:  # 添加错误处理
                    print(f"检查过程中出错: {str(e)}")
                    print("60秒后重试...")
                    time.sleep(60)
            
        except Exception as e:
            print(f"监控过程中出错: {str(e)}")
            error_message = f"🔔 监控服务出错: {str(e)}"
            self.send_notification(error_message)
            time.sleep(60)  # 出错后等待1分钟再重试

    def _is_version_newer(self, new_version, old_version):
        """比较版本号"""
        try:
            # 移除版本号中的 'V' 前缀
            new_version = new_version.replace('V', '').strip()
            old_version = old_version.replace('V', '').strip()
            
            # 将版本号分割为数字列表
            new_parts = [int(x) for x in new_version.split('.')]
            old_parts = [int(x) for x in old_version.split('.')]
            
            return new_parts > old_parts
        except Exception as e:
            print(f"版本号比较出错: {str(e)}")
            return False

    def _format_notification(self, content, is_startup=False):
        """格式化通知消息"""
        if is_startup:
            return (
                "🔔 版本更新监控服务已启动\n"
                "|  类型  |  内容  |\n"
                "|:------:|:------|\n"
                f"|  版本  | `{content['version']}` |\n"
                f"|  日期  | `{content['date']}` |\n"
                "📋 更新内容\n" + 
                "\n\n".join([
                    content.replace('【组件更新】', '🔧 组件更新')
                           .replace('【接口更新】', '\n🔌 接口更新')
                           .replace('【', '📌 ')
                           .replace('】\n', '】')
                           .replace('\n\n参考文档：', '\n> 📚 ')
                           .replace('• ', '◦ ')
                    for content in content['updates']
                ]) +
                f"\n---\n⏱️ 监控间隔：`{self.check_interval}秒`"
            )
        else:
            return (
                "🚨 检测到版本更新！\n"
                "|  类型  |  内容  |\n"
                "|:------:|:------|\n"
                f"|  版本  | `{content['version']}` |\n"
                f"|  日期  | `{content['date']}` |\n"
                "📋 更新内容\n" + 
                "\n\n".join([
                    content.replace('【组件更新】', '🔧 组件更新')
                           .replace('【接口更新】', '\n🔌 接口更新')
                           .replace('【', '📌 ')
                           .replace('】', '')
                           .replace('\n\n参考文档：', '\n> 📚 ')
                           .replace('• ', '◦ ')
                    for content in content['updates']
                ]) +
                f"\n---\n🔗 [查看详情]({self.url})"
            )

# 使用示例
if __name__ == "__main__":
    target_url = "https://developer.huawei.com/consumer/cn/doc/quickApp-Guides/quickapp-version-updates-0000001079803874"
    webhook_url = "https://open.feishu.cn/open-apis/bot/v2/hook/1a11a0f0-b246-423c-909f-5ebbbbf4e2f4"
    
    # 创建监控器（每5分钟检查一次）
    monitor = VersionMonitor(target_url, webhook_url, 300)
    
    # 开始监控
    monitor.monitor() 
    
