import {StringFormat} from "./utils"
import {Panel} from "./panel"
import {Trans} from "../transEngine/trans"

//划词翻译面板
export var WordTransPanel={
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
        Panel.Create("","auto bottom",false,wordTransPanelHtml,function($panel){
            //目标语言
            $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(1)",randomCode)).change(function(e){
                Trans.transTargetLang=$(this).find("option:selected").val();
                Trans.Execute(function(){
                    self.Update(randomCode);
                })
            });
            //翻译引擎
            $panel.find(StringFormat("#panelBody{0} div:eq(0) select:eq(0)",randomCode)).change(function(e){
                Trans.transEngine=$(this).find("option:selected").val();
                Trans.Update();
                Trans.Execute(function(){
                    self.Update(randomCode);
                });
            });
        })
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
                transHtml.push(StringFormat('<li style="list-style: none;"><span>{0}</span></li>',transtxt))
            }
            transHtml.push("</ul></div>");

            var origHtml=[];
            origHtml.push('<div style="padding-bottom: 5px;"><ul style="list-style: none;margin: 0;padding: 0;">');
            for (var j = 0; j < Trans.transResult.orig.length; j++) {
                var origtxt = Trans.transResult.orig[j];
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