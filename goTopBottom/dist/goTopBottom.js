// ==UserScript==
// @name         返回顶部和底部
// @namespace    https://www.chlung.com/
// @version      1.1.1
// @description  在网页生成返回顶部和底部按钮，点击按钮即可返回顶部或底部。
// @author       Johnny Li
// @license      MIT
// @match        *://*/*
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js
// ==/UserScript==

(function () {
    'use strict';
    var TBLink = function () {
        var $ = $ || window.$;
        var $doc = $(document);
        var CreateHtml = function () {
            var html = '<div id="goTopBottom"><div class="gotop" style="display: none; opacity: 0;"><a class="toplink" title="返回顶部">Top</a></div><div class="gobottom" style="display: none; opacity: 0;"><a class="bottomlink" title="返回底部">Bottom</a></div></div>';
            $("html body").append(html);
            // setTimeout(function () {
            //     var position = GM_getValue("tb_pos");
            //     if (position && position['div']) {
            //         var _position$div = position['div'],
            //             x = _position$div.x,
            //             y = _position$div.y;

            //         $('.draggable').attr('data-x', x).attr('data-y', y).css({
            //             'transform': "translate(" + x + "px, " + y + "px)",
            //             '-webkit-transform': "translate(" + x + "px, " + y + "px)"
            //         });
            //     }
            // }, 100);
        };
        var CreateStyle = function () {
            var style = '#goTopBottom{position:fixed;bottom:75px;right:15px;cursor:pointer;z-index:999999}#goTopBottom .gotop{display:none;opacity:0;margin-bottom:10px}#goTopBottom .gotop .toplink{display:block;width:40px;height:40px;overflow:hidden;text-indent:-999em;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAARVBMVEUAAABwcHBwcHBwcHBvb29wcHBwcHBvb29wcHBwcHBvb29wcHBvb29vb29wcHBwcHBvb29wcHBwcHBwcHBvb29vb29wcHBGBxOeAAAAFXRSTlMAP39fP88vfw+vX+9v39+/7x9vn885opKGAAABnElEQVR4Xo2VjY4CIRCDK7i6/t9f9/0f9Q7JzTBTTOwmSAY+ajPKAljLffsTty7aZBPdvtB0WKwSyIaolhVYjaCPOnMGKL3AsBCM0kLFLZVoZmxz1QPRXNNLmRjLDiae4wwWW0OQUy/MW0Ar6gpyRQjmYCk+KVaCwRY499MS4nZKakpGjMAOL7QbMRjxBtLtMXbwumvat8E/2+TqodgQ6T8nyb1CRxiXPhpEpsaQQxYy2F0OVY4KfRFdDkA1IiOvCOD8MgtDwYnuIyLYUjBmPwNzhiSnWSpM1S4aShb2Ko1IPozxe/doHkFn6Spijz2H+vwP+bqogDLUvjgTCWX0iy3H0h4DPstTP3LDyNU3+WuRtmHIYj11ZG8pG0FDghLih7tXR+gA1SVtwUa5g2IWRkTjUxAHSEOk7Mj06hOLjRxdKBAE0L7ID0aqTH1JNu7CgSvHUkobvsPbTLvvHF/deo54EN2nI56mbM/8TaSCpNPECcZ9e1sdPKGEMHK4QhVYtOrd7dyA8gRgXcRAuuHYaUVTfaSz+4yOGVAB/ALe77YRMP804gAAAABJRU5ErkJggg==) no-repeat center;background-size:40px 40px}#goTopBottom .gobottom{display:none;opacity:0}#goTopBottom .gobottom .bottomlink{display:block;width:40px;height:40px;overflow:hidden;text-indent:-999em;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABFUExURQAAAHBwcHBwcHBwcG9vb3BwcHBwcG9vb3BwcHBwcG9vb3BwcG9vb29vb3BwcHBwcG9vb3BwcHBwcHBwcG9vb29vb3BwcEYHE54AAAAVdFJOUwA/f18/zy9/D69f72/f37/vH2+fzzmikoYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIVSURBVEhLhZaHYsMwCEQVO3s0Xc7/f2oPOATIbvviaAAnNGwnDcyXl7Bo+Vq0lgJft7F4zhLfzl1APzDZBsvhDMklRZrMBVqF1zhgVmur6awZuGFqOq2V/w/eGhvCanB2BluWBBZUhlj0I+sUSQTUslONTRtRFGTrxFo9JjH6aXxN02kCp4mGrpMCE0sidvZ6xkJ2erMun9YdBZB4anqkiuUTCQnJWuBZqqhkYZoUQUk1F4mbu9ckQvJUCT3dH3viNUg7pvYaAuPCNRJ0iySPpfAoUULozkECR5b108+5Ns5FRzV0tr33LbfJNH1Q0BruGXwOdCuLpnaWl70OBua6nCLZ1swQZI1OTBpuXGmudDjjxMCVoQSvE8W2TSKSZDOPKBjq/pDQgtGSxnMEesMMpw+6ButIPsTJlR/kgJrjTToa4WGo0+sio3tgihX1XASTI8+2YuPV5wnn463k5oJRQuKr10oK2493NxnR/GUttIjWrkR5Ku+7/Y54w+p7D8ElE+vDxHMysDM/MEnwv0TGFglzkOihpRvRLdaxLBEGrFNMwMLl6xPTiAi2lhEnYuS1qNE9Ug+xpPwcJEKRMIMuv/rQMwtudDUY1kaJ06cdYdEqoJst/guyClyZu7s92chYQoupI6HzGJ5uhrFOwKC2BX9IWn57RuTY6n35q3Qub1wnEoVYOBz1pvt8sJ/ogqJ8m86t/QAimLYRwPIUvwAAAABJRU5ErkJggg==) no-repeat center;background-size:40px 40px}';
            GM_addStyle(style);
        }
        var GoTB = function () {
            var upperLimit = 100;
            var scrollSpeed = 500;
            var fadeSpeed = 300;
            var $top = $("#goTopBottom .gotop");
            var $bottom = $("#goTopBottom .gobottom");
            if (getScrollTop() > upperLimit) {
                $top.stop().fadeTo(0, 1, function () {
                    $top.show();
                });
            }
            if (getScrollTop() + $(window).height() < $doc.height() - upperLimit) {
                $bottom.stop().fadeTo(0, 1, function () {
                    $bottom.show();
                });
            }
            $doc.scroll(function () {
                if (getScrollTop() > upperLimit) {
                    $top.stop().fadeTo(fadeSpeed, 1, function () {
                        $top.show();
                    });
                } else {
                    $top.stop().fadeTo(fadeSpeed, 0, function () {
                        $top.hide();
                    });
                }
                if (getScrollTop() + $(window).height() < $doc.height() - upperLimit) {
                    $bottom.stop().fadeTo(fadeSpeed, 1, function () {
                        $bottom.show();
                    });
                } else {
                    $bottom.stop().fadeTo(fadeSpeed, 0, function () {
                        $bottom.hide();
                    });
                }
            });
            $("#goTopBottom div a").click(function () {
                var $this = $(this);
                var clsName = $this.attr("class");
                switch (clsName) {
                    case "toplink":
                        $('html, body').animate({
                            scrollTop: 0
                        }, scrollSpeed);
                        break;
                    case "bottomlink":
                        var docHeight = $doc.height();
                        $('html, body').animate({
                            scrollTop: docHeight
                        }, scrollSpeed);
                        break;
                    default:
                        break;
                }
                return false;
            });
        }
        var getScrollTop = function () {
            var scrollTop = $doc.scrollTop() || $('html,body').scrollTop();
            return scrollTop;
        }
        /**
         * 拖拽
         */
        function dragging() {
            var position = GM_getValue("gtb_pos") || {};
            $("#goTopBottom div a").off(".gtb").on({
                "mouseover.gtb": function () {
                    //$(this).css("cursor","move");
                },
                "mousedown.gtb": function (el) {
                    var move = true;
                    var $gtbBox = $("#goTopBottom");
                    var x = el.pageX - $gtbBox.offset().left;
                    var y = el.pageY - $gtbBox.offset().top;
                    $doc.on({
                        "mousemove.gtb": function (docEl) {
                            if (move) {
                                $gtbBox.offset({
                                    left: docEl.pageX - x,
                                    top: docEl.pageY - y
                                });
                            }
                        },
                        "mouseup.gtb": function () {
                            move = false;
                            $doc.off(".gtb");
                        }
                    });
                }
            });
        }
        this.init = function () {
            CreateHtml();
            dragging();
            CreateStyle();
            GoTB();
        }
    }
    var tbl = new TBLink();
    tbl.init();
})();