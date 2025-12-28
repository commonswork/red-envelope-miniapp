import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

// 获取浏览器语言设置
const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage
  if (lang.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

// 从localStorage获取语言设置
const getStoredLanguage = () => {
  return localStorage.getItem('app-language')
}

// 设置默认语言
const defaultLanguage = getStoredLanguage() || getBrowserLanguage()

const i18n = createI18n({
  legacy: false,
  locale: defaultLanguage,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n