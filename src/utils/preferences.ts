import { useEffect, useState } from 'react';

export class Preferences {
  static darkMode = (): boolean => {
    return Preferences.getString('darkMode') === 'true';
  };

  static setDarkMode = (flag: boolean) => {
    Preferences.setString('darkMode', flag ? 'true' : 'false');
  };

  static getString(key: string) {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem(key);
  }

  static setString(key: string, value: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, value);
  }

  static remove(key: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(key);
  }
}

// =====================================================================

export const usePreferences = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(Preferences.darkMode());
  }, []);

  useEffect(() => {
    Preferences.setDarkMode(darkMode);
  }, [darkMode]);

  return { darkMode, setDarkMode };
};
