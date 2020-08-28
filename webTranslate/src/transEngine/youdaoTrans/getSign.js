import {
    youdaoTrans
} from "./youdaoTrans"

//获取sign
export default function getSign() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://fanyi.youdao.com/",
        timeout: 5000,
        onload: function (ydRes) {
            //fanyijsUrlMatch正则匹配字符串  <script type="text/javascript" src="http://shared.ydstatic.com/fanyi/newweb/v1.0.29/scripts/newweb/fanyi.min.js"></script>
            var fanyijsUrlMatch = /<script\s+type="text\/javascript"\s+src="([http|https]*?:\/\/shared.ydstatic.com\/fanyi\/newweb\/v[\d.]+\/scripts\/newweb\/fanyi.min.js)"><\/script>/g.exec(ydRes.responseText)
            if (!fanyijsUrlMatch) {
                console.log("获取fanyi.min.js失败！！！");
            } else {
                var fanyijsUrl = fanyijsUrlMatch[1];
                if (typeof fanyijsUrl !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: fanyijsUrl,
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
            }
        },
        onerror: function (e) {
            console.error(e);
        }
    })
}