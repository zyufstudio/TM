import {Guid,StringFormat,ClearBubble,DateFormat,GetSettingOptions,SetSettingOptions,options} from "./lib/utils"
import {Trans} from "./transEngine/trans"
import {Panel} from "./lib/panel"
import {TextTransPanel} from "./lib/textTransPanel"
import {WordTransPanel} from "./lib/wordTransPanel"
import {SettingPanel} from "./lib/settingPanel"

//主程序
var WebTranslate=function(){
    var transIconBase64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAENklEQVRoQ+2ZTVITQRTH/28qyNIJFxCqnGwNJzCcwHACcelkIZxAPAG4IFkaTyCegHgC4jZjVfACzLBEUvOs7jCx57unZ6JSRZZJ9+v3e+/1++gQHviHHrj+eAT41x4s9YA99F5qK3nb+h4c7QTa6xtYmAuwNfLeg3Fc5QxmBGy1doO3O1dV9tVZmwmwdeYdg/DeTDB/vnY7B2Z7q+/KBhh6XF3UcgeDr3y3s2O6v+q+FIB9NutaRJdVBanrQ+bdYNCZ1pGhuzcNMPJ6FuNCV0DWuhA4ClzntI4M3b1rARBhRERjXSWK1oUhfy3y5loAmlBclcHAue86+1lyHwTAfXb4cD1wUmm9EgAzfhLoPLT4fGUNRpeAPgH6Bc/ARcw89Qed3eRWLQAGbhg4LrqY9sjrUYgxEZ7FDmH6GAPWUZ7JJvBh0ijXrpPStxRAKs/c00mLAiKewcyLmn0yt63Nha/yGgGEoP3Afb4KGSEYT+5eWxbZQniUJUT9INAFEeT3RXGr4wSxpj30JqoXKgMw8M13nV50oH02OyDQSUxJWX55zKB+8vu8uP1rAKr17dF8m8LFZUr5Em1Cau2ozZ09/NEn8Dum1puypq+2B1SXbQ1nY4Be61rvTxjxOPy1cRS12e2z2SURdcHITIuq/FoA4vL6rrOK56QwBn/n241eXv/fHs6mBHpRFViEHVsb+8I79QAYgT9w2pECSWFlFlxZuiqBSAz3YVcLQJxbFEJyeGEcwMJyAmO+UVPtltKSJzOZyiTuhAX+woyv/sDpNxZCMkUqKVReYl5MCXiaZdSQ+U0w6MgGLt2S59eD9tC7IKCn7s/zukkanfiusxdLo0SnaYi4gnkTXXLYiQqfLJa3re3kfaodQkkvSOuKQra5OLB4WbBCC5PgrTNZQZ7MbXqymKdqAnAjwZXsU5aRGgGQsQ7e02olpPJ3FzJNJj4ixonwSkIz71qgvpi7RYPoD5ztrLBsBCASHDIfBoPOx7yksmwl8ClLeXnHgW/ENAXxO2GUyENF42ejAEsl+Eq204DSTnOXiHqipS7LmOFtq02bi/OovykbPRsHKFNQ4/dTkXoj68ui9WtjL78Y1mzmNBQyWiKqOETPT3hWBPE/egBRwRLZjDbvJqLdyIP4LwFCwl6UdssgzAAaeNgqjKtEFxqDAGKF0whAHK72MUZBXrApOSRFxXGZnfhKfVc1B6j1uFuGrD8nGwNIL6wBIq/nyUOuBbDqbUbeaiYus230uxWil/U8X9RWZ7cSszmBVm2GVjeqq2TZuqwRtAqAeECwiD6p5/xVgGhQSTd1PAVRyd9QvK1a/r6Xio24kdzS/8jKLF30e3voBXkDUFW5WRObkLFWAOOXjASdvPzU6mY9w6wVYFmk/nSfla0O3IAxYat1mPeGtFaAqgqbrH8EMLFak3sePdCkNU1k/QadtchPhjx3/AAAAABJRU5ErkJggg==";
    var $doc=$(document);
    var $body=$("html body");
    var $head=$("html head");
    var defaultTransEngine="yd";    //默认翻译引擎
    var randomCode="yyMM000000";    //属性随机码，年月加六位随机码。用于元素属性后缀，以防止属性名称重复。
    var createHtml=function(){
        var wordTransIconHtml=StringFormat('<div id="wordTrans{0}" class="wordTrans{0}"><div class="wordTransIcon{0}"></div></div>',randomCode,transIconBase64);
        $body.append(StringFormat('<div id="webTrans{0}">',randomCode)+wordTransIconHtml+'</div>');
    }
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
    }
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
    }
    this.init=function(){
        randomCode=DateFormat(new Date(),"yyMM").toString()+(Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000).toString();
        Trans.RegisterEngine();
        createStyle();
        createHtml();
        ShowWordTransIcon();
        RegMenu();
    }
}
var webTrans=new WebTranslate();
webTrans.init();
