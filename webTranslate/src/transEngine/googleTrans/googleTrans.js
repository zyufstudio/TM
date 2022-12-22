import {
    StringFormat
} from "../../lib/utils"
import {
    Trans
} from "../trans"

//谷歌翻译
export var googleTrans = {
    code: "ge",
    codeText: "谷歌",
    defaultOrigLang: "auto", //默认源语言
    defaultTargetLang: "zh-CN", //默认目标语言
    langList: {
        "auto": "自动检测",
        "zh-CN": "中文简体",
        "zh-TW": "中文繁体",
        "en": "英文",
        "ja": "日文",
        "ko": "韩文",
        "fr": "法文",
        "es": "西班牙文",
        "pt": "葡萄牙文",
        "it": "意大利文",
        "ru": "俄文",
        "vi": "越南文",
        "de": "德文",
        "ar": "阿拉伯文",
        "id": "印尼文"
    },
    Execute: function (h_onloadfn) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://translate.google.com.hk/_/TranslateWebserverUi/data/batchexecute",
            headers: {
                "Referer": `https://translate.google.com.hk/`,
                "Cache-Control": "max-age=0",
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            data: "f.req=" + encodeURIComponent(JSON.stringify([
                [
                    ["MkEWBc", JSON.stringify([
                        [Trans.transText, Trans.transOrigLang, Trans.transTargetLang, true],
                        [null]
                    ]), null, "generic"]
                ]
            ])),
            onload: function (r) {
                setTimeout(function () {
                    var resData=r.responseText
                    var transData=JSON.parse(JSON.parse(resData.match(/\[{2}.*\]{2}/g)[0])[0][2])
                    var transList=transData[1][0][0][5];
                    var transTexts=[]
                    for (let index = 0; index < transList.length; index++) {
                        var transItem = transList[index];
                        transTexts.push(transItem[0])
                    }
                    Trans.transResult.trans = transTexts;
                    Trans.transResult.orig = transData[1][4][0].split("\n");
                    Trans.transResult.origLang = transData[2];
                    h_onloadfn();
                }, 300);
            },
            onerror: function (e) {
                console.error(e);
            }
        });
    },
}