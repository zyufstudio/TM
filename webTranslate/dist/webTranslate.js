// ==UserScript==
// @name         网页翻译助手
// @version      1.2.2
// @namespace    https://github.com/zyufstudio/TM/tree/master/webTranslate
// @description  支持划词翻译，输入文本翻译,谷歌整页翻译。可以自行选择谷歌翻译,有道字典翻译和百度翻译。
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAENklEQVRoQ+2ZTVITQRTH/28qyNIJFxCqnGwNJzCcwHACcelkIZxAPAG4IFkaTyCegHgC4jZjVfACzLBEUvOs7jCx57unZ6JSRZZJ9+v3e+/1++gQHviHHrj+eAT41x4s9YA99F5qK3nb+h4c7QTa6xtYmAuwNfLeg3Fc5QxmBGy1doO3O1dV9tVZmwmwdeYdg/DeTDB/vnY7B2Z7q+/KBhh6XF3UcgeDr3y3s2O6v+q+FIB9NutaRJdVBanrQ+bdYNCZ1pGhuzcNMPJ6FuNCV0DWuhA4ClzntI4M3b1rARBhRERjXSWK1oUhfy3y5loAmlBclcHAue86+1lyHwTAfXb4cD1wUmm9EgAzfhLoPLT4fGUNRpeAPgH6Bc/ARcw89Qed3eRWLQAGbhg4LrqY9sjrUYgxEZ7FDmH6GAPWUZ7JJvBh0ijXrpPStxRAKs/c00mLAiKewcyLmn0yt63Nha/yGgGEoP3Afb4KGSEYT+5eWxbZQniUJUT9INAFEeT3RXGr4wSxpj30JqoXKgMw8M13nV50oH02OyDQSUxJWX55zKB+8vu8uP1rAKr17dF8m8LFZUr5Em1Cau2ozZ09/NEn8Dum1puypq+2B1SXbQ1nY4Be61rvTxjxOPy1cRS12e2z2SURdcHITIuq/FoA4vL6rrOK56QwBn/n241eXv/fHs6mBHpRFViEHVsb+8I79QAYgT9w2pECSWFlFlxZuiqBSAz3YVcLQJxbFEJyeGEcwMJyAmO+UVPtltKSJzOZyiTuhAX+woyv/sDpNxZCMkUqKVReYl5MCXiaZdSQ+U0w6MgGLt2S59eD9tC7IKCn7s/zukkanfiusxdLo0SnaYi4gnkTXXLYiQqfLJa3re3kfaodQkkvSOuKQra5OLB4WbBCC5PgrTNZQZ7MbXqymKdqAnAjwZXsU5aRGgGQsQ7e02olpPJ3FzJNJj4ixonwSkIz71qgvpi7RYPoD5ztrLBsBCASHDIfBoPOx7yksmwl8ClLeXnHgW/ENAXxO2GUyENF42ejAEsl+Eq204DSTnOXiHqipS7LmOFtq02bi/OovykbPRsHKFNQ4/dTkXoj68ui9WtjL78Y1mzmNBQyWiKqOETPT3hWBPE/egBRwRLZjDbvJqLdyIP4LwFCwl6UdssgzAAaeNgqjKtEFxqDAGKF0whAHK72MUZBXrApOSRFxXGZnfhKfVc1B6j1uFuGrD8nGwNIL6wBIq/nyUOuBbDqbUbeaiYus230uxWil/U8X9RWZ7cSszmBVm2GVjeqq2TZuqwRtAqAeECwiD6p5/xVgGhQSTd1PAVRyd9QvK1a/r6Xio24kdzS/8jKLF30e3voBXkDUFW5WRObkLFWAOOXjASdvPzU6mY9w6wVYFmk/nSfla0O3IAxYat1mPeGtFaAqgqbrH8EMLFak3sePdCkNU1k/QadtchPhjx3/AAAAABJRU5ErkJggg==
// @author       Johnny Li
// @license      MIT
// @match        *://*/*
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      cdn.jsdelivr.net
// @connect      cdn.bootcss.com
// @connect      translate.google.cn
// @connect      fanyi.youdao.com
// @connect      fanyi.baidu.com
// @require      https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @require      https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@master/jPopBox/dist/jPopBox.min.js
// ==/UserScript==


//文件使用Rollup+Gulp编译而成，如需查看源码请转到GitHub项目。

