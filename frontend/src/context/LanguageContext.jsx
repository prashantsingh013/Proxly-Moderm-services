import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../translations/en';
import { hi } from '../translations/hi';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('skillbridge_lang') || 'en');

  const setAppLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('skillbridge_lang', lang);
  };

  const dictionary = language === 'hi' ? hi : en;

  // Translation helper: t('hero.titlePrefix')
  const t = (path) => {
    const keys = path.split('.');
    let result = dictionary;
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setAppLanguage, t, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
