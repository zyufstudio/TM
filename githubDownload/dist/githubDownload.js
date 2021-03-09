// ==UserScript==
// @name         github下载
// @version      1.1.0
// @namespace    https://github.com/zyufstudio/TM/tree/master/githubDownload
// @description  从github下载任意文件或文件夹
// @icon         data:image/png;base64,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
// @author       Johnny Li
// @license      MIT
// @match        https://github.com/*
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @connect      api.github.com
// @connect      github.com
// @resource     toastrcss https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@1.9.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.js
// ==/UserScript==


//文件使用Rollup+Gulp编译而成，如需查看源码请转到GitHub项目。

(function () {
    'use strict';

    /**
     * 日期格式化
     * @param {Date} date - 日期
     * @param {string} formatStr - 格式化模板
     * @returns {string} 格式化日期后的字符串
     * @example
     * DateFormat(new Date(),"yyyy-MM-dd")  output "2020-03-23"
     * @example
     * DateFormat(new Date(),"yyyy/MM/dd hh:mm:ss")  output "2020/03/23 10:30:05"
     */
    function DateFormat(date, formatStr) {
        const o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(formatStr)) {
                formatStr = formatStr.replace(
                    RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return formatStr;
    }
    /**
     * 判断是否为空或undefined
     * @param {Any} input 
     */
    function IsEmpty(input){
        let is=false;
        if(input=="" || input==null || typeof(input)==="undefined"){
            is=true;
        }
        return is
    }

    class Http {
        static xmlhttpRequest(config) {
            GM_xmlhttpRequest(config);
        }
        static get(url, config) {
            const that = this;
            return new Promise((resolve, reject) => {
                const defaultConfig = {
                    method: "GET",
                    url,
                    responseType: "json",
                    onload: (resData) => {
                        const response = {
                            data: resData.response
                        };
                        resolve(response);
                    },
                    ontimeout: (timeout) => {
                        toastr.error("Download timeout!!!");
                        setTimeout(() => {
                            toastr.clear();
                        }, 5000);
                        reject(timeout);
                    },
                    onerror: (e) => {
                        toastr.error("Download error! "+e.error);
                        setTimeout(() => {
                            toastr.clear();
                        }, 5000);
                        reject(e);
                    }
                };
                const newConfig = Object.assign(defaultConfig, config);
                that.xmlhttpRequest(newConfig);
            })
        }
        static all(iterable) {
            return Promise.all(iterable)
        }
    }

    //DownGit的代码来源于：https://github.com/MinhasKamal/DownGit/blob/master/app/home/down-git.js
    var DownGit = function () {
        var $http = Http;
        var repoInfo = {};

        var parseInfo = function (parameters) {
            var repoPath = new URL(parameters.url).pathname;
            var splitPath = repoPath.split("/");
            var info = {};

            info.author = splitPath[1];
            info.repository = splitPath[2];
            info.branch = splitPath[4];

            info.rootName = splitPath[splitPath.length - 1];
            if (!!splitPath[4]) {
                info.resPath = repoPath.substring(
                    repoPath.indexOf(splitPath[4]) + splitPath[4].length + 1
                );
            }
            info.urlPrefix = "https://api.github.com/repos/" +
                info.author + "/" + info.repository + "/contents/";
            info.urlPostfix = "?ref=" + info.branch;

            if (!parameters.fileName || parameters.fileName == "") {
                info.downloadFileName = info.rootName;
            } else {
                info.downloadFileName = parameters.fileName;
            }

            if (parameters.rootDirectory == "false") {
                info.rootDirectoryName = "";

            } else if (!parameters.rootDirectory || parameters.rootDirectory == "" ||
                parameters.rootDirectory == "true") {
                info.rootDirectoryName = info.rootName + "/";

            } else {
                info.rootDirectoryName = parameters.rootDirectory + "/";
            }

            return info;
        };

        var downloadDir = function (progress, toastrEl) {
            progress.isProcessing.val = true;

            var dirPaths = [];
            var files = [];
            var requestedPromises = [];

            dirPaths.push(repoInfo.resPath);
            mapFileAndDirectory(dirPaths, files, requestedPromises, progress, toastrEl);
        };

        var mapFileAndDirectory = function (dirPaths, files, requestedPromises, progress, toastrEl) {
            $http.get(repoInfo.urlPrefix + dirPaths.pop() + repoInfo.urlPostfix).then(function (response) {
                for (var i = response.data.length - 1; i >= 0; i--) {
                    if (response.data[i].type == "dir") {
                        dirPaths.push(response.data[i].path);

                    } else {
                        if (response.data[i].download_url) {
                            getFile(response.data[i].path,
                                response.data[i].download_url,
                                files, requestedPromises, progress,
                                toastrEl
                            );
                        } else {
                            console.log(response.data[i]);
                        }
                    }
                }

                if (dirPaths.length <= 0) {
                    downloadFiles(files, requestedPromises, progress);
                } else {
                    mapFileAndDirectory(dirPaths, files, requestedPromises, progress, toastrEl);
                }
            })
            .catch(function(error){
                console.log(error);
            });
        };

        var downloadFiles = function (files, requestedPromises, progress) {
            var zip = new JSZip();
            $http.all(requestedPromises).then(function (data) {
                for (var i = files.length - 1; i >= 0; i--) {
                    zip.file(
                        repoInfo.rootDirectoryName + files[i].path.substring(decodeURI(repoInfo.resPath).length + 1),
                        files[i].data
                    );
                }
                progress.isProcessing.val = false;
                zip.generateAsync({
                    type: "blob"
                }).then(function (content) {
                    saveAs(content, repoInfo.downloadFileName + ".zip");
                });
            });
        };
        var toastrUpdate = function (downloadedFiles, totalFiles, toastrEl) {
            toastrEl.text("Downloaded " + downloadedFiles + " of " + totalFiles + " files");
            if (downloadedFiles == totalFiles) {
                setTimeout(() => {
                    toastr.clear(toastrEl);
                }, 3000);
            }
        };
        var getFile = function (path, url, files, requestedPromises, progress, toastrEl) {
            var promise = $http.get(url, {
                    responseType: "arraybuffer"
                })
                .then(function (file) {
                    files.push({
                        path: path,
                        data: file.data
                    });
                    progress.downloadedFiles.val = files.length;
                    toastrUpdate(progress.downloadedFiles.val, progress.totalFiles.val, toastrEl);
                })
                .catch(function (error) {
                    console.log(error);
                });

            requestedPromises.push(promise);
            progress.totalFiles.val = requestedPromises.length;
        };

        var downloadFile = function (url, progress, toastrEl, isRootDir) {
            progress.isProcessing.val = true;
            progress.downloadedFiles.val = 0;
            progress.totalFiles.val = 1;
            toastrUpdate(progress.downloadedFiles.val, progress.totalFiles.val, toastrEl);
            if (!IsEmpty(isRootDir) && isRootDir) {
                $http.get(url, {
                        responseType: "blob"
                    })
                    .then(function (file) {
                        const data = file.data;
                        progress.downloadedFiles.val = 1;
                        toastrUpdate(progress.downloadedFiles.val, progress.totalFiles.val, toastrEl);
                        saveAs(data, repoInfo.downloadFileName + ".zip");
                        progress.isProcessing.val = false;
                    })
                    .catch(function (error) {
                        console.log(error);
                        progress.isProcessing.val = false;
                    });
            } else {
                var zip = new JSZip();
                $http.get(url, {
                        responseType: "arraybuffer"
                    })
                    .then(function (file) {
                        progress.downloadedFiles.val = 1;
                        toastrUpdate(progress.downloadedFiles.val, progress.totalFiles.val, toastrEl);
                        zip.file(repoInfo.rootName, file.data);
                        progress.isProcessing.val = false;
                        zip.generateAsync({
                            type: "blob"
                        }).then(function (content) {
                            saveAs(content, repoInfo.downloadFileName + ".zip");
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                        progress.isProcessing.val = false;
                    });
            }
        };

        this.downloadZippedFiles = function (parameters, progress, toastrEl) {
            repoInfo = parseInfo(parameters);
            if (!repoInfo.resPath || repoInfo.resPath == "") {
                if (!repoInfo.branch || repoInfo.branch == "") {
                    repoInfo.branch = "master";
                }

                var downloadUrl = "https://github.com/" + repoInfo.author + "/" +
                    repoInfo.repository + "/archive/" + repoInfo.branch + ".zip";

                //window.location = downloadUrl;
                downloadFile(downloadUrl, progress, toastrEl, true);

            } else {

                $http.get(repoInfo.urlPrefix + repoInfo.resPath + repoInfo.urlPostfix)
                    .then(function (response) {
                        if (response.data instanceof Array) {
                            downloadDir(progress, toastrEl);
                        } else {
                            downloadFile(response.data.download_url, progress, toastrEl);
                        }

                    })
                    .catch(function (error) {
                        console.log("probable big file.");
                        downloadFile("https://raw.githubusercontent.com/" + repoInfo.author + "/" +
                            repoInfo.repository + "/" + repoInfo.branch + "/" + repoInfo.resPath,
                            progress, toastrEl);
                    });
            }
        };
    };

    const githubDownload = function (parameters, progress, toastrEl) {
        const downGit = new DownGit();
        downGit.downloadZippedFiles(parameters, progress, toastrEl);
    };

    //主程序
    class GithubDownload {
        constructor() {
            this.randomCode = DateFormat(new Date(), "yyyyMM").toString() + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString(); //属性随机码，年月加六位随机码。用于元素属性后缀来标识唯一元素，以防止属性名称重复。
            this.logoBase64 = "data:image/png;base64,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";
        }
        createStyle() {
            const toastrcss = GM_getResourceText("toastrcss");
            const style=`
        #toast-container>div {
            opacity: 1;
        }
        `;
            GM_addStyle(toastrcss+style);
        }
        watchMainDom() {
            const mainDom = $("#js-repo-pjax-container");
            const config = {
                childList: true,
                subtree: true
            };
            const callback = (mutationsList) => {
                const downloadBtn = $(`#githubDownload_${this.randomCode}`);
                if (!downloadBtn.length) {
                    this.createDownloadBtn();
                }
            };
            const observer = new MutationObserver(callback);
            observer.observe(mainDom[0], config);
        }
        createDownloadBtn() {
            const downloadBtn = $("<button></button>").addClass("btn mr-2")
                .attr("id", `githubDownload_${this.randomCode}`)
                .attr("title", "Download any file or folder from github")
                .html(`<img src=${this.logoBase64} style="width: 16px;height: 16px;"></img>Download`).click(() => {
                    const isProcessing = {
                        val: false
                    };
                    const downloadedFiles = {
                        val: 0
                    };
                    const totalFiles = {
                        val: 0
                    };
                    const parameter = {
                        url: window.location.href,
                        fileName: undefined,
                        rootDirectory: undefined
                    };
                    const progress = {
                        isProcessing,
                        downloadedFiles,
                        totalFiles
                    };
                    toastr.options = {
                        positionClass: "toast-top-center",
                        timeOut: "0",
                        extendedTimeOut: "0",
                    };
                    toastr.clear();
                    const toastrEl = toastr.info("Downloaded 0 of 0 files");
                    githubDownload(parameter, progress,toastrEl);
                });
            const goToFileBtnEl = $("div#repo-content-pjax-container div.d-flex a[class*=btn]:contains(Go to file)");
            //if (locationUrl.match(templateUrl)) {
                downloadBtn.insertBefore(goToFileBtnEl);
            //}
        }
        init() {
            this.createStyle();
            this.createDownloadBtn();
            this.watchMainDom();
        }
    }
    const githubDownload$1 = new GithubDownload();
    githubDownload$1.init();

}());
