import {StringFormat} from "./utils"
import {Panel} from "./panel"
import {Trans} from "../transEngine/trans"

//文本翻译面板
export var TextTransPanel={
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
}