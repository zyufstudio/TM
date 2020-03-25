import {StringFormat} from "../lib/utils"
import {Trans} from "./trans"

//有道翻译
export var youdaoTrans = {
    code:"yd",
    codeText:"有道",
    defaultOrigLang:"AUTO",         //默认源语言
    defaultTargetLang:"ZH-CHS",     //默认目标语言
    langList: {"AUTO": "自动检测","zh-CHS": "中文","en": "英文","ja": "日文","ko": "韩文","fr": "法文","es": "西班牙文","pt": "葡萄牙文","it": "意大利文","ru": "俄文","vi": "越南文","de": "德文","ar": "阿拉伯文","id": "印尼文"},
    Execute: function (h_onloadfn) {
        var h_url = "",
            h_headers = {},
            h_data = "";

        var youdaoTransApi = "http://fanyi.youdao.com/translate_o?client=fanyideskweb&keyfrom=fanyi.web&version=2.1&doctype=json";
        var tempsalt = "" + (new Date).getTime() + parseInt(10 * Math.random(), 10);
        var tempsign = $.md5("fanyideskweb" + Trans.transText + tempsalt + "n%A-rKaT5fb[Gy?;N5@Tj");
        h_url = youdaoTransApi;
        h_headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "http://fanyi.youdao.com/"
        }
        h_data = StringFormat("from={0}&to={1}&salt={2}&sign={3}&i={4}", Trans.transOrigLang, Trans.transTargetLang, tempsalt, tempsign, Trans.transText);

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

                    }
                    h_onloadfn();
                }, 300);
            },
            onerror: function (e) {
                console.error(e);
            }
        });
    },
}