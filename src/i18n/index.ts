import { createI18n } from 'vue-i18n'
import zhCn from './localization/zhCn'
import en from './localization/en'

const messages = {
    zh: {
        ...zhCn,
    },
    en: {
        ...en,
    },
}

const getCurrentLanguage = () => {
    return navigator.language
}

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: getCurrentLanguage(),
    messages: messages
})

export default i18n
