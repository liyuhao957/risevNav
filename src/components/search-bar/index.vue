<template>
  <div class="search-bar" :data-theme="$store.state.theme">
    <div style="display: flex; align-items: center; justify-content: center">
      <img src="@/assets/images/risev1.png" style="width: 400px" />
    </div>
    <div class="main-container">
      <div :class="isInputActive ? 'input-box input-box-active' : 'input-box'">
        <div class="search-left">
          <el-select v-model="searchTypeIndex" placeholder="请选择搜索引擎" style="width: 80px">
            <el-option v-for="(item, index) in searchType" :key="item.label" :label="item.label"
              :value="index"></el-option>
          </el-select>
        </div>
        <input class="input" @focus="handleFocus" @blur="handleBlur" v-model="keyword" type="text"
          :placeholder="searchType[searchTypeIndex]['placeholder']" @keydown.enter="search" @input="handleChange" />
        <div class="send-item">
          <el-icon class="icon" @click="search">
            <Promotion />
          </el-icon>
        </div>
        <div v-show="isInputActive"
          :class="isInputActive ? 'search-like-content search-like-content-active' : 'search-like-content'">
          <el-scrollbar max-height="400px">
            <div class="item" 
                 v-for="item in suggestions" 
                 :key="item" 
                 @click.stop="handleSuggestionClick(item, $event)"
                 @mousedown.prevent>
              {{ item }}
            </div>
          </el-scrollbar>
        </div>
      </div>
      <!-- <div class="search-type">
                <div class="type" :class="{ active: searchTypeIndex == index }" @click="changeSearchType(index)"
                    v-for="(item, index) in searchType" :key="item.label">
                    {{ item.label }}
                </div>
            </div> -->
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { onMounted, ref, nextTick } from "vue";
import { ElMessage } from 'element-plus';

const store = useStore();
const isInputActive = ref(false);
const suggestions = ref([]);
const keyword = ref("");
const searchType = [
  {
    label: "Bing",
    placeholder: "微软Bing搜索",
    value: "https://cn.bing.com/search?q=",
  },
  {
    label: "百度",
    placeholder: "百度一下",
    value: "https://www.baidu.com/s?wd=",
  },
];
const searchTypeIndex = ref(0);

// 获取百度搜索建议
const getBaiduSuggestions = async (keyword) => {
  // 空关键词直接返回空数组
  if (!keyword.trim()) {
    return [];
  }
  
  try {
    const timestamp = new Date().getTime();
    const script = document.createElement('script');
    const callbackName = `baiduSuggestionCallback_${timestamp}`;
    
    // 清理之前可能存在的同名回调和script标签
    if (window[callbackName]) {
      delete window[callbackName];
    }
    const oldScript = document.querySelector(`script[data-callback="${callbackName}"]`);
    if (oldScript) {
      document.body.removeChild(oldScript);
    }
    
    const promise = new Promise((resolve, reject) => {
      // 设置更长的超时时间
      const timeoutId = setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          resolve([]); // 超时时返回空数组而不是报错
        }
      }, 10000);
      
      window[callbackName] = (data) => {
        clearTimeout(timeoutId);
        if (data && data.s) {
          resolve(data.s);
        } else {
          resolve([]); // 无效数据时返回空数组
        }
        // 清理回调和script标签
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    });
    
    script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(keyword.trim())}&cb=${callbackName}`;
    script.setAttribute('data-callback', callbackName);
    document.body.appendChild(script);
    
    return await promise;
  } catch (error) {
    console.warn('搜索建议请求异常:', error);
    return []; // 出错时返回空数组
  }
};

let currentRequest = null;

function handleChange() {
  if (keyword.value && keyword.value.trim()) {
    if (window.timer) {
      clearTimeout(window.timer);
    }
    window.timer = setTimeout(async () => {
      try {
        // 取消之前的请求
        if (currentRequest) {
          const oldCallbackName = currentRequest.callbackName;
          if (window[oldCallbackName]) {
            delete window[oldCallbackName];
          }
          const oldScript = document.querySelector(`script[data-callback="${oldCallbackName}"]`);
          if (oldScript) {
            document.body.removeChild(oldScript);
          }
        }
        
        // 创建新请求
        const timestamp = new Date().getTime();
        const callbackName = `baiduSuggestionCallback_${timestamp}`;
        currentRequest = { callbackName };
        
        const results = await getBaiduSuggestions(keyword.value);
        if (keyword.value.trim()) { // 再次检查关键词是否有效
          suggestions.value = results;
        }
      } catch (error) {
        console.warn('搜索建议获取失败:', error);
        suggestions.value = [];
      } finally {
        currentRequest = null;
      }
    }, 300);
  } else {
    suggestions.value = [];
  }
}

const changeSearchType = (index) => {
  searchTypeIndex.value = index;
};

const search = () => {
  if (!keyword.value?.trim()) return;
  const currentEngine = searchType[searchTypeIndex.value];
  if (!currentEngine) {
    ElMessage.error('搜索引擎配置错误');
    return;
  }
  const searchUrl = `${currentEngine.value}${encodeURIComponent(keyword.value.trim())}`;
  openUrl(searchUrl);
}

function handleFocus() {
  isInputActive.value = true;
}
function ShowDiv(strurls) {
  var urls = strurls["s"];
  console.log(urls);
}

// 处理 blur 事件
function handleBlur() {
  isInputActive.value = false;
}

const getSuggestion = async () => {
  if (!keyword.value) return;
  const data = await getBingSuggestion(keyword.value);
  if (data && data.s) {
    suggestionList.value = data.s;
  }
}

const openUrl = (url) => {
  window.open(url, '_blank');
}

const getBingSuggestion = async (keyword) => {
  try {
    const response = await fetch(
      `https://api.bing.com/qsonhs.aspx?type=cb&q=${keyword}&cb=window.bing.sug`
    );
    const text = await response.text();
    const json = JSON.parse(text.match(/\{.*\}/)[0]);
    return json.AS;
  } catch (error) {
    ElMessage({
      message: '获取搜索建议失败',
      type: 'error'
    });
    return null;
  }
}

