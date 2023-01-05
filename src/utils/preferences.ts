export class Preferences {
  static darkMode = (): boolean => {
    return false;
    // const pref = Preferences.getString('darkMode');

    // // darkMode is the default, so check both states
    // return !pref || pref === 'true';
  };

  static setDarkMode = (flag: boolean) => {
    Preferences.setString('darkMode', flag ? 'true' : 'false');
  };

  static getString(key: string) {
    if (typeof window === 'undefined') {
      console.log('Preferences getString: no window');
      return '';
    }

    return window.localStorage.getItem(key);
  }

  static setString(key: string, value: string) {
    if (typeof window === 'undefined') {
      console.log('Preferences setString: no window');
      return;
    }

    window.localStorage.setItem(key, value);
  }

  static remove(key: string) {
    if (typeof window === 'undefined') {
      console.log('Preferences remove: no window');
      return;
    }

    window.localStorage.removeItem(key);
  }
}
