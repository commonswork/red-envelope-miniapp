# 红包 Mini App

一个基于 Telegram Mini App 的红包应用，支持用户信息展示、群组分享和富媒体消息功能。

## ✨ 核心功能

- 👤 **用户信息展示** - 显示 Telegram 用户的详细信息和头像
- 📤 **智能分享系统** - 支持富媒体卡片和文本链接两种分享方式
- 🎨 **多种分享模板** - 简单分享、邀请朋友、新功能通知等预设模板
- 🔍 **群组上下文识别** - 通过 `chat_instance` 追踪应用来源群组
- 🌐 **国际化支持** - 内置中英文语言切换
- 📱 **响应式设计** - 适配各种设备尺寸

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 配置 Telegram Bot

在 @BotFather 中配置你的机器人：

1. 创建或选择现有 bot
2. 设置 Mini App：
   ```
   /newapp
   选择你的 bot
   填写应用信息
   设置 Web App URL
   ```
3. （可选）启用 Inline Mode 以支持富媒体分享：
   ```
   /setinline
   选择你的 bot
   输入 placeholder 文本
   ```

## 📁 项目结构

```
src/
├── components/
│   ├── TelegramInfo.vue      # 用户信息展示组件
│   └── ShareButton.vue       # 分享功能组件
├── composables/
│   └── useTelegram.js        # Telegram SDK 封装
├── locales/
│   ├── en-US.json           # 英文语言包
│   ├── zh-CN.json           # 中文语言包
│   └── i18n.js              # 国际化配置
├── utils/
│   ├── api.js               # API 工具函数
│   └── urlParser.js         # URL 参数解析
├── views/
│   └── Home.vue             # 主页面
├── App.vue                  # 根组件
└── main.js                  # 应用入口
```

## 🔑 核心功能详解

### useTelegram Composable

提供完整的 Telegram Web App SDK 封装：

```javascript
const {
  // 基础信息
  tg,              // Telegram WebApp 实例
  user,            // 当前用户信息
  initDataUnsafe,  // 初始化数据
  isReady,         // SDK 就绪状态
  
  // 分享功能
  shareToChat,        // 基础分享到聊天
  shareDirectLink,    // 分享直接链接
  shareRichMessage,   // 分享富媒体消息
  createShareTemplate, // 创建分享模板
  
  // 群组识别
  getChatInstance,    // 获取群组上下文 ID
  getStartParam,      // 获取启动参数
  
  // UI 控制
  showMainButton,
  showAlert,
  close,
} = useTelegram();
```

### 分享功能

#### 1. 富媒体分享（推荐）
```javascript
shareRichMessage({
  imageUrl: 'https://example.com/preview.jpg',
  title: '🚀 Telegram Mini App',
  description: '快来体验这个超棒的应用！',
  buttonText: '打开 Mini App',
  miniAppUrl: 'https://t.me/YourBot/app'
});
```

#### 2. 文本链接分享
```javascript
shareDirectLink('https://t.me/YourBot/app', {
  emoji: '🚀',
  title: 'Mini App 分享',
  description: '快来体验这个超棒的应用！',
  useMarkdown: true,
  hashtags: ['MiniApp', 'Telegram']
});
```

#### 3. 模板分享
```javascript
// 使用预设模板
const template = createShareTemplate('invitation', {
  title: '邀请你体验',
  description: '一起来探索这个有趣的应用吧！'
});
shareDirectLink(url, template);
```

### 群组上下文识别

```javascript
// 检测应用来源
const chatInstance = getChatInstance();
if (chatInstance) {
  console.log('从群组打开，实例ID:', chatInstance);
  // 可以根据不同群组提供不同功能
}

// 获取启动参数
const startParam = getStartParam();
if (startParam) {
  console.log('启动参数:', startParam);
  // 处理深度链接参数
}
```

## 🎨 UI 组件

### TelegramInfo 组件
- 显示用户头像、姓名、用户名
- 展示群组上下文信息
- 加载状态和错误处理

### ShareButton 组件
- 富媒体分享按钮
- 文本链接分享按钮
- 多种预设分享模板
- 功能说明和使用提示

## 🌐 国际化

项目支持中英文切换：

```javascript
// 在组件中使用
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 使用翻译
{{ t('welcome.title') }}
```

语言包位置：
- `src/locales/zh-CN.json` - 中文
- `src/locales/en-US.json` - 英文

## 🔧 技术栈

- **前端框架**: Vue 3 + Composition API
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **国际化**: Vue I18n
- **Telegram**: Web Apps SDK

## 📊 数据结构

### 用户信息 (initDataUnsafe)
```javascript
{
  user: {
    id: 123456789,
    first_name: "张三",
    last_name: "李四",
    username: "zhangsan",
    language_code: "zh",
    photo_url: "https://..."
  },
  chat_type: "supergroup",
  chat_instance: "abc123xyz",  // 群组唯一标识
  start_param: "custom_param", // 启动参数
  auth_date: 1234567890,
  hash: "..."
}
```

## 🎯 使用场景

1. **红包应用** - 在群组中发送和领取红包
2. **社交分享** - 分享内容到不同的 Telegram 群组
3. **用户识别** - 基于群组上下文提供个性化功能
4. **病毒式传播** - 通过分享功能扩大用户群体

## ⚠️ 注意事项

### 富媒体分享要求
- 需要机器人支持 Inline Query
- 必须在 @BotFather 中启用 `/setinline`
- 需要编写后端处理 `inline_query` 事件

### 隐私保护
- `chat_instance` 是匿名标识符
- 无法获取群组名称或成员信息
- 仅用于区分不同群组上下文

### 开发建议
- 优先使用文本链接分享（无需额外开发）
- 富媒体分享需要后端支持
- 测试时注意 Telegram 环境和浏览器环境的差异

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📝 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发提示**: 这是一个 Telegram Mini App 项目，需要在 Telegram 环境中运行才能获取完整功能。在浏览器中开发时，某些 Telegram 特有功能可能无法正常工作。
