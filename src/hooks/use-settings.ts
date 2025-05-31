import type { Settings, Language } from '@/types';
import useLocalStorage from './use-local-storage';
import { defaultLang } from '@/locales';

const SETTINGS_KEY = 'amma-expense-pal-settings';

const initialSettings: Settings = {
  language: defaultLang,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(SETTINGS_KEY, initialSettings);

  const updateLanguage = (language: Language) => {
    setSettings(prevSettings => ({ ...prevSettings, language }));
  };

  return {
    settings,
    updateLanguage,
  };
}
