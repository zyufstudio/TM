// ==UserScript==
// @name         网页翻译
// @namespace    https://www.chlung.com/
// @version      1.1
// @description  支持划词翻译，输入文本翻译，整页翻译。可以自行选择谷歌翻译和有道字典翻译。
// @author       Johnny Li
// @match        *://*/*
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var WebTranslate=function(){
        var $doc=$(document);
        var $body=$("html body");
        var randomCode="0000";  //四位随机码，用于元素属性后缀，以防止属性名称重复。
        var createHtml=function(){
            var wordTransIconHtml='<div id="wordTrans{0}" style="width:24px;height:24px;background-color: rgb(245, 245, 245);box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 1px;border-style: solid;border-color: rgb(220, 220, 220);border-image: initial;border-radius: 5px;padding: 3px;position: absolute;">翻译</div>'.formatString(randomCode);
            $body.append(wordTransIconHtml);
        }
        var createStyle=function(){

        }
        var ShowWordTransIcon=function(){
            $doc.on({
                "mouseup":function(e){
                    var selectText = window.getSelection().toString().trim();
                    var $wordTransIcon=$("#wordTrans"+randomCode);
                    if(selectText){
                        $wordTransIcon.css({
                            left: e.pageX + 'px',
                            top : e.pageY + 12 + 'px'
                        });
                    }
                }
            });
        }
        this.init=function(){
            randomCode=Math.floor(Math.random() * (9999 - 1000 + 1) ) + 1000;
            createStyle();
            createHtml();
            ShowWordTransIcon();
        }
    }
    /**
     * 字符串模板格式化
     * @example 
     * "abc{0}e{1}fg".formatString(1,2) 输出 "abc1e2fg"
     * @returns {string}
     */
    if (typeof String.prototype['formatString'] == 'undefined') {
        String.prototype.formatString =function () {
            var args = arguments;
            return this.replace(/\{(\d+)\}/g, function(m, i){
                return args[i];
            });
        }
    }
    var webTrans=new WebTranslate();
    webTrans.init();
})();