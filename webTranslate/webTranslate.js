// ==UserScript==
// @name         网页翻译
// @namespace    https://www.chlung.com/
// @version      1.1.1
// @description  支持划词翻译，输入文本翻译，整页翻译。可以自行选择谷歌翻译和有道字典翻译。
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAENklEQVRoQ+2ZTVITQRTH/28qyNIJFxCqnGwNJzCcwHACcelkIZxAPAG4IFkaTyCegHgC4jZjVfACzLBEUvOs7jCx57unZ6JSRZZJ9+v3e+/1++gQHviHHrj+eAT41x4s9YA99F5qK3nb+h4c7QTa6xtYmAuwNfLeg3Fc5QxmBGy1doO3O1dV9tVZmwmwdeYdg/DeTDB/vnY7B2Z7q+/KBhh6XF3UcgeDr3y3s2O6v+q+FIB9NutaRJdVBanrQ+bdYNCZ1pGhuzcNMPJ6FuNCV0DWuhA4ClzntI4M3b1rARBhRERjXSWK1oUhfy3y5loAmlBclcHAue86+1lyHwTAfXb4cD1wUmm9EgAzfhLoPLT4fGUNRpeAPgH6Bc/ARcw89Qed3eRWLQAGbhg4LrqY9sjrUYgxEZ7FDmH6GAPWUZ7JJvBh0ijXrpPStxRAKs/c00mLAiKewcyLmn0yt63Nha/yGgGEoP3Afb4KGSEYT+5eWxbZQniUJUT9INAFEeT3RXGr4wSxpj30JqoXKgMw8M13nV50oH02OyDQSUxJWX55zKB+8vu8uP1rAKr17dF8m8LFZUr5Em1Cau2ozZ09/NEn8Dum1puypq+2B1SXbQ1nY4Be61rvTxjxOPy1cRS12e2z2SURdcHITIuq/FoA4vL6rrOK56QwBn/n241eXv/fHs6mBHpRFViEHVsb+8I79QAYgT9w2pECSWFlFlxZuiqBSAz3YVcLQJxbFEJyeGEcwMJyAmO+UVPtltKSJzOZyiTuhAX+woyv/sDpNxZCMkUqKVReYl5MCXiaZdSQ+U0w6MgGLt2S59eD9tC7IKCn7s/zukkanfiusxdLo0SnaYi4gnkTXXLYiQqfLJa3re3kfaodQkkvSOuKQra5OLB4WbBCC5PgrTNZQZ7MbXqymKdqAnAjwZXsU5aRGgGQsQ7e02olpPJ3FzJNJj4ixonwSkIz71qgvpi7RYPoD5ztrLBsBCASHDIfBoPOx7yksmwl8ClLeXnHgW/ENAXxO2GUyENF42ejAEsl+Eq204DSTnOXiHqipS7LmOFtq02bi/OovykbPRsHKFNQ4/dTkXoj68ui9WtjL78Y1mzmNBQyWiKqOETPT3hWBPE/egBRwRLZjDbvJqLdyIP4LwFCwl6UdssgzAAaeNgqjKtEFxqDAGKF0whAHK72MUZBXrApOSRFxXGZnfhKfVc1B6j1uFuGrD8nGwNIL6wBIq/nyUOuBbDqbUbeaiYus230uxWil/U8X9RWZ7cSszmBVm2GVjeqq2TZuqwRtAqAeECwiD6p5/xVgGhQSTd1PAVRyd9QvK1a/r6Xio24kdzS/8jKLF30e3voBXkDUFW5WRObkLFWAOOXjASdvPzU6mY9w6wVYFmk/nSfla0O3IAxYat1mPeGtFaAqgqbrH8EMLFak3sePdCkNU1k/QadtchPhjx3/AAAAABJRU5ErkJggg==
// @author       Johnny Li
// @match        *://*/*
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      translate.google.cn
// @connect      fanyi.youdao.com
// @require      https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @require      https://cdn.bootcss.com/twitter-bootstrap/3.3.7/js/bootstrap.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var WebTranslate=function(){
        var transIconBase64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAENklEQVRoQ+2ZTVITQRTH/28qyNIJFxCqnGwNJzCcwHACcelkIZxAPAG4IFkaTyCegHgC4jZjVfACzLBEUvOs7jCx57unZ6JSRZZJ9+v3e+/1++gQHviHHrj+eAT41x4s9YA99F5qK3nb+h4c7QTa6xtYmAuwNfLeg3Fc5QxmBGy1doO3O1dV9tVZmwmwdeYdg/DeTDB/vnY7B2Z7q+/KBhh6XF3UcgeDr3y3s2O6v+q+FIB9NutaRJdVBanrQ+bdYNCZ1pGhuzcNMPJ6FuNCV0DWuhA4ClzntI4M3b1rARBhRERjXSWK1oUhfy3y5loAmlBclcHAue86+1lyHwTAfXb4cD1wUmm9EgAzfhLoPLT4fGUNRpeAPgH6Bc/ARcw89Qed3eRWLQAGbhg4LrqY9sjrUYgxEZ7FDmH6GAPWUZ7JJvBh0ijXrpPStxRAKs/c00mLAiKewcyLmn0yt63Nha/yGgGEoP3Afb4KGSEYT+5eWxbZQniUJUT9INAFEeT3RXGr4wSxpj30JqoXKgMw8M13nV50oH02OyDQSUxJWX55zKB+8vu8uP1rAKr17dF8m8LFZUr5Em1Cau2ozZ09/NEn8Dum1puypq+2B1SXbQ1nY4Be61rvTxjxOPy1cRS12e2z2SURdcHITIuq/FoA4vL6rrOK56QwBn/n241eXv/fHs6mBHpRFViEHVsb+8I79QAYgT9w2pECSWFlFlxZuiqBSAz3YVcLQJxbFEJyeGEcwMJyAmO+UVPtltKSJzOZyiTuhAX+woyv/sDpNxZCMkUqKVReYl5MCXiaZdSQ+U0w6MgGLt2S59eD9tC7IKCn7s/zukkanfiusxdLo0SnaYi4gnkTXXLYiQqfLJa3re3kfaodQkkvSOuKQra5OLB4WbBCC5PgrTNZQZ7MbXqymKdqAnAjwZXsU5aRGgGQsQ7e02olpPJ3FzJNJj4ixonwSkIz71qgvpi7RYPoD5ztrLBsBCASHDIfBoPOx7yksmwl8ClLeXnHgW/ENAXxO2GUyENF42ejAEsl+Eq204DSTnOXiHqipS7LmOFtq02bi/OovykbPRsHKFNQ4/dTkXoj68ui9WtjL78Y1mzmNBQyWiKqOETPT3hWBPE/egBRwRLZjDbvJqLdyIP4LwFCwl6UdssgzAAaeNgqjKtEFxqDAGKF0whAHK72MUZBXrApOSRFxXGZnfhKfVc1B6j1uFuGrD8nGwNIL6wBIq/nyUOuBbDqbUbeaiYus230uxWil/U8X9RWZ7cSszmBVm2GVjeqq2TZuqwRtAqAeECwiD6p5/xVgGhQSTd1PAVRyd9QvK1a/r6Xio24kdzS/8jKLF30e3voBXkDUFW5WRObkLFWAOOXjASdvPzU6mY9w6wVYFmk/nSfla0O3IAxYat1mPeGtFaAqgqbrH8EMLFak3sePdCkNU1k/QadtchPhjx3/AAAAABJRU5ErkJggg==";
        var $doc=$(document);
        var $body=$("html body");
        var defaultTransEngine="yd";    //默认翻译引擎
        var randomCode="yyMM000000";    //属性随机码，年月加六位随机码。用于元素属性后缀，以防止属性名称重复。
        var createHtml=function(){
            var wordTransIconHtml=StringFormat('<div id="wordTrans{0}" class="wordTrans{0}"><div class="wordTransIcon{0}"></div></div>',randomCode,transIconBase64);

            $body.append(StringFormat('<div id="webTrans{0}">',randomCode)+wordTransIconHtml+'</div>');
        }
        var createStyle=function(){
            GM_addStyle('.popover {position: absolute;top: 0;left: 0;z-index: 1060;display: none;max-width: 276px;padding: 1px;font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 14px;font-style: normal;font-weight: normal;line-height: 1.42857143;text-align: left;text-align: start;text-decoration: none;text-shadow: none;text-transform: none;letter-spacing: normal;word-break: normal;word-spacing: normal;word-wrap: normal;white-space: normal;background-color: #fff;-webkit-background-clip: padding-box;        background-clip: padding-box;border: 1px solid #ccc;border: 1px solid rgba(0, 0, 0, .2);border-radius: 6px;-webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);        box-shadow: 0 5px 10px rgba(0, 0, 0, .2);line-break: auto;}.popover.top {  margin-top: -10px;}.popover.right {  margin-left: 10px;}.popover.bottom {  margin-top: 10px;}.popover.left {  margin-left: -10px;}.popover-title {  padding: 8px 14px;  margin: 0;  font-size: 14px;  background-color: #f7f7f7;  border-bottom: 1px solid #ebebeb;  border-radius: 5px 5px 0 0;}.popover-content {  padding: 9px 14px;}.popover > .arrow,.popover > .arrow:after {  position: absolute;  display: block;  width: 0;  height: 0;  border-color: transparent;  border-style: solid;}.popover > .arrow {  border-width: 11px;}.popover > .arrow:after {  content: "";  border-width: 10px;}.popover.top > .arrow {  bottom: -11px;  left: 50%;  margin-left: -11px;  border-top-color: #999;  border-top-color: rgba(0, 0, 0, .25);  border-bottom-width: 0;}.popover.top > .arrow:after {  bottom: 1px;  margin-left: -10px;  content: " ";  border-top-color: #fff;  border-bottom-width: 0;}.popover.right > .arrow {  top: 50%;  left: -11px;  margin-top: -11px;  border-right-color: #999;  border-right-color: rgba(0, 0, 0, .25);  border-left-width: 0;}.popover.right > .arrow:after {  bottom: -10px;  left: 1px;  content: " ";  border-right-color: #fff;  border-left-width: 0;}.popover.bottom > .arrow {  top: -11px;  left: 50%;  margin-left: -11px;  border-top-width: 0;  border-bottom-color: #999;  border-bottom-color: rgba(0, 0, 0, .25);}.popover.bottom > .arrow:after {  top: 1px;  margin-left: -10px;  content: " ";  border-top-width: 0;  border-bottom-color: #fff;}.popover.left > .arrow {  top: 50%;  right: -11px;  margin-top: -11px;  border-right-width: 0;  border-left-color: #999;  border-left-color: rgba(0, 0, 0, .25);}.popover.left > .arrow:after {  right: 1px;  bottom: -10px;  content: " ";  border-right-width: 0;  border-left-color: #fff;}');
            var s="";
            s+=StringFormat(".wordTrans{0}{background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 1px;border-style: solid;border-color: rgb(220, 220, 220);border-image: initial;border-radius: 5px;padding: 0.5px;position: absolute;display: none}",randomCode);
            s+=StringFormat(".wordTransIcon{0}{background-image: url({1});background-size: 25px;height: 25px;width: 25px;}",randomCode,transIconBase64);
            s+=StringFormat("#panelBody{0}>div input,#panelBody{0}>div select{padding: 3px; margin: 0; background: #fff; font-size: 14px; border: 1px solid #a9a9a9; color:black; }",randomCode);
            s+=StringFormat("#panelBody{0}>div:first-child{padding-bottom: 5px;height:30px}",randomCode);
            s+=StringFormat("#panelBody{0}>div:last-child hr{border: 1px inset #eeeeee;background: none;height: 0px;margin: 0px;}",randomCode);
            GM_addStyle(s);
        }
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
                    isPanel=$targetEl.parents().is(StringFormat("div[data-id='transPanel{0}']",randomCode));
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
                            clearBubble(e);
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
                var rang = selecter.getRangeAt(0);
                var temp = StringFormat('<span id="transText{0}">{1}</span>',randomCode,selectText);
                //rang.surroundContents($(temp)[0]);
                Trans.transText=selectText;
                Trans.transType="word";
                Trans.transEngine=defaultTransEngine;
                Trans.transTargetLang=Trans.transEngine=="yd"?"ZH-CHS":Trans.transEngine=="ge"?"ZH-CN":"";
                Trans.transOrigLang=Trans.transEngine=="yd"?"AUTO":Trans.transEngine=="ge"?"auto":"auto";
                Trans.Execute(function(transResultJson){
                    WordTransPanel.Create($wordTransIcon,transResultJson);
                });
            });
        }
        var RegMenu=function(){
            GM_registerMenuCommand("文本翻译",function(){
                var $body=$("html body");
                $("div#wordTrans"+randomCode).hide();
                Trans.Clear();
                Panel.Destroy();
                Trans.transEngine=defaultTransEngine;
                TextTransPanel.Create($body);
            });
        }
        //面板
        var Panel={
            popoverEl:{},
            Create:function(title,placement,content,shownFn){
                var self=this;
                $(self.popoverEl).popover({
                    title:title,
                    placement:placement,
                    trigger:"manual",
                    html: "true",
                    template:StringFormat('<div data-id="transPanel{0}" class="transPanel popover" role="tooltip" style="max-width: 550px;min-width: 450px;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',randomCode),
                    content: function () {
                        return StringFormat('<div id="panelBody{0}">{1}</div>',randomCode,content);
                    }
                });
                $(self.popoverEl).popover("show");
                $(self.popoverEl).on("shown.bs.popover",function(){
                    var $panel=$(StringFormat("div[data-id='transPanel{0}']",randomCode));
                    typeof shownFn === 'function' && shownFn($panel);
                })
            },
            Update:function(Fn){
                var $panel=$(StringFormat("div[data-id='transPanel{0}']",randomCode));
                Fn($panel);    
            },
            Destroy:function(){
                $(this.popoverEl).popover("destroy");

            }
        }
        //划词翻译面板
        var WordTransPanel={
            Create:function(popoverEl,resultJson){
                var self=this;
                var html=this.GetTransContHtml(resultJson);
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
                
                Panel.popoverEl=popoverEl;
                Panel.Create("","auto bottom",wordTransPanelHtml,function($panel){
                    //目标语言
                    $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).change(function(e){
                        Trans.transTargetLang=$(this).find("option:selected").val();
                        Trans.Execute(function(transResultJson){
                            self.Update(transResultJson);
                        })
                    });
                    //翻译引擎
                    $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(0)",randomCode)).change(function(e){
                        Trans.transEngine=$(this).find("option:selected").val();
                        Trans.transTargetLang=Trans.transEngine=="yd"?"ZH-CHS":Trans.transEngine=="ge"?"ZH-CN":"";
                        Trans.transOrigLang=Trans.transEngine=="yd"?"AUTO":Trans.transEngine=="ge"?"auto":"";
                        Trans.Execute(function(transResultJson){
                            self.Update(transResultJson);
                        });
                    });
                })
            },
            Update:function(resultJson){
                var self=this;
                Panel.Update(function($panel){
                    var html=self.GetTransContHtml(resultJson);
                    $panel.find(StringFormat("#panelBody{0} div:eq(0) input:eq(0)",randomCode)).val("").val(html.origLangName);
                    $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).html("").html(html.langListHtml);
                    $panel.find(StringFormat("#panelBody{0} div:eq(1)",randomCode)).html("").html(html.transHtml);
                });
            },
            GetTransContHtml:function(resultJson){
                var transObj={};
                var langListHtml=[];
                var langList={};
                var origLang="";
                var transContHtml="";
                switch (Trans.transEngine) {
                    case "yd":
                        langList=Trans.ydLangList;
                        origLang=resultJson.origLang.split("2")[0];
                        break;
                    case "ge":
                    default:
                        langList=Trans.geLangList;
                        origLang=resultJson.origLang;
                        break;
                }
                if(resultJson.trans.length>0 && resultJson.orig.length>0)
                {
                    var transHtml=[];
                    transHtml.push('<div style="padding-top: 5px;"><ul style="list-style: none;margin: 0;padding: 0;">');
                    for (var i = 0; i < resultJson.trans.length; i++) {
                        var transtxt = resultJson.trans[i];
                        transHtml.push(StringFormat('<li style="list-style: none;"><span>{0}</span></li>',transtxt))
                    }
                    transHtml.push("</ul></div>");

                    var origHtml=[];
                    origHtml.push('<div style="padding-bottom: 5px;"><ul style="list-style: none;margin: 0;padding: 0;">');
                    for (var j = 0; j < resultJson.orig.length; j++) {
                        var origtxt = resultJson.orig[j];
                        origHtml.push(StringFormat('<li style="list-style: none;"><span>{0}</span></li>',origtxt))
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
        }
        //文本翻译面板
        var TextTransPanel={
            Create:function(popoverEl){
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
                Panel.popoverEl=popoverEl;
                Panel.Create("文本翻译","auto bottom",TextTransPanelHtml,function($panel){
                    $panel.children("div.arrow").remove();
                    $panel.css({
                        position: "fixed",
                        top:"20px"
                    });
                    //翻译引擎
                    $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(0)",randomCode)).change(function(e){
                        Trans.transEngine=$(this).find("option:selected").val();
                        Trans.transTargetLang=Trans.transEngine=="yd"?"ZH-CHS":Trans.transEngine=="ge"?"ZH-CN":"";
                        Trans.transOrigLang=Trans.transEngine=="yd"?"AUTO":Trans.transEngine=="ge"?"auto":"auto";
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
                    $panel.find("div:eq(1) div:eq(1) div:eq(0) button:eq(0)").click(function(e){
                        var refTransText=$.trim($panel.find("div:eq(1) div:eq(1) div:eq(0) input:eq(0)").val());
                        if(refTransText==""){
                            alert("请输入翻译内容!");
                            return;
                        }
                        Trans.transText=refTransText;
                        Trans.Execute(function(transResultJson){
                            Panel.Update(function($panel){
                                var html=self.GetHtml(transResultJson);
                                //源语言
                                $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).html(html.origLangListHtml);
                                //翻译内容
                                $panel.find(StringFormat("div:eq(1) div:eq(1) div:eq(1)",randomCode)).html(html.transHtml);
                            });
                        });
                    });
                });
            },
            GetHtml:function(resultJson){
                var langList=[];
                var origLangListHtml=[];
                var targetLangListHtml=[];
                var returnHtml={};
                var transHtml=[];
                var origLang="";
                switch (Trans.transEngine) {
                    case "yd":
                        langList=Trans.ydLangList;
                        origLang=resultJson && resultJson.trans.length>0 && resultJson.orig.length>0 && resultJson.origLang.split("2")[0];
                        break;
                    case "ge":
                    default:
                        langList=Trans.geLangList;
                        origLang=resultJson && resultJson.trans.length>0 && resultJson.orig.length>0 && resultJson.origLang;
                        break;
                }
                if(resultJson && resultJson.trans.length>0 && resultJson.orig.length>0)
                {
                    transHtml.push('<span>');
                    for (var i = 0; i < resultJson.trans.length; i++) {
                        var transtxt = resultJson.trans[i];
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
        }
        var Trans={
            ydLangList:{"AUTO":"自动检测","zh-CHS":"中文","en":"英文","ja":"日文","ko":"韩文","fr":"法文","es":"西班牙文","pt":"葡萄牙文","it":"意大利文","ru":"俄文","vi":"越南文","de":"德文","ar":"阿拉伯文","id":"印尼文"},
            geLangList:{"auto":"自动检测","zh-CN":"中文简体","zh-TW":"中文繁体","en":"英文","ja":"日文","ko":"韩文","fr":"法文","es":"西班牙文","pt":"葡萄牙文","it":"意大利文","ru":"俄文","vi":"越南文","de":"德文","ar":"阿拉伯文","id":"印尼文"},
            transEngineList:{"ge":"谷歌","yd":"有道"},
            transEngine:"",             //当前翻译引擎。ge(谷歌)/yd(有道)
            transTargetLang:"",         //目标语言。
            transOrigLang:"",           //源语言
            transType:"word",           //翻译类型。word(划词翻译)/text(输入文本翻译)/page(整页翻译)
            transText:"",               //被翻译内容
            Execute:function(h_onloadfn){
                var self=this;
                var h_url="",h_method="GET",h_headers={},h_data="";
                switch (self.transEngine) {
                    case "yd":
                        var youdaoTransApi="http://fanyi.youdao.com/translate_o?client=fanyideskweb&keyfrom=fanyi.web&version=2.1&doctype=json";
                        var tempsalt="" + (new Date).getTime()+parseInt(10 * Math.random(), 10);
                        var tempsign=$.md5("fanyideskweb" + self.transText + tempsalt + "n%A-rKaT5fb[Gy?;N5@Tj");
                        h_url=youdaoTransApi;
                        h_method="POST";
                        h_headers={
                            "Content-Type":"application/x-www-form-urlencoded",
                            "Referer": "http://fanyi.youdao.com/"
                        }
                        h_data=StringFormat("from={0}&to={1}&salt={2}&sign={3}&i={4}",self.transOrigLang,self.transTargetLang,tempsalt,tempsign,self.transText);
                        break;
                    case "ge":
                    default:
                        var googleTransApi=StringFormat("https://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&sl={1}&tl={0}&hl=zh-CN",self.transTargetLang,self.transOrigLang);
                        h_url=googleTransApi+"&q="+encodeURIComponent(self.transText);
                        break;
                }
                GM_xmlhttpRequest({
                    method: h_method,
                    url:h_url,
                    headers:h_headers,
                    data:h_data,
                    onload:function(r){
                        setTimeout(function(){
                            var transResultJson=self.ParseTransData(r.responseText);
                            h_onloadfn(transResultJson);
                        },300);
                    },
                    onerror:function(e){
                        console.error(e);
                    }
                });
            },
            Clear:function(){
                this.transEngine="",                //当前翻译引擎。ge(谷歌)/yd(有道)
                this.transTargetLang="",            //目标语言。
                this.transOrigLang="",              //源语言
                this.transText=""                   //被翻译内容
            },
            ParseTransData:function(responseText){
                var transResultJson={};
                var data= JSON.parse(responseText);
                var trans=[];
                var origs=[];
                var src="";
                switch (this.transEngine) {
                    case "yd":
                        if(data.errorCode==0){
                            for (var j = 0; j < data.translateResult.length; j++) {
                                var ydTransCont = data.translateResult[j];
                                var ydtgt="";
                                var ydsrc="";
                                for (var k = 0; k < ydTransCont.length; k++) {
                                    var ydcont = ydTransCont[k];
                                    ydtgt+=ydcont.tgt;
                                    ydsrc+=ydcont.src;
                                }
                                trans.push(ydtgt);
                                origs.push(ydsrc);
                            }
                            src=data.type;
                        }
                        break;
                    case "ge":
                    default:
                        for (var i = 0; i < data.sentences.length; i++) {
                            var getransCont = data.sentences[i];
                            trans.push(getransCont.trans);
                            origs.push(getransCont.orig);
                        }
                        src=data.src;
                        break;
                }
                transResultJson.trans=trans;
                transResultJson.orig=origs;
                transResultJson.origLang=src;
                return transResultJson;
            }
        }
        var StringFormat=function(formatStr){
            var args=arguments;
            return formatStr.replace(/\{(\d+)\}/g, function(m, i){
                i=parseInt(i);
                return args[i+1];
            });
        }
        var clearBubble=function (e) {
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
        var DateFormat=function(date,formatStr){
            var o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds(),                 //秒
                "q+" : Math.floor((date.getMonth()+3)/3), //季度
                "S"  : date.getMilliseconds()             //毫秒
              };
              if(/(y+)/.test(formatStr)){
                formatStr=formatStr.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
              }
              for(var k in o){
                if(new RegExp("("+ k +")").test(formatStr)){
                  formatStr = formatStr.replace(
                    RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
              }
              return formatStr;
        }
        this.init=function(){
            randomCode=DateFormat(new Date(),"yyMM").toString()+(Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000).toString();
            createStyle();
            createHtml();
            ShowWordTransIcon();
            RegMenu();
        }
    }
    var webTrans=new WebTranslate();
    webTrans.init();
})();