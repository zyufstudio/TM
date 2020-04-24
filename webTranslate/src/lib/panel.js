import {StringFormat} from "./utils"

//面板
export var Panel={
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
        })
        $(self.popBoxEl).jPopBox('show');
    },
    Update:function(Fn){
        var $panel=$("div.JPopBox-tip-white");
        Fn($panel);    
    },
    Destroy:function(){
        //$(this.popBoxEl).jPopBox("hideDelayed");
        $(this.popBoxEl).jPopBox("destroy");
    },
    CreateStyle:function(){
        var s="";
        s+=StringFormat("#panelBody{0}>div input,#panelBody{0}>div select{padding: 3px; margin: 0; background: #fff; font-size: 14px; border: 1px solid #a9a9a9; color:black;width: auto;min-height: auto; }",this.randomCode);
        s+=StringFormat("#panelBody{0}>div:first-child{padding-bottom: 5px;height:30px}",this.randomCode);
        s+=StringFormat("#panelBody{0}>div:last-child hr{border: 1px inset #eeeeee;background: none;height: 0px;margin: 0px;}",this.randomCode);
        return s;
    }
}