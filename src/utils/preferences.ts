export class Preferences {
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
