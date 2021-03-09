import {
    StringFormat
} from "../../lib/utils"
/**
 * 获取有道翻译音标
 * @param {String} transText 
 * @param {Function} callback 
 */
export default function getYDSymbol(transText, callback) {
    var url = StringFormat("http://dict.youdao.com/fsearch?client=fanyideskweb&keyfrom=fanyi.web&q={0}&doctype=xml&xmlVersion=3.2&dogVersion=1.0&appVer=3.1.17.4208", encodeURIComponent(transText));
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        timeout: 5000,
        onload: function (ydRes) {
            var xmlnode=ydRes.responseXML
            var symbol = {
                uk:"",
                us: ""
            }
            var root = xmlnode.getElementsByTagName("yodaodict")[0];
            if ("" + root.getElementsByTagName("uk-phonetic-symbol")[0] != "undefined" && "" + root.getElementsByTagName("uk-phonetic-symbol")[0].childNodes[0] != "undefined") {
                symbol.uk = root.getElementsByTagName("uk-phonetic-symbol")[0].childNodes[0].nodeValue;
            }
            if ("" + root.getElementsByTagName("us-phonetic-symbol")[0] != "undefined" && "" + root.getElementsByTagName("us-phonetic-symbol")[0].childNodes[0] != "undefined") {
                symbol.us = root.getElementsByTagName("us-phonetic-symbol")[0].childNodes[0].nodeValue;
            }
            callback(symbol);
        },
        onerror: function (e) {
            console.error(e);
        }
    })
}