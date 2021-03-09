//DownGit的代码来源于：https://github.com/MinhasKamal/DownGit/blob/master/app/home/down-git.js
//修改成兼容纯js
import Http from "./http.js"
import {
    IsEmpty
} from "./utils.js"
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
    }

    var downloadDir = function (progress, toastrEl) {
        progress.isProcessing.val = true;

        var dirPaths = [];
        var files = [];
        var requestedPromises = [];

        dirPaths.push(repoInfo.resPath);
        mapFileAndDirectory(dirPaths, files, requestedPromises, progress, toastrEl);
    }

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
    }

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
    }
    var toastrUpdate = function (downloadedFiles, totalFiles, toastrEl) {
        toastrEl.text("Downloaded " + downloadedFiles + " of " + totalFiles + " files")
        if (downloadedFiles == totalFiles) {
            setTimeout(() => {
                toastr.clear(toastrEl)
            }, 3000);
        }
    }
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
                toastrUpdate(progress.downloadedFiles.val, progress.totalFiles.val, toastrEl)
            })
            .catch(function (error) {
                console.log(error);
            });

        requestedPromises.push(promise);
        progress.totalFiles.val = requestedPromises.length;
    }

    var downloadFile = function (url, progress, toastrEl, isRootDir) {
        progress.isProcessing.val = true;
        progress.downloadedFiles.val = 0;
        progress.totalFiles.val = 1;
        toastrUpdate(progress.downloadedFiles.val, progress.totalFiles.val, toastrEl)
        if (!IsEmpty(isRootDir) && isRootDir) {
            $http.get(url, {
                    responseType: "blob"
                })
                .then(function (file) {
                    const data = file.data
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
                    toastrUpdate(progress.downloadedFiles.val, progress.totalFiles.val, toastrEl)
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
    }

    this.downloadZippedFiles = function (parameters, progress, toastrEl) {
        repoInfo = parseInfo(parameters);
        if (!repoInfo.resPath || repoInfo.resPath == "") {
            if (!repoInfo.branch || repoInfo.branch == "") {
                repoInfo.branch = "master";
            }

            var downloadUrl = "https://github.com/" + repoInfo.author + "/" +
                repoInfo.repository + "/archive/" + repoInfo.branch + ".zip";

            //window.location = downloadUrl;
            downloadFile(downloadUrl, progress, toastrEl, true)

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
    }
}

const githubDownload = function (parameters, progress, toastrEl) {
    const downGit = new DownGit()
    downGit.downloadZippedFiles(parameters, progress, toastrEl)
}
export default githubDownload