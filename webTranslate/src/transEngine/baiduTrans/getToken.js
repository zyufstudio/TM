
import {baiduTrans} from "./baiduTrans"

//获取gtk和token
export default function GetToken(){
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://fanyi.baidu.com/",
        timeout:5000,
        onload: function (r) {
            var gtkMatch = /window\.gtk = '(.*?)'/.exec(r.responseText)
            var commonTokenMatch = /token: '(.*?)',/.exec(r.responseText)
            if (!gtkMatch) {
              console.log("获取gtk失败！！！");
            }
            if (!commonTokenMatch) {
              console.log("获取token失败！！！");
            }
            var newGtk = gtkMatch[1];
            var newCommonToken = commonTokenMatch[1];

            if (typeof newGtk !== 'undefined') {
                baiduTrans.gtk=newGtk;
            }
            if (typeof newCommonToken !== 'undefined') {
                baiduTrans.token=newCommonToken;
            }
        },
        onerror: function (e) {
            console.error(e);
        }
    })
}
