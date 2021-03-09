import {Trans} from "../trans"
import calcSign from "./calcSign"
import getToken from "./getToken"
import {ObjectToQueryString} from "../../lib/utils"

//百度翻译
export var baiduTrans = {
    code:"bd",
    codeText:"百度",
    gtk:"",
    token:"",
    defaultOrigLang:"auto",         //默认源语言
    defaultTargetLang:"zh",         //默认目标语言
    langList: {"auto": "自动检测","zh": "中文","cht": "繁体中文","en": "英语","jp": "日语","kor": "韩语","fra": "法语","spa": "西班牙语","pt": "葡萄牙语","it": "意大利语","ru": "俄语","vie": "越南语","de": "德语","ara": "阿拉伯语"},
    Execute: function (h_onloadfn) {
        if(Trans.transOrigLang=="auto")
            this.AutoTrans(h_onloadfn);
        else
            this.ExecTrans(h_onloadfn);
        
    },
    AutoTrans:function(h_onloadfn){
        var self=this;
        var datas={
            query:Trans.transText
        }
        GM_xmlhttpRequest({
            method: "POST",
            headers:{
                "referer": 'https://fanyi.baidu.com',
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            url: "https://fanyi.baidu.com/langdetect",
            data: ObjectToQueryString(datas),
            onload: function (r) {
                var data = JSON.parse(r.responseText);
                if(data.error===0){
                    Trans.transOrigLang=data.lan;
                    self.ExecTrans(h_onloadfn);
                }
            },
            onerror: function (e) {
                console.error(e);
            }
        });
    },
    ExecTrans:function(h_onloadfn){
        var tempSign=calcSign(Trans.transText,this.gtk);
        var datas={
            from:Trans.transOrigLang,
            to:Trans.transTargetLang,
            query:Trans.transText,
            transtype:"translang",
            simple_means_flag:3,
            sign:tempSign,
            token:this.token
        }
        GM_xmlhttpRequest({
            method: "POST",
            headers:{
                "referer": 'https://fanyi.baidu.com',
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                //"User-Agent": window.navigator.userAgent,
            },
            url: "https://fanyi.baidu.com/v2transapi",
            data: ObjectToQueryString(datas),
            onload: function (r) {
                setTimeout(function () {
                    var result= JSON.parse(r.responseText);
                    var trans_result=result.trans_result;
                    var dict_result=result.dict_result || null
                    var transDatas = trans_result.data;
                    
                    var trans = [],origs = [],src = "";
                    for (var i = 0; i < transDatas.length; i++) {
                        var getransCont = transDatas[i];
                        trans.push(getransCont.dst);
                        origs.push(getransCont.src);
                    }
                    src = trans_result.from;
                    Trans.transResult.trans = trans;
                    Trans.transResult.orig = origs;
                    Trans.transResult.origLang = src;
                    
                    if(dict_result){
                        var symbols=dict_result.simple_means.symbols
                        Trans.transResult.symbols.en=symbols[0].ph_en || ""
                        Trans.transResult.symbols.am=symbols[0].ph_am || ""
                    }
                    h_onloadfn();
                }, 300);
            },
            onerror: function (e) {
                console.error(e);
            }
        });
    },
    init:function(){
        getToken();
    }
}