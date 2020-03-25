import {StringFormat} from "../lib/utils"
import {Trans} from "./trans"

//谷歌翻译
export var googleTrans = {
    code:"ge",
    codeText:"谷歌",
    defaultOrigLang:"auto",         //默认源语言
    defaultTargetLang:"zh-CN",      //默认目标语言
    langList: {"auto": "自动检测","zh-CN": "中文简体","zh-TW": "中文繁体","en": "英文","ja": "日文","ko": "韩文","fr": "法文","es": "西班牙文","pt": "葡萄牙文","it": "意大利文","ru": "俄文","vi": "越南文","de": "德文","ar": "阿拉伯文","id": "印尼文"},
    Execute: function (h_onloadfn) {
        var h_url = "";
        var googleTransApi = StringFormat("https://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&sl={1}&tl={0}&hl=zh-CN", Trans.transTargetLang,Trans.transOrigLang);
        h_url = googleTransApi + "&q=" + encodeURIComponent(Trans.transText);

        GM_xmlhttpRequest({
            method: "GET",
            url: h_url,
            onload: function (r) {
                setTimeout(function () {
                    var data = JSON.parse(r.responseText);
                    var trans = [],origs = [],src = "";
                    for (var i = 0; i < data.sentences.length; i++) {
                        var getransCont = data.sentences[i];
                        trans.push(getransCont.trans);
                        origs.push(getransCont.orig);
                    }
                    src = data.src;
                    Trans.transResult.trans = trans;
                    Trans.transResult.orig = origs;
                    Trans.transResult.origLang = src;
                    h_onloadfn();
                }, 300);
            },
            onerror: function (e) {
                console.error(e);
            }
        });
    },
}