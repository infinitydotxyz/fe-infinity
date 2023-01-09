export class Preferences {
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
