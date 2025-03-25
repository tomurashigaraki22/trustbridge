"use client"

import { createContext, useContext, useEffect } from 'react'

const TranslateContext = createContext({})

export function TranslateProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,zh,ja,ko,ru',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )
    }

    const addScript = () => {
      const script = document.createElement('script')
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }

    window.googleTranslateElementInit = googleTranslateElementInit
    addScript()
  }, [])

  return <>{children}</>
}

export const useTranslate = () => useContext(TranslateContext)