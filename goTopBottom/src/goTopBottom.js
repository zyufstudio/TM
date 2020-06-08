// ==UserScript==
// @name         返回顶部和底部
// @version      1.1.2
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
        var $win=$(window);
        var CreateHtml = function () {
            var html = 'rep_html';
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
            var style = 'rep_style';
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
                        $top.css("visibility","visible");
                    });
                } else {
                    $top.stop().fadeTo(fadeSpeed, 0, function () {
                        $top.css("visibility","hidden")
                    });
                }
                if (getScrollTop() + $(window).height() < $doc.height() - upperLimit) {
                    $bottom.stop().fadeTo(fadeSpeed, 1, function () {
                        $bottom.css("visibility","visible");
                    });
                } else {
                    $bottom.stop().fadeTo(fadeSpeed, 0, function () {
                        $bottom.css("visibility","hidden");
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
                                var x1=docEl.pageX - x;
                                var y1=docEl.pageY - y;
                                $gtbBox.offset({
                                    left: x1,
                                    top:y1 
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