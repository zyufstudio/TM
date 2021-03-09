class Http {
    static xmlhttpRequest(config) {
        GM_xmlhttpRequest(config)
    }
    static get(url, config) {
        const that = this
        return new Promise((resolve, reject) => {
            const defaultConfig = {
                method: "GET",
                url,
                responseType: "json",
                onload: (resData) => {
                    const response = {
                        data: resData.response
                    }
                    resolve(response);
                },
                ontimeout: (timeout) => {
                    toastr.error("Download timeout!!!")
                    setTimeout(() => {
                        toastr.clear()
                    }, 5000);
                    reject(timeout);
                },
                onerror: (e) => {
                    toastr.error("Download error! "+e.error)
                    setTimeout(() => {
                        toastr.clear()
                    }, 5000);
                    reject(e);
                }
            }
            const newConfig = Object.assign(defaultConfig, config)
            that.xmlhttpRequest(newConfig)
        })
    }
    static all(iterable) {
        return Promise.all(iterable)
    }
}
export default Http