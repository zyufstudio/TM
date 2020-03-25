import {googleTrans}from "./googleTrans"
import {youdaoTrans} from "./youdaoTrans"
import {GetSettingOptions,options} from "../lib/utils"

export var Trans={
    transEngineList:{"ge":"谷歌","yd":"有道"},
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

        switch (this.transEngine) {
            case "yd":
                youdaoTrans.Execute(h_onloadfn);
                break;
            case "ge":
                googleTrans.Execute(h_onloadfn);
            default:
                break;
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
            default:
                break;
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
        this.transText=""                   //被翻译内容
        this.transResult.trans=[];
        this.transResult.orig=[];
        this.transResult.origLang="";
    },
    Init:function(){
        var transEngineListObj={};
        transEngineListObj[googleTrans.code]=googleTrans.codeText;
        transEngineListObj[youdaoTrans.code]=youdaoTrans.codeText;
        this.transEngineList=transEngineListObj;

        GetSettingOptions();
        for (const key in this.transEngineList) {
            if (this.transEngineList.hasOwnProperty(key) && key==options.defaulttransengine.value) {
                const element = this.transEngineList[key];
                
            }
        }
    }
}