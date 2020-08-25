import {
    youdaoTrans
} from "./youdaoTrans"

//获取sign
export default function GetSign() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://shared.ydstatic.com/fanyi/newweb/v1.0.28/scripts/newweb/fanyi.min.js",
        timeout: 5000,
        onload: function (r) {
            //sign正则匹配字符串  sign:n.md5("fanyideskweb"+e+i+"]BjuETDhU)zqSxf-=B#7m")}};
            var signMatch = /sign:[a-z]{1}\.md5\("fanyideskweb"\+[a-z]{1}\+[a-z]{1}\+"(.*)"\)}};/g.exec(r.responseText)
            if (!signMatch) {
                console.log("获取sign失败！！！");
            } else {
                var newSign = signMatch[1];
                if (typeof newSign !== 'undefined') {
                    youdaoTrans.sign = newSign;
                }
            }
        },
        onerror: function (e) {
            console.error(e);
        }
    })
}