const handleSuggestionClick = async (suggestion, event) => {
  // 阻止事件冒泡
  event?.preventDefault();
  event?.stopPropagation();
  
  // 更新关键词
  keyword.value = suggestion;
  isInputActive.value = false;
  
  // 确保在状态更新后执行搜索
  await nextTick();
  
  // 构建搜索URL
  const currentEngine = searchType[searchTypeIndex.value];
  if (!currentEngine) {
    ElMessage.error('搜索引擎配置错误');
    return;
  }
  
  // 使用window.open在新标签页打开
  const searchUrl = `${currentEngine.value}${encodeURIComponent(suggestion.trim())}`;
  window.open(searchUrl, '_blank');
}

onMounted(() => { });
</script>

<style lang="less" scoped>
.search-bar {
  width: 72vw;
  margin: 0 auto;

  .main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.input-box {
  position: relative;
  width: 60%;
  height: 46px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  border-radius: 23px;
  background-color: var(--input-bg-color) !important;
  color: #333 !important;
  margin-top: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 6px 16px 1px #6468e729;
  border-radius: 10px;
  padding: 0 5px 0 0;

  .input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    // color: var(--input-color) !important;
    color: #333;
    // &::placeholder {
    //     color: var(--input-placeholder-color) !important;
    // }
  }

  .send-item {
    color: #fff;
    width: 32px;
    height: 32px;
    background: #6965ea;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    cursor: pointer;

    .icon {
      user-select: none;
      font-size: 18px !important;
      // color: var(--input-icon-color) !important;
    }
  }


  .search-like-content {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 100.4%;
    height: 400px;
    background-color: #fff;
    box-shadow: var(--el-box-shadow-lighter);
    z-index: 99999;

    .item {
      height: 35px;
      line-height: 35px;
      padding: 0 10px;
      color: var(--sub-text-color);

      &:hover {
        cursor: pointer;
        color: #409eff;
      }

      &:first-of-type {
        margin-top: 10px;
      }
    }
  }

  .search-like-content-active {
    border: 1px solid #6965ea;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top: none;
  }
}

.search-type {
  width: 60%;
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 0 30px;

  .type {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 3px;
    color: var(--tag-text-color) !important;
    user-select: none;
    cursor: pointer;

    &:hover {
      background-color: var(--tag-bg-color) !important;
      color: rgb(96, 98, 102) !important;
    }

    &.active {
      background-color: var(--tag-bg-color) !important;
      color: rgb(96, 98, 102) !important;
    }

    &+.type {
      margin-left: 20px;
    }
  }
}

.input-box-active {
  border: 1px solid #6965ea;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.search-left {
  margin-right: 10px;
}

.search-left :deep(.el-select__wrapper) {
  box-shadow: none !important;
}

.search-left :deep(.el-select__selected-item) {
  color: var(--text-color) !important;
}

.search-left :deep(.el-select__icon) {
  color: var(--text-color) !important;
}
</style>
