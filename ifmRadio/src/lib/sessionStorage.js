
//会话存储
class sessionStorage {
    /**
     * 添加数据
     * @param {String} key 
     * @param {String} value 
     */
    static setItem(key, value) {
        window.sessionStorage.setItem(key, value);
    }
    /**
     * 获取数据
     * @param {String} key 
     */
    static getItem(key) {
        const data = window.sessionStorage.getItem(key);
        return data
    }
    /**
     * 删除指定key数据
     * @param {String} key 
     */
    static removeItem(key) {
        window.sessionStorage.removeItem(key);
    }
    /**
     * 是否存在key
     * @param {String} key 
     */
    static existKey(key) {
        const data = window.sessionStorage.getItem(key);
        if (data) {
            return true
        } else {
            return false
        }
    }
}