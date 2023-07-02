import { isNull } from '@/utils/utils';
// import { allEnum } from '@/apis/index';

class DB {
  constructor() {}

  getLocal(key) {
    return !isNull(localStorage.getItem(key)) && JSON.parse(localStorage.getItem(key));
  }

  setLocal(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  deleteLocal(key) {
    localStorage.removeItem(key);
  }

  clearLocal() {
    localStorage.clear();
  }

  getSession(key) {
    return !isNull(sessionStorage.getItem(key)) && JSON.parse(sessionStorage.getItem(key));
  }

  setSession(key, val) {
    sessionStorage.setItem(key, JSON.stringify(val));
  }

  deleteSession(key) {
    sessionStorage.removeItem(key);
  }

  clearSession() {
    sessionStorage.clear();
  }
}

export default DB;
