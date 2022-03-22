import {
    StringFormat
} from "../../lib/utils"
import {
    Trans
} from "../trans"
import getSign from "./getSign"
import getYDSymbol from "./getYDSymbol"

//有道翻译
export var youdaoTrans = {
    code: "yd",
    codeText: "有道",
    sign: "",
    defaultOrigLang: "AUTO", //默认源语言
    defaultTargetLang: "ZH-CHS", //默认目标语言
    langList: {
        "AUTO": "自动检测",
        "zh-CHS": "中文",
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
        var h_url = "",
            h_headers = {},
            h_data = "";

        var youdaoTransApi = "http://fanyi.youdao.com/translate_o?client=fanyideskweb&keyfrom=fanyi.web&smartresult=dict&version=2.1&doctype=json";
        var userAgent=$.md5(navigator.userAgent);
        var currentTs="" + (new Date).getTime();
        var salt=currentTs + parseInt(10 * Math.random(), 10);
        
        var r = function(e) {
            var t = n.md5(navigator.userAgent)
              , r = "" + (new Date).getTime()
              , i = r + parseInt(10 * Math.random(), 10);
            return {
                ts: r,
                bv: t,
                salt: i,
                sign: n.md5("fanyideskweb" + e + i + "Ygy_4c=r#e#4EX^NUGUc5")
            }
        };
        
        var sign = this.sign != "" ? this.sign : "]BjuETDhU)zqSxf-=B#7m";
        var signStr = $.md5("fanyideskweb" + Trans.transText + salt + sign);
        h_url = youdaoTransApi;
        h_headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "http://fanyi.youdao.com/"
        }
        h_data = StringFormat("from={0}&to={1}&salt={2}&sign={3}&i={4}&lts={5}&bv={6}", Trans.transOrigLang, Trans.transTargetLang, salt, signStr, encodeURIComponent(Trans.transText),currentTs,userAgent);

        GM_xmlhttpRequest({
            method: "POST",
            url: h_url,
            headers: h_headers,
            data: h_data,
            onload: function (r) {
                setTimeout(function () {
                    var data = JSON.parse(r.responseText);
                    var trans = [],
                        origs = [],
                        src = "";
                    if (data.errorCode == 0) {
                        for (var j = 0; j < data.translateResult.length; j++) {
                            var ydTransCont = data.translateResult[j];
                            var ydtgt = "";
                            var ydsrc = "";
                            for (var k = 0; k < ydTransCont.length; k++) {
                                var ydcont = ydTransCont[k];
                                ydtgt += ydcont.tgt;
                                ydsrc += ydcont.src;
                            }
                            trans.push(ydtgt);
                            origs.push(ydsrc);
                        }
                        src = data.type;
                        Trans.transResult.trans = trans;
                        Trans.transResult.orig = origs;
                        Trans.transResult.origLang = src.split("2")[0];
                        
                        var smartResult = data.smartResult;
                        if (smartResult && smartResult.entries.length > 0) {
                            getYDSymbol(Trans.transText, function (symbol) {
                                Trans.transResult.symbols.en = symbol.uk;
                                Trans.transResult.symbols.am = symbol.us;
                                h_onloadfn();
                            })
                        }else {
                            h_onloadfn();
                        }
                    }
                }, 300);
            },
            onerror: function (e) {
                console.error(e);
            }
        });
    },
    init: function () {
        getSign()
    }
}