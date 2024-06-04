import { useCallback } from 'react'
import useProvider from '../store/useProvider'
import vi from './translations/vi'
import en from './translations/en'

const translations = { vi, en }

const useTranslate = () => {
    const { lang } = useProvider()

    const toCapitalize = useCallback(function() { 
        return this.split(' ').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')
    }, [])

    const toUpperFirst = useCallback(function() {
        return this[0].toUpperCase() + this.substr(1)
    }, [])

    const t = useCallback(text => {
        const translated = translations[lang][text] || text
        translated.__proto__.toCapitalize = toCapitalize
        translated.__proto__.toUpperFirst = toUpperFirst

        return translated
    }, [lang])

    return t
}

export default useTranslate