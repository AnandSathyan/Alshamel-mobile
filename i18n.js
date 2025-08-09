import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './assets/locales/en.json';
import ar from './assets/locales/ar.json';

const LANG_KEY = 'APP_LANGUAGE';
const setAppDirection = async (lang) => {
    const isRTL = lang === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      await I18nManager.forceRTL(isRTL);
      // Restart the app to apply layout direction
      RNLocalize.reload(); // Optional: You might want to implement a better restart strategy
    }
  };
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANG_KEY);
    //   ('[i18n] Stored language:', storedLanguage);

      if (storedLanguage) {
        callback(storedLanguage);
      } else {
        const bestLang = RNLocalize.findBestAvailableLanguage(['en', 'ar']);
        // ('[i18n] Best available language from device:', bestLang);
        const selectedLang = storedLanguage || bestLang?.languageTag || 'en';
        await setAppDirection(selectedLang);
        callback(bestLang?.languageTag || 'en');
      }
    } catch (error) {
      console.error('[i18n] Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {
    // ('[i18n] Language detector initialized');
  },
  cacheUserLanguage: async (lang) => {
    try {
      await AsyncStorage.setItem(LANG_KEY, lang);
    //   ('[i18n] Cached language:', lang);
    } catch (error) {
      console.error('[i18n] Error caching language:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
    debug: true, // Enables i18next internal logging (optional)
  }, (err, t) => {
    if (err) {
      console.error('[i18n] Failed to initialize i18next:', err);
    } else {
    //   ('[i18n] i18next initialized successfully');
    }
  });

export default i18n;
