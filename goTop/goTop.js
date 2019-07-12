// ==UserScript==
// @name         返回顶部
// @namespace    https://www.chlung.com/
// @version      0.3
// @description  在网页生成返回顶部按钮，点击按钮即可返回顶部。
// @author       Johnny Li
// @match        *://*/*
// @grant        GM_info
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==

(function() {
    'use strict';
    var TopLink=function(){
        var $ = $ || window.$;
        var $doc=$(document);
        var CreateHtml=function(){
            var topHtml="<div id='gotop' style='position: fixed; bottom: 60px; right: 15px; cursor: pointer; z-index: 999999; display: none; opacity: 0;'>"+
                            "<a id='topLink' class='topLink' title='GoTop'>Top</a>"+
                        "</div>"
            $("html body").append(topHtml);
        };
        var CreateStyle=function(){
            var topStyle="<style>body #gotop #topLink {display: block;width: 40px;height: 40px;overflow: hidden;text-indent: -999em;background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAARVBMVEUAAABwcHBwcHBwcHBvb29wcHBwcHBvb29wcHBwcHBvb29wcHBvb29vb29wcHBwcHBvb29wcHBwcHBwcHBvb29vb29wcHBGBxOeAAAAFXRSTlMAP39fP88vfw+vX+9v39+/7x9vn885opKGAAABnElEQVR4Xo2VjY4CIRCDK7i6/t9f9/0f9Q7JzTBTTOwmSAY+ajPKAljLffsTty7aZBPdvtB0WKwSyIaolhVYjaCPOnMGKL3AsBCM0kLFLZVoZmxz1QPRXNNLmRjLDiae4wwWW0OQUy/MW0Ar6gpyRQjmYCk+KVaCwRY499MS4nZKakpGjMAOL7QbMRjxBtLtMXbwumvat8E/2+TqodgQ6T8nyb1CRxiXPhpEpsaQQxYy2F0OVY4KfRFdDkA1IiOvCOD8MgtDwYnuIyLYUjBmPwNzhiSnWSpM1S4aShb2Ko1IPozxe/doHkFn6Spijz2H+vwP+bqogDLUvjgTCWX0iy3H0h4DPstTP3LDyNU3+WuRtmHIYj11ZG8pG0FDghLih7tXR+gA1SVtwUa5g2IWRkTjUxAHSEOk7Mj06hOLjRxdKBAE0L7ID0aqTH1JNu7CgSvHUkobvsPbTLvvHF/deo54EN2nI56mbM/8TaSCpNPECcZ9e1sdPKGEMHK4QhVYtOrd7dyA8gRgXcRAuuHYaUVTfaSz+4yOGVAB/ALe77YRMP804gAAAABJRU5ErkJggg==') no-repeat center;background-size: 40px 40px;}</style>"
            $("html head").append(topStyle);
        }
        var GoTop=function(){
            var upperLimit = 100;
            var scrollSpeed = 500;
            var fadeSpeed=300;
            var $top = $('#gotop');
            if (getScrollTop() > upperLimit) {
                $top.stop().fadeTo(0, 1);
            }
            $doc.scroll(function () {
                if (getScrollTop() > upperLimit) {
                    $top.stop().fadeTo(fadeSpeed, 1);
                } else {
                    $top.stop().fadeTo(fadeSpeed, 0);
                }
            });
            $('#gotop #topLink').click(function () {
                $('html, body').animate({ scrollTop: 0 }, scrollSpeed); return false;
            });
        }
        var getScrollTop=function() {
            var scrollTop=$doc.scrollTop() || $('html,body').scrollTop();
            return scrollTop;
        }
        this.init=function(){
            CreateHtml();
            CreateStyle();
            GoTop();
        }
    }
    var tl=new TopLink();
    tl.init();
})();