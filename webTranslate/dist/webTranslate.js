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

    /**
     * 配置参数
     */
    var options={
        //默认翻译引擎
        defaulttransengine:{text:"默认翻译引擎",value:"yd"}
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
                    options[key].value= optionsData[key].value;   
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

    var Trans={
        transEngineList:{"ge":"谷歌","yd":"有道"},
        transEngine:"",             //当前翻译引擎。ge(谷歌)/yd(有道)
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

            switch (this.transEngine) {
                case "yd":
                    youdaoTrans.Execute(h_onloadfn);
                    break;
                case "ge":
                    googleTrans.Execute(h_onloadfn);
            }
        },
        GetLangList:function(){
            var langList={};
            switch (this.transEngine) {
                case "yd":
                    langList=youdaoTrans.langList;
                    break;
                case "ge":
                    langList=googleTrans.langList;
            }
            return langList;
        },
        Update:function(){
            var transTargetLang,transOrigLang;
            switch (this.transEngine) {
                case "yd":
                    transTargetLang="ZH-CHS";
                    transOrigLang="AUTO";
                    break;
                case "ge":
                    transTargetLang="ZH-CN";
                    transOrigLang="auto";
                    break;
                default:
                    transTargetLang="";
                    transOrigLang="auto";
                    break;
            }
            Trans.transTargetLang=transTargetLang;
            Trans.transOrigLang=transOrigLang;
        },
        Clear:function(){
            this.transEngine="",                //当前翻译引擎。ge(谷歌)/yd(有道)
            this.transTargetLang="",            //目标语言。
            this.transOrigLang="",              //源语言
            this.transText="";                   //被翻译内容
            this.transResult.trans=[];
            this.transResult.orig=[];
            this.transResult.origLang="";
        },
        Init:function(){
            var transEngineListObj={};
            transEngineListObj[googleTrans.code]=googleTrans.codeText;
            transEngineListObj[youdaoTrans.code]=youdaoTrans.codeText;
            this.transEngineListObj=transEngineListObj;
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
            $(this.popBoxEl).jPopBox("hideDelayed");
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
                    var v = Trans.transEngineList[k];
                    var selectOption="";
                    if(Trans.transEngine==k){

                        selectOption='selected="selected"';
                    }
                    transEngineOptionsHtml+=StringFormat('<option value="{0}" {2}>{1}</option>',k,v,selectOption);
                }
            }
            var TextTransPanelHtml=StringFormat('<div style="padding-bottom: 5px;">翻译引擎：<select>{2}</select>&nbsp;&nbsp;&nbsp;&nbsp;翻译语言：<select>{4}</select> &#x21E8; <select>{3}</select></div>'+
                '<div style="word-wrap:break-word">'+
                    '<div style="padding-bottom: 5px;"><input value="{5}" style="width:310px"/> <button style="width:46px; height:26px; cursor: pointer;overflow: visible;color: inherit;margin: 0;padding: 1px 7px;background-color: #dddddd;border: 2px outset #dddddd;text-align: center;display: inline-block;font-size: 14px; font-weight: 400; ">翻译</button></div><hr/>'+
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
                $panel.find(StringFormat("#panelBody{0} div:eq(1) div:eq(0) button:eq(0)",randomCode)).click(function(e){
                    var refTransText=$.trim($panel.find(StringFormat("#panelBody{0} div:eq(1) div:eq(0) input:eq(0)",randomCode)).val());
                    if(refTransText==""){
                        alert("请输入翻译内容!");
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
            else{
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
                    var v = Trans.transEngineList[k];
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
            Panel.Create("","auto bottom",false,wordTransPanelHtml,function($panel){
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
            else{
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
        Create:function(popBoxEl,randomCode){
            var self=this;
            var settingHtml=[];
            settingHtml.push('<div style="padding-left: 15px;display: inline-block;">');

                settingHtml.push('<div style="padding-bottom: 30px; max-width: 600px;">');
                    settingHtml.push('<div style="font-size: 14px; padding-bottom: 3px;">默认翻译引擎：</div>');
                    settingHtml.push(StringFormat('<div style="padding-bottom: 3px; margin-left: 10px;"><label style="font-size: 14px; cursor: pointer;"><input type="radio" name="transEngine{0}" style="cursor: pointer;" value="yd">有道</label></div>',randomCode));
                    settingHtml.push(StringFormat('<div style="padding-bottom: 0px; margin-left: 10px;"><label style="font-size: 14px; cursor: pointer;"><input type="radio" name="transEngine{0}" style="cursor: pointer;" value="ge">谷歌</label></div>',randomCode));
                settingHtml.push('</div>');

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
                    options.defaulttransengine.value=defaultTransEngine;
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
                $panel.find(StringFormat("#panelBody{0} input[name='transEngine{0}'][value='{1}']",randomCode,options.defaulttransengine.value)).prop("checked",true);
            });
        }
    };

    var $$1 = $$1 || window.$;
        var WebTranslate=function(){
            var transIconBase64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAENklEQVRoQ+2ZTVITQRTH/28qyNIJFxCqnGwNJzCcwHACcelkIZxAPAG4IFkaTyCegHgC4jZjVfACzLBEUvOs7jCx57unZ6JSRZZJ9+v3e+/1++gQHviHHrj+eAT41x4s9YA99F5qK3nb+h4c7QTa6xtYmAuwNfLeg3Fc5QxmBGy1doO3O1dV9tVZmwmwdeYdg/DeTDB/vnY7B2Z7q+/KBhh6XF3UcgeDr3y3s2O6v+q+FIB9NutaRJdVBanrQ+bdYNCZ1pGhuzcNMPJ6FuNCV0DWuhA4ClzntI4M3b1rARBhRERjXSWK1oUhfy3y5loAmlBclcHAue86+1lyHwTAfXb4cD1wUmm9EgAzfhLoPLT4fGUNRpeAPgH6Bc/ARcw89Qed3eRWLQAGbhg4LrqY9sjrUYgxEZ7FDmH6GAPWUZ7JJvBh0ijXrpPStxRAKs/c00mLAiKewcyLmn0yt63Nha/yGgGEoP3Afb4KGSEYT+5eWxbZQniUJUT9INAFEeT3RXGr4wSxpj30JqoXKgMw8M13nV50oH02OyDQSUxJWX55zKB+8vu8uP1rAKr17dF8m8LFZUr5Em1Cau2ozZ09/NEn8Dum1puypq+2B1SXbQ1nY4Be61rvTxjxOPy1cRS12e2z2SURdcHITIuq/FoA4vL6rrOK56QwBn/n241eXv/fHs6mBHpRFViEHVsb+8I79QAYgT9w2pECSWFlFlxZuiqBSAz3YVcLQJxbFEJyeGEcwMJyAmO+UVPtltKSJzOZyiTuhAX+woyv/sDpNxZCMkUqKVReYl5MCXiaZdSQ+U0w6MgGLt2S59eD9tC7IKCn7s/zukkanfiusxdLo0SnaYi4gnkTXXLYiQqfLJa3re3kfaodQkkvSOuKQra5OLB4WbBCC5PgrTNZQZ7MbXqymKdqAnAjwZXsU5aRGgGQsQ7e02olpPJ3FzJNJj4ixonwSkIz71qgvpi7RYPoD5ztrLBsBCASHDIfBoPOx7yksmwl8ClLeXnHgW/ENAXxO2GUyENF42ejAEsl+Eq204DSTnOXiHqipS7LmOFtq02bi/OovykbPRsHKFNQ4/dTkXoj68ui9WtjL78Y1mzmNBQyWiKqOETPT3hWBPE/egBRwRLZjDbvJqLdyIP4LwFCwl6UdssgzAAaeNgqjKtEFxqDAGKF0whAHK72MUZBXrApOSRFxXGZnfhKfVc1B6j1uFuGrD8nGwNIL6wBIq/nyUOuBbDqbUbeaiYus230uxWil/U8X9RWZ7cSszmBVm2GVjeqq2TZuqwRtAqAeECwiD6p5/xVgGhQSTd1PAVRyd9QvK1a/r6Xio24kdzS/8jKLF30e3voBXkDUFW5WRObkLFWAOOXjASdvPzU6mY9w6wVYFmk/nSfla0O3IAxYat1mPeGtFaAqgqbrH8EMLFak3sePdCkNU1k/QadtchPhjx3/AAAAABJRU5ErkJggg==";
            var $doc=$$1(document);
            var $body=$$1("html body");
            var $head=$$1("html head");
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
                        GM_addStyle(r.responseText+".JPopBox-tip-white{max-width: 550px;min-width: 450px;}");
                    }
                });
                var s="";
                s+=StringFormat(".wordTrans{0}{background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 1px;border-style: solid;border-color: rgb(220, 220, 220);border-image: initial;border-radius: 5px;padding: 0.5px;position: absolute;display: none}",randomCode);
                s+=StringFormat(".wordTransIcon{0}{background-image: url({1});background-size: 25px;height: 25px;width: 25px;}",randomCode,transIconBase64);
                s+=Panel.CreateStyle();
                GM_addStyle(s);
            };
            var ShowWordTransIcon=function(){
                var $wordTransIcon=$$1("div#wordTrans"+randomCode);
                var isSelect=false;
                var isPanel=false;
                var isWordTransIcon=false;
                $doc.on({
                    "selectionchange":function(e){
                        isSelect=true;
                    },
                    "mousedown":function(e){
                        var $targetEl=$$1(e.target);
                        isPanel=$targetEl.parents().is("div.JPopBox-tip-white");
                        isWordTransIcon=$targetEl.parents().is(StringFormat("div#wordTrans{0}",randomCode));
                        //点击翻译图标外域和翻译面板外域时，隐藏图标和翻译面板
                        if(!isWordTransIcon && !isPanel){
                            $wordTransIcon.hide();
                            Trans.Clear();
                            Panel.Destroy();
                        }
                        else{
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
                    var selecter=window.getSelection();
                    var selectText = selecter.toString().trim();
                    GetSettingOptions();
                    Trans.transText=selectText;
                    Trans.transType="word";
                    Trans.transEngine=options.defaulttransengine.value;//defaultTransEngine;
                    Trans.Update();
                    Trans.Execute(function(){
                        WordTransPanel.Create($wordTransIcon,randomCode);
                    });
                });
            };
            var guid="";
            var RegMenu=function(){
                GM_registerMenuCommand("文本翻译",function(){
                    var $body=$$1("html body");
                    $$1("div#wordTrans"+randomCode).hide();
                    Trans.Clear();
                    Panel.Destroy();
                    GetSettingOptions();
                    Trans.transEngine=options.defaulttransengine.value;//defaultTransEngine;
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
                    SettingPanel.Create($body,randomCode);
                });
            };
            this.init=function(){
                randomCode=DateFormat(new Date(),"yyMM").toString()+(Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000).toString();
                createStyle();
                createHtml();
                ShowWordTransIcon();
                RegMenu();
            };
        };
        var webTrans=new WebTranslate();
        webTrans.init();

}());