(function () {
    'use strict';

    /**
     * 字符串模板格式化
     * @param {string} formatStr - 字符串模板
     * @returns {string} 格式化后的字符串
     * @example
     * StringFormat("ab{0}c{1}ed",1,"q")  output "ab1cqed"
     */
    function StringFormat(formatStr) {
        var args = arguments;
        return formatStr.replace(/\{(\d+)\}/g, function (m, i) {
            i = parseInt(i);
            return args[i + 1];
        });
    }
    /**
     * 日期格式化
     * @param {Date} date - 日期
     * @param {string} formatStr - 格式化模板
     * @returns {string} 格式化日期后的字符串
     * @example
     * DateFormat(new Date(),"yyyy-MM-dd")  output "2020-03-23"
     * @example
     * DateFormat(new Date(),"yyyy/MM/dd hh:mm:ss")  output "2020/03/23 10:30:05"
     */
    function DateFormat(date, formatStr) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(formatStr)) {
                formatStr = formatStr.replace(
                    RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return formatStr;
    }
    /**
     * 生成Guid
     * @param {boolean} hasLine - guid字符串是否包含短横线
     * @returns {string} guid
     * @example 
     * Guid(false)  output "b72f78a6cb88362c0784cb82afae450b"
     * @example
     * Guid(true) output "67b25d43-4cfa-3edb-40d7-89961ce7f388"
     */
    function Guid(hasLine){
        var guid="";
        function S4() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        if(hasLine){
            guid=(S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }
        else {
            guid=(S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
        }
        return guid;
    }
    /**
     * 清除dom元素默认事件
     * @param {object} e - dom元素
     */
    function ClearBubble(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
    function ObjectToQueryString(object){
        var querystring=Object.keys(object).map(function(key) { 
            return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]) 
        }).join('&');
        return querystring;
    }

    /**
     * 配置参数
     */
    var options={
        //默认翻译引擎
        defaulttransengine:"yd"
    };
    /**
     * 获取配置参数
     */
    function GetSettingOptions(){
        var optionsJson=GM_getValue("webtranslate-options")||"";
        if(optionsJson!=""){
            var optionsData=JSON.parse(optionsJson);
            for (var key in options) {
                if (options.hasOwnProperty(key) && optionsData.hasOwnProperty(key)) {
                    options[key]= optionsData[key];   
                }
            }
        }
        return options;
    }
    /**
     * 设置配置参数
     */
    function SetSettingOptions(){
        var optionsJson=JSON.stringify(options);
        GM_setValue("webtranslate-options", optionsJson);
    }

    //谷歌翻译
    var googleTrans = {
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
    };

    //有道翻译
    var youdaoTrans = {
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
            var tempsign = $.md5("fanyideskweb" + Trans.transText + tempsalt + "Nw(nmmbP%A-r6U3EUn]Aj");
            h_url = youdaoTransApi;
            h_headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "http://fanyi.youdao.com/"
            };
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
    };

    function a(r) {
      if (Array.isArray(r)) {
        for (var o = 0, t = Array(r.length); o < r.length; o++)
          t[o] = r[o];
        return t
      }
      return Array.from(r)
    }

    function n(r, o) {
      for (var t = 0; t < o.length - 2; t += 3) {
        var a = o.charAt(t + 2);
        a = a >= "a" ? a.charCodeAt(0) - 87 : Number(a),
        a = "+" === o.charAt(t + 1) ? r >>> a : r << a,
        r = "+" === o.charAt(t) ? r + a & 4294967295 : r ^ a;
      }
      return r
    }

    function e(r,gtk) {
      var i = null;
      var o = r.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
      if (null === o) {
        var t = r.length;
        t > 30 && (r = "" + r.substr(0, 10) + r.substr(Math.floor(t / 2) - 5, 10) + r.substr(-10, 10));
      } else {
        for (var e = r.split(/[\uD800-\uDBFF][\uDC00-\uDFFF]/), C = 0, h = e.length, f = []; h > C; C++)
          "" !== e[C] && f.push.apply(f, a(e[C].split(""))),
          C !== h - 1 && f.push(o[C]);
        var g = f.length;
        g > 30 && (r = f.slice(0, 10).join("") + f.slice(Math.floor(g / 2) - 5, Math.floor(g / 2) + 5).join("") + f.slice(-10).join(""));
      }
      var u = void 0
        ;
      u = null !== i ? i : (i = gtk || "") || "";
      for (var d = u.split("."), m = Number(d[0]) || 0, s = Number(d[1]) || 0, S = [], c = 0, v = 0; v < r.length; v++) {
        var A = r.charCodeAt(v);
        128 > A ? S[c++] = A : (2048 > A ? S[c++] = A >> 6 | 192 : (55296 === (64512 & A) && v + 1 < r.length && 56320 === (64512 & r.charCodeAt(v + 1)) ? (A = 65536 + ((1023 & A) << 10) + (1023 & r.charCodeAt(++v)),
        S[c++] = A >> 18 | 240,
        S[c++] = A >> 12 & 63 | 128) : S[c++] = A >> 12 | 224,
        S[c++] = A >> 6 & 63 | 128),
        S[c++] = 63 & A | 128);
      }
      for (var p = m, F = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(97) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(54)), D = "" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(51) + ("" + String.fromCharCode(94) + String.fromCharCode(43) + String.fromCharCode(98)) + ("" + String.fromCharCode(43) + String.fromCharCode(45) + String.fromCharCode(102)), b = 0; b < S.length; b++)
        p += S[b],
        p = n(p, F);
      return p = n(p, D),
      p ^= s,
      0 > p && (p = (2147483647 & p) + 2147483648),
      p %= 1e6,
      p.toString() + "." + (p ^ m)
    }

    /**
     * @param  {string} word
     * @param  {string} gtk
     * @return {string}
     */
    var calcSign =function(word,gtk){
      return e(word,gtk);
    };

    //获取gtk和token
    function GetToken(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://fanyi.baidu.com/",
            timeout:5000,
            onload: function (r) {
                var gtkMatch = /window\.gtk = '(.*?)'/.exec(r.responseText);
                var commonTokenMatch = /token: '(.*?)',/.exec(r.responseText);
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
        });
    }

    //百度翻译
    var baiduTrans = {
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
            };
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
            };
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
                        h_onloadfn();
                    }, 300);
                },
                onerror: function (e) {
                    console.error(e);
                }
            });
        },
        init:function(){
            GetToken();
        }
    };

    var Trans={
        transEngineList:{},         //翻译引擎实例列表
        transEngine:"",             //当前翻译引擎。ge(谷歌)/yd(有道)
        transEngineObj:{},          //当前翻译引擎实例
        transTargetLang:"",         //目标语言。
        transOrigLang:"",           //源语言
        transType:"word",           //翻译类型。word(划词翻译)/text(输入文本翻译)/page(整页翻译)
        transText:"",               //被翻译内容
        transResult:{               //当前翻译内容
            //译文
            trans:[],
            //原文
            orig:[],
            //原文语言
            origLang:""
        },
        Execute:function(h_onloadfn){
            this.transResult.trans=[];
            this.transResult.orig=[];
            this.transResult.origLang="";
            this.transEngineObj.Execute(h_onloadfn);
        },
        GetLangList:function(){
            var langList={};
            langList=this.transEngineObj.langList;
            return langList;
        },
        Update:function(){
            this.transResult.trans=[];
            this.transResult.orig=[];
            this.transResult.origLang="";
            this.transEngineObj=this.transEngineList[this.transEngine];
            this.transTargetLang=this.transEngineObj.defaultTargetLang;
            this.transOrigLang=this.transEngineObj.defaultOrigLang;
        },
        Clear:function(){
            this.transEngine="";                //当前翻译引擎。ge(谷歌)/yd(有道)
            this.transTargetLang="";            //目标语言。
            this.transOrigLang="";             //源语言
            this.transText="";                   //被翻译内容
            this.transResult.trans=[];
            this.transResult.orig=[];
            this.transResult.origLang="";
        },
        //注册翻译引擎接口并执行翻译引擎的初始化接口
        RegisterEngine:function(){
            /**
             * 翻译引擎必须提供以下接口
                code:"",                    //代号
                codeText:"",                //代号描述
                defaultOrigLang:"",         //默认源语言
                defaultTargetLang:"",       //默认目标语言
                langList: {},               //支持翻译语言列表
                Execute: function (h_onloadfn) {},     //执行翻译
                init:function(){},          //可选，初始化接口，在脚本创建时立即执行
             */
            var transEngineListObj={};
            transEngineListObj[googleTrans.code]=googleTrans;
            transEngineListObj[youdaoTrans.code]=youdaoTrans;
            transEngineListObj[baiduTrans.code]=baiduTrans;
            this.transEngineList=transEngineListObj;
            for (var key in this.transEngineList) {
                if (this.transEngineList.hasOwnProperty(key) && this.transEngineList[key].hasOwnProperty("init")) {
                    this.transEngineList[key].init();
                }
            }
        }
    };

    //面板
    var Panel={
        popBoxEl:{},
        randomCode:"",
        Create:function(title,placement,isShowArrow,content,shownFn){
            var self=this;
            $(self.popBoxEl).jPopBox({
                title: title,
                className: 'JPopBox-tip-white',
                placement: placement,
                trigger: 'none',
                isTipHover: true,
                isShowArrow: isShowArrow,
                content: function(){
                    return StringFormat('<div id="panelBody{0}">{1}</div>',self.randomCode,content);
                }
            });
            $(self.popBoxEl).on("shown.jPopBox",function(){
                var $panel=$("div.JPopBox-tip-white");
                typeof shownFn === 'function' && shownFn($panel);
            });
            $(self.popBoxEl).jPopBox('show');
        },
        Update:function(Fn){
            var $panel=$("div.JPopBox-tip-white");
            Fn($panel);    
        },
        Destroy:function(){
            //$(this.popBoxEl).jPopBox("hideDelayed");
            $(this.popBoxEl).jPopBox("destroy");
        },
        CreateStyle:function(){
            var s="";
            s+=StringFormat("#panelBody{0}>div input,#panelBody{0}>div select{padding: 3px; margin: 0; background: #fff; font-size: 14px; border: 1px solid #a9a9a9; color:black;width: auto;min-height: auto; }",this.randomCode);
            s+=StringFormat("#panelBody{0}>div:first-child{padding-bottom: 5px;height:30px}",this.randomCode);
            s+=StringFormat("#panelBody{0}>div:last-child hr{border: 1px inset #eeeeee;background: none;height: 0px;margin: 0px;}",this.randomCode);
            return s;
        }
    };

    //文本翻译面板
    var TextTransPanel={
        Create:function(popBoxEl,randomCode){
            var self=this;
            var html=this.GetHtml();
            var transEngineOptionsHtml="";
            //翻译引擎
            for (var k in Trans.transEngineList) {
                if (Trans.transEngineList.hasOwnProperty(k)) {
                    var v = Trans.transEngineList[k].codeText;
                    var selectOption="";
                    if(Trans.transEngine==k){

                        selectOption='selected="selected"';
                    }
                    transEngineOptionsHtml+=StringFormat('<option value="{0}" {2}>{1}</option>',k,v,selectOption);
                }
            }
            var TextTransPanelHtml=StringFormat('<div style="padding-bottom: 5px;">'+
                '翻译引擎：<select>{2}</select>&nbsp;&nbsp;&nbsp;&nbsp;'+
                '翻译语言：<select>{4}</select> &#x21E8; '+
                '<select>{3}</select> '+
                '<button style="width:46px; height:26px; cursor: pointer;overflow: visible;color: inherit;margin: 0;padding: 1px 7px;background-color: #dddddd;border: 2px outset #dddddd;text-align: center;display: inline-block;font-size: 14px; font-weight: 400; ">翻译</button></div>'+
                '<div style="word-wrap:break-word">'+
                    '<div style="padding-bottom: 5px;"><textarea placeholder="请输入你要翻译的文字" style="word-wrap: break-word;word-break: keep-all;overflow-y: auto;width:450px;height:85px;padding: 3px;line-height: 18px;font-size: 14px;font-family: arial,simsun;border: 1px solid #999;border-color: #999 #d8d8d8 #d8d8d8 #999;outline: 0;resize: none;">{5}</textarea></div><hr/>'+
                    '<div style="padding-top: 5px;">{6}</div>'+
                '</div>',randomCode,"",transEngineOptionsHtml,html.targetLangListHtml,html.origLangListHtml,"","");
            Panel.popBoxEl=popBoxEl;
            Panel.randomCode=randomCode;
            Panel.Create("文本翻译","auto bottom",false,TextTransPanelHtml,function($panel){
                $panel.css({
                    position: "fixed",
                    top:"20px"
                });
                //翻译引擎
                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(0)",randomCode)).change(function(e){
                    Trans.transEngine=$(this).find("option:selected").val();
                    Trans.Update();
                    Panel.Update(function($panel){
                        var html=self.GetHtml();
                        //翻译内容
                        $panel.find(StringFormat("#panelBody{0} div:eq(1) div:eq(1)",randomCode)).html("");
                        $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).html(html.origLangListHtml);
                        $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(2)",randomCode)).html(html.targetLangListHtml);
                    });
                });
                //源语言
                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).change(function(e){
                    Trans.transOrigLang=$(this).find("option:selected").val();
                    Panel.Update(function($panel){
                        var html=self.GetHtml();
                        $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(2)",randomCode)).html(html.targetLangListHtml);
                    });
                });
                //目标语言
                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(2)",randomCode)).change(function(e){
                    Trans.transTargetLang=$(this).find("option:selected").val();
                });
                //翻译
                $panel.find(StringFormat("#panelBody{0} div:eq(0)  button:eq(0)",randomCode)).click(function(e){
                    var refTransText=$.trim($panel.find(StringFormat("#panelBody{0} div:eq(1) div:eq(0) textarea:eq(0)",randomCode)).val());
                    if(refTransText==""){
                        alert("请输入翻译文字!");
                        return;
                    }
                    Trans.transText=refTransText;
                    Trans.Execute(function(){
                        Panel.Update(function($panel){
                            var html=self.GetHtml();
                            //源语言
                            $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).html(html.origLangListHtml);
                            //翻译内容
                            $panel.find(StringFormat("#panelBody{0} div:eq(1) div:eq(1)",randomCode)).html(html.transHtml);
                        });
                    });
                });
            });
        },
        GetHtml:function(){
            var origLangListHtml=[];
            var targetLangListHtml=[];
            var returnHtml={};
            var transHtml=[];

            var langList=Trans.GetLangList();
            var origLang=Trans.transResult.origLang;

            if(Trans.transResult.trans.length>0 && Trans.transResult.orig.length>0)
            {
                transHtml.push('<span>');
                for (var i = 0; i < Trans.transResult.trans.length; i++) {
                    var transtxt = Trans.transResult.trans[i];
                    transHtml.push(transtxt);
                }
                transHtml.push("</span>");
                Trans.transOrigLang=origLang;
            }
            else {
                var txt="该翻译引擎不支持 "+langList[Trans.transOrigLang]+" 翻译成 "+langList[Trans.transTargetLang];
                transHtml.push(StringFormat("<span>{0}</span>",txt));
            }
            //源语言
            for (var origKey in langList) {
                if (langList.hasOwnProperty(origKey)) {
                    var origVal = langList[origKey]; 
                    var origSelectOption="";
                    if(Trans.transOrigLang.toUpperCase()==origKey.toUpperCase()){
                        origSelectOption='selected="selected"';
                    }
                    origLangListHtml.push(StringFormat('<option value="{0}" {2}>{1}</option>',origKey,origVal,origSelectOption));
                }
            }
            //目标语言
            for (var targetKey in langList) {
                if (langList.hasOwnProperty(targetKey) && targetKey!=Trans.transOrigLang && targetKey.toUpperCase()!="AUTO") {
                    var targetVal = langList[targetKey];
                    var targetSelectOption="";
                    targetLangListHtml.push(StringFormat('<option value="{0}" {2}>{1}</option>',targetKey,targetVal,targetSelectOption));
                }
            }
            returnHtml.origLangListHtml=origLangListHtml.join("");
            returnHtml.targetLangListHtml=targetLangListHtml.join("");
            returnHtml.transHtml=transHtml.join("");
            return returnHtml;
        }
    };

    //划词翻译面板
    var WordTransPanel={
        Create:function(popBoxEl,randomCode){
            var self=this;
            var html=this.GetTransContHtml();
            var transEngineOptionsHtml="";
            for (var k in Trans.transEngineList) {
                if (Trans.transEngineList.hasOwnProperty(k)) {
                    var v = Trans.transEngineList[k].codeText;
                    var selectOption="";
                    if(Trans.transEngine==k){
                        selectOption='selected="selected"';
                    }
                    transEngineOptionsHtml+=StringFormat('<option value="{0}" {2}>{1}</option>',k,v,selectOption);
                }
            }
            var wordTransPanelHtml=StringFormat(
                '<div>翻译引擎：<select>{2}</select>    翻译语言：<input type="text" value="{4}" readonly style="width:80px"/> &#x21E8; <select>{3}</select></div>'+
                '<div style="word-wrap:break-word">{1}</div>'
            ,randomCode,html.transHtml,transEngineOptionsHtml,html.langListHtml,html.origLangName);
            
            Panel.popBoxEl=popBoxEl;
            Panel.randomCode=randomCode;
            Panel.Create("","auto bottom",false,wordTransPanelHtml,function($panel){+
                
                //目标语言
                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).change(function(e){
                    Trans.transTargetLang=$(this).find("option:selected").val();
                    Trans.Execute(function(){
                        self.Update(randomCode);
                    });
                });
                //翻译引擎
                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(0)",randomCode)).change(function(e){
                    Trans.transEngine=$(this).find("option:selected").val();
                    Trans.Update();
                    Trans.Execute(function(){
                        self.Update(randomCode);
                    });
                });
            });
        },
        Update:function(randomCode){
            var self=this;
            Panel.Update(function($panel){
                var html=self.GetTransContHtml();
                $panel.find(StringFormat("#panelBody{0} div:eq(0) input:eq(0)",randomCode)).val("").val(html.origLangName);
                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).html("").html(html.langListHtml);
                $panel.find(StringFormat("#panelBody{0} div:eq(1)",randomCode)).html("").html(html.transHtml);
            });
        },
        GetTransContHtml:function(){
            var transObj={};
            var langListHtml=[];
            var langList=Trans.GetLangList();
            var origLang=Trans.transResult.origLang;
            var transContHtml="";

            if(Trans.transResult.trans.length>0 && Trans.transResult.orig.length>0)
            {
                var transHtml=[];
                transHtml.push('<div style="padding-top: 5px;"><ul style="list-style: none;margin: 0;padding: 0;">');
                for (var i = 0; i < Trans.transResult.trans.length; i++) {
                    var transtxt = Trans.transResult.trans[i];
                    transHtml.push(StringFormat('<li style="list-style: none;"><span>{0}</span></li>',transtxt));
                }
                transHtml.push("</ul></div>");

                var origHtml=[];
                origHtml.push('<div style="padding-bottom: 5px;"><ul style="list-style: none;margin: 0;padding: 0;">');
                for (var j = 0; j < Trans.transResult.orig.length; j++) {
                    var origtxt = Trans.transResult.orig[j];
                    origHtml.push(StringFormat('<li style="list-style: none;"><span>{0}</span></li>',origtxt));
                }
                origHtml.push("</ul></div>");
                transContHtml=origHtml.join("")+"<hr/>"+transHtml.join("");
                Trans.transOrigLang=origLang;
            }
            else {
                var txt="该翻译引擎不支持 "+langList[Trans.transOrigLang]+" 翻译成 "+langList[Trans.transTargetLang];
                transContHtml=StringFormat("<div><span>{0}</span></div>",txt);
            }
            for (var k in langList) {
                if (langList.hasOwnProperty(k) && k!=Trans.transOrigLang && k.toUpperCase()!="AUTO") {
                    var v = langList[k];
                    var selectOption="";
                    if(Trans.transTargetLang==k){
                        selectOption='selected="selected"';
                    }
                    langListHtml.push(StringFormat('<option value="{0}" {2}>{1}</option>',k,v,selectOption));
                }
            }
            transObj.origLangName=langList[Trans.transOrigLang];
            transObj.transHtml=transContHtml;
            transObj.langListHtml=langListHtml.join("");
            return transObj;
        }
    };

    //设置面板
    var SettingPanel={
        config:[{title:"",item:[{code:"",text:""}]}],
        Create:function(popBoxEl,randomCode){
            var self=this;
            var settingHtml=[];
            this.InitConfig();
            settingHtml.push('<div style="padding-left: 15px;display: inline-block;">');
                /*
                settingHtml.push('<div style="padding-bottom: 30px; max-width: 600px;">');
                    settingHtml.push('<div style="font-size: 14px; padding-bottom: 3px;">默认翻译引擎：</div>');
                    settingHtml.push(StringFormat('<div style="padding-bottom: 3px; margin-left: 10px;"><label style="font-size: 14px; cursor: pointer;"><input type="radio" name="transEngine{0}" style="cursor: pointer;" value="yd">有道</label></div>',randomCode));
                    settingHtml.push(StringFormat('<div style="padding-bottom: 0px; margin-left: 10px;"><label style="font-size: 14px; cursor: pointer;"><input type="radio" name="transEngine{0}" style="cursor: pointer;" value="ge">谷歌</label></div>',randomCode));
                settingHtml.push('</div>');
                */
                for (var index = 0; index < this.config.length; index++) {
                    var configItem = this.config[index];
                    settingHtml.push('<div style="padding-bottom: 30px; max-width: 600px;">');
                    settingHtml.push(StringFormat('<div style="font-size: 14px; padding-bottom: 3px;">{0}</div>',configItem.title));
                    for (var itemIndex = 0; itemIndex < configItem.item.length; itemIndex++) {
                        var itemObj = configItem.item[itemIndex];
                        settingHtml.push(StringFormat('<div style="padding-bottom: 0px; margin-left: 10px;"><label style="font-size: 14px; cursor: pointer;"><input type="radio" name="transEngine{0}" style="cursor: pointer;" value="{1}">{2}</label></div>',randomCode,itemObj.code,itemObj.text));
                    }   
                    settingHtml.push('</div>');
                }

                settingHtml.push('<div>');
                    settingHtml.push(StringFormat('<button id="saveBtn{0}">保存</button>',randomCode));
                    settingHtml.push(StringFormat('<span id="saveStatus{0}" style="display:none;margin-left:10px;background-color: #fff1a8;padding: 3px;">设置已保存。</span>',randomCode));
                settingHtml.push('</div>');
            settingHtml.push('</div>');

            var settingHtmlStr=settingHtml.join("");
            Panel.popBoxEl=popBoxEl;
            Panel.randomCode=randomCode;
            Panel.Create("网页翻译助手设置","auto bottom",false,settingHtmlStr,function($panel){
                $panel.css({
                    position: "fixed",
                    top:"20px"
                });
                self.Update(randomCode);
                //保存设置
                $panel.find(StringFormat("#panelBody{0} #saveBtn{0}",randomCode)).click(function(e){
                    var defaultTransEngine=$panel.find(StringFormat("#panelBody{0} input[name='transEngine{0}']:checked",randomCode)).val();
                    options.defaulttransengine=defaultTransEngine;
                    SetSettingOptions();
                    $panel.find(StringFormat("#panelBody{0} #saveStatus{0}",randomCode)).fadeIn(function(){
                        setTimeout(function(){
                            $panel.find(StringFormat("#panelBody{0} #saveStatus{0}",randomCode)).fadeOut();
                        },1500);
                    });
                });
            });
        },
        Update:function(randomCode){
            GetSettingOptions();
            Panel.Update(function($panel){
                $panel.find(StringFormat("#panelBody{0} input[name='transEngine{0}'][value='{1}']",randomCode,options.defaulttransengine)).prop("checked",true);
            });
        },
        InitConfig:function(){
            this.config=[];
            var configObj={title:"",item:[{code:"",text:""}]};
            configObj.title="默认翻译引擎：";
            configObj.item=[];
            for (var k in Trans.transEngineList) {
                if (Trans.transEngineList.hasOwnProperty(k)) {
                    var v = Trans.transEngineList[k].codeText;
                    configObj.item.push({code:k,text:v});
                }
            }
            this.config.push(configObj);
        }
    };

    //主程序
    var WebTranslate=function(){
        var transIconBase64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAENklEQVRoQ+2ZTVITQRTH/28qyNIJFxCqnGwNJzCcwHACcelkIZxAPAG4IFkaTyCegHgC4jZjVfACzLBEUvOs7jCx57unZ6JSRZZJ9+v3e+/1++gQHviHHrj+eAT41x4s9YA99F5qK3nb+h4c7QTa6xtYmAuwNfLeg3Fc5QxmBGy1doO3O1dV9tVZmwmwdeYdg/DeTDB/vnY7B2Z7q+/KBhh6XF3UcgeDr3y3s2O6v+q+FIB9NutaRJdVBanrQ+bdYNCZ1pGhuzcNMPJ6FuNCV0DWuhA4ClzntI4M3b1rARBhRERjXSWK1oUhfy3y5loAmlBclcHAue86+1lyHwTAfXb4cD1wUmm9EgAzfhLoPLT4fGUNRpeAPgH6Bc/ARcw89Qed3eRWLQAGbhg4LrqY9sjrUYgxEZ7FDmH6GAPWUZ7JJvBh0ijXrpPStxRAKs/c00mLAiKewcyLmn0yt63Nha/yGgGEoP3Afb4KGSEYT+5eWxbZQniUJUT9INAFEeT3RXGr4wSxpj30JqoXKgMw8M13nV50oH02OyDQSUxJWX55zKB+8vu8uP1rAKr17dF8m8LFZUr5Em1Cau2ozZ09/NEn8Dum1puypq+2B1SXbQ1nY4Be61rvTxjxOPy1cRS12e2z2SURdcHITIuq/FoA4vL6rrOK56QwBn/n241eXv/fHs6mBHpRFViEHVsb+8I79QAYgT9w2pECSWFlFlxZuiqBSAz3YVcLQJxbFEJyeGEcwMJyAmO+UVPtltKSJzOZyiTuhAX+woyv/sDpNxZCMkUqKVReYl5MCXiaZdSQ+U0w6MgGLt2S59eD9tC7IKCn7s/zukkanfiusxdLo0SnaYi4gnkTXXLYiQqfLJa3re3kfaodQkkvSOuKQra5OLB4WbBCC5PgrTNZQZ7MbXqymKdqAnAjwZXsU5aRGgGQsQ7e02olpPJ3FzJNJj4ixonwSkIz71qgvpi7RYPoD5ztrLBsBCASHDIfBoPOx7yksmwl8ClLeXnHgW/ENAXxO2GUyENF42ejAEsl+Eq204DSTnOXiHqipS7LmOFtq02bi/OovykbPRsHKFNQ4/dTkXoj68ui9WtjL78Y1mzmNBQyWiKqOETPT3hWBPE/egBRwRLZjDbvJqLdyIP4LwFCwl6UdssgzAAaeNgqjKtEFxqDAGKF0whAHK72MUZBXrApOSRFxXGZnfhKfVc1B6j1uFuGrD8nGwNIL6wBIq/nyUOuBbDqbUbeaiYus230uxWil/U8X9RWZ7cSszmBVm2GVjeqq2TZuqwRtAqAeECwiD6p5/xVgGhQSTd1PAVRyd9QvK1a/r6Xio24kdzS/8jKLF30e3voBXkDUFW5WRObkLFWAOOXjASdvPzU6mY9w6wVYFmk/nSfla0O3IAxYat1mPeGtFaAqgqbrH8EMLFak3sePdCkNU1k/QadtchPhjx3/AAAAABJRU5ErkJggg==";
        var $doc=$(document);
        var $body=$("html body");
        var $head=$("html head");
        var randomCode="yyMM000000";    //属性随机码，年月加六位随机码。用于元素属性后缀，以防止属性名称重复。
        var createHtml=function(){
            var wordTransIconHtml=StringFormat('<div id="wordTrans{0}" class="wordTrans{0}"><div class="wordTransIcon{0}"></div></div>',randomCode,transIconBase64);
            $body.append(StringFormat('<div id="webTrans{0}">',randomCode)+wordTransIconHtml+'</div>');
        };
        var createStyle=function(){
            //尽可能避开csp认证
            GM_xmlhttpRequest({
                method:"get",
                url:"https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@master/jPopBox/dist/jPopBox.min.css",
                onload:function(r){
                    GM_addStyle(r.responseText+".JPopBox-tip-white{width: 482px;max-width: 550px;min-width: 450px;}");
                }
            });
            var s="";
            s+=StringFormat(".wordTrans{0}{background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 1px;border-style: solid;border-color: rgb(220, 220, 220);border-image: initial;border-radius: 5px;padding: 0.5px;position: absolute;display: none}",randomCode);
            s+=StringFormat(".wordTransIcon{0}{background-image: url({1});background-size: 25px;height: 25px;width: 25px;}",randomCode,transIconBase64);
            s+=Panel.CreateStyle();
            GM_addStyle(s);
        };
        var ShowWordTransIcon=function(){
            var $wordTransIcon=$("div#wordTrans"+randomCode);
            var isSelect=false;
            var isPanel=false;
            var isWordTransIcon=false;
            $doc.on({
                "selectionchange":function(e){
                    isSelect=true;
                },
                "mousedown":function(e){
                    var $targetEl=$(e.target);
                    isPanel=$targetEl.parents().is("div.JPopBox-tip-white");
                    isWordTransIcon=$targetEl.parents().is(StringFormat("div#wordTrans{0}",randomCode));
                    //点击翻译图标外域和翻译面板外域时，隐藏图标和翻译面板
                    if(!isWordTransIcon && !isPanel){
                        $wordTransIcon.hide();
                        Trans.Clear();
                        Panel.Destroy();
                    }
                    else {
                        //点击翻译图标，取消鼠标默认事件，防止选中的文本消失
                        if(isWordTransIcon){
                            ClearBubble(e);
                        }
                    }
                },
                "mouseup":function(e){
                    var selectText = window.getSelection().toString().trim();
                    if(!isPanel&&isSelect&&selectText){
                        $wordTransIcon.show().css({
                            left: e.pageX + 'px',
                            top : e.pageY + 12 + 'px'
                        });
                        isSelect=false;
                    }
                }
            });
            $wordTransIcon.click(function(e){
                Trans.Clear();
                Panel.Destroy();
                var selecter=window.getSelection();
                var selectText = selecter.toString().trim();
                GetSettingOptions();
                Trans.transText=selectText;
                Trans.transType="word";
                Trans.transEngine=options.defaulttransengine;//defaultTransEngine;
                Trans.Update();
                Trans.Execute(function(){
                    WordTransPanel.Create($wordTransIcon,randomCode);
                    $wordTransIcon.hide();
                });
            });
        };
        var guid="";
        var RegMenu=function(){
            GM_registerMenuCommand("文本翻译",function(){
                var $body=$("html body");
                $("div#wordTrans"+randomCode).hide();
                Trans.Clear();
                Panel.Destroy();
                GetSettingOptions();
                Trans.transEngine=options.defaulttransengine;//defaultTransEngine;
                Trans.Update();
                TextTransPanel.Create($body,randomCode);
            });
            GM_registerMenuCommand("Google整页翻译",function(){
                if(guid=="") 
                    guid=Guid();
                var cbscript=StringFormat('!function(){!function(){function e(){window.setTimeout(function(){window[t].showBanner(!0)},10)}function n(){return new google.translate.TranslateElement({autoDisplay:!1,floatPosition:0,multilanguagePage:!0,includedLanguages:"zh-CN,zh-TW,en",pageLanguage:"auto"})}var t=(document.documentElement.lang,"TE_{0}"),o="TECB_{0}";if(window[t])e();else if(!window.google||!google.translate||!google.translate.TranslateElement){window[o]||(window[o]=function(){window[t]=n(),e()});var a=document.createElement("script");a.src="https://translate.google.cn/translate_a/element.js?cb="+encodeURIComponent(o)+"&client=tee",document.getElementsByTagName("head")[0].appendChild(a)}}()}();',guid);
                $head.append(StringFormat('<script>{0}</script>',cbscript));
            });
            GM_registerMenuCommand("设置",function(){
                $("div#wordTrans"+randomCode).hide();
                Trans.Clear();
                Panel.Destroy();
                SettingPanel.Create($body,randomCode);
            });
        };
        this.init=function(){
            randomCode=DateFormat(new Date(),"yyMM").toString()+(Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000).toString();
            Trans.RegisterEngine();
            createStyle();
            createHtml();
            ShowWordTransIcon();
            RegMenu();
        };
    };
    var webTrans=new WebTranslate();
    webTrans.init();

}());
