<template>
  <div class="debug-info" v-if="showDebug">
    <button @click="toggleDebug" class="debug-toggle">
      {{ expanded ? '隐藏调试信息' : '显示调试信息' }}
    </button>
    
    <div v-if="expanded" class="debug-content">
      <h4>🔍 调试信息</h4>
      
      <div class="debug-section">
        <h5>Telegram WebApp 状态</h5>
        <div class="debug-item">
          <span class="label">SDK 已加载:</span>
          <span :class="sdkLoaded ? 'success' : 'error'">
            {{ sdkLoaded ? '✅ 是' : '❌ 否' }}
          </span>
        </div>
        <div class="debug-item" v-if="tg">
          <span class="label">版本:</span>
          <span>{{ tg.version }}</span>
        </div>
        <div class="debug-item" v-if="tg">
          <span class="label">平台:</span>
          <span>{{ tg.platform }}</span>
        </div>
        <div class="debug-item">
          <span class="label">switchInlineQuery 可用:</span>
          <span :class="hasSwitchInlineQuery ? 'success' : 'error'">
            {{ hasSwitchInlineQuery ? '✅ 是' : '❌ 否' }}
          </span>
        </div>
      </div>

      <div class="debug-section">
        <h5>用户信息</h5>
        <div class="debug-item">
          <span class="label">用户已登录:</span>
          <span :class="user ? 'success' : 'error'">
            {{ user ? '✅ 是' : '❌ 否' }}
          </span>
        </div>
        <div class="debug-item" v-if="user">
          <span class="label">用户 ID:</span>
          <span>{{ user.id }}</span>
        </div>
      </div>

      <div class="debug-section">
        <h5>测试功能</h5>
        <button @click="testSwitchInlineQuery" class="test-button">
          测试 switchInlineQuery
        </button>
        <button @click="testShowAlert" class="test-button">
          测试 showAlert
        </button>
      </div>

      <div class="debug-section">
        <h5>完整 WebApp 对象</h5>
        <pre class="debug-json">{{ tgInfo }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTelegram } from '../composables/useTelegram.js';

const { tg, user, showAlert } = useTelegram();

const showDebug = ref(true);
const expanded = ref(false);

const sdkLoaded = computed(() => !!window.Telegram?.WebApp);
const hasSwitchInlineQuery = computed(() => {
  return tg.value && typeof tg.value.switchInlineQuery === 'function';
});

const tgInfo = computed(() => {
  if (!tg.value) return 'Telegram WebApp 未加载';
  
  return JSON.stringify({
    version: tg.value.version,
    platform: tg.value.platform,
    colorScheme: tg.value.colorScheme,
    isExpanded: tg.value.isExpanded,
    viewportHeight: tg.value.viewportHeight,
    viewportStableHeight: tg.value.viewportStableHeight,
    headerColor: tg.value.headerColor,
    backgroundColor: tg.value.backgroundColor,
    availableMethods: Object.keys(tg.value).filter(key => typeof tg.value[key] === 'function')
  }, null, 2);
});

const toggleDebug = () => {
  expanded.value = !expanded.value;
};

const testSwitchInlineQuery = () => {
  console.log('测试 switchInlineQuery');
  
  if (!tg.value) {
    alert('Telegram WebApp 未初始化');
    return;
  }
  
  if (typeof tg.value.switchInlineQuery !== 'function') {
    alert('switchInlineQuery 方法不存在！\n\n可能原因：\n1. Bot 未启用 Inline Mode\n2. Telegram 版本过旧\n3. 不在 Telegram 环境中运行');
    return;
  }
  
  try {
    tg.value.switchInlineQuery('测试消息', ['users', 'groups']);
    console.log('switchInlineQuery 调用成功');
  } catch (error) {
    console.error('switchInlineQuery 调用失败:', error);
    alert('调用失败: ' + error.message);
  }
};

const testShowAlert = () => {
  if (showAlert) {
    showAlert('这是一个测试弹窗！');
  } else {
    alert('showAlert 方法不可用');
  }
};

onMounted(() => {
  console.log('调试组件已挂载');
  console.log('window.Telegram:', window.Telegram);
  console.log('window.Telegram.WebApp:', window.Telegram?.WebApp);
});
</script>

<style scoped>
.debug-info {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.debug-toggle {
  background: #ff9800;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.debug-toggle:hover {
  background: #f57c00;
}

.debug-content {
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 400px;
  max-width: calc(100vw - 40px);
  max-height: 70vh;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

h4 {
  margin: 0 0 15px 0;
  color: #333;
}

h5 {
  margin: 15px 0 10px 0;
  color: #555;
  font-size: 0.95em;
}

.debug-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.debug-section:last-child {
  border-bottom: none;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.9em;
}

.debug-item .label {
  color: #666;
  font-weight: 500;
}

.debug-item .success {
  color: #4caf50;
  font-weight: 600;
}

.debug-item .error {
  color: #f44336;
  font-weight: 600;
}

.test-button {
  background: #2196f3;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  margin-right: 10px;
  margin-bottom: 10px;
}

.test-button:hover {
  background: #1976d2;
}

.debug-json {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.8em;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .debug-content {
    width: calc(100vw - 40px);
    right: 20px;
  }
}
</style>
