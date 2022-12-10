export class Preferences {
  static darkMode = (): boolean => {
    return Preferences.getString('darkMode') === 'true';
  };

  static setDarkMode = (flag: boolean) => {
    Preferences.setString('darkMode', flag ? 'true' : 'false');
  };

  static getString(key: string) {
    return localStorage.getItem(key);
  }

  static setString(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  static remove(key: string) {
    window.localStorage.removeItem(key);
  }
}
