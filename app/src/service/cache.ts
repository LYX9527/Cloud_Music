const sessionCache = {
    set(key:null|string, value:null|string) {
        if (!sessionStorage) {
            return
        }
        if (key != null && value != null) {
            sessionStorage.setItem(key, value)
        }
    },
    get(key:null|string) {
        if (!sessionStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return sessionStorage.getItem(key)
    },
    setJSON(key:null|string, jsonValue:{[key:string]:any}) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    },
    getJSON(key:null|string) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    },
    remove(key:string) {
        sessionStorage.removeItem(key);
    }
}
const localCache = {
    set(key:null|string, value:null|string) {
        if (!localStorage) {
            return
        }
        if (key != null && value != null) {
            localStorage.setItem(key, value)
        }
    },
    get(key:null|string) {
        if (!localStorage) {
            return null
        }
        if (key == null) {
            return null
        }
        return localStorage.getItem(key)
    },
    setJSON(key:null|string, jsonValue:{[key:string]:any}) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    },
    getJSON(key:null|string) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    },
    remove(key:string) {
        localStorage.removeItem(key);
    }
}

export default {
    /**
     * 会话级缓存
     */
    session: sessionCache,
    /**
     * 本地缓存
     */
    local: localCache
}
  