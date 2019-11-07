// ==UserScript==
// @name         获取网站所有图片
// @namespace    https://www.chlung.com/
// @version      1.1.0
// @description  获取网站的所有图片，支持查看和下载。
// @author       Johnny Li
// @license      MIT
// @match        *://*/*
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      cdn.jsdelivr.net
// @require      https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@master/jDialog/dist/jquery.jDialog.min.js
// @require      https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@master/jBoxSelect/build/jquery.jBoxSelect.min.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var GetImg=function(){
        var $doc=$(document);
        var $body=$("html body");
        var createHtml=function(){
            var h=[];
            h.push("<div id='imglst' class='ilst'>");
            h.push("<ul class='lst'>");
            h.push("</ul>");
            h.push("</div>");
            $body.append(h.join(""));
        }
        var createStyle=function(){
            //尽可能避开csp认证
            GM_xmlhttpRequest({
                method:"get",
                url:"https://cdn.jsdelivr.net/gh/zyufstudio/jQuery@master/jDialog/dist/jDialog.min.css",
                onload:function(r){
                    $("html head").append("<style>"+r.responseText+"</style>");
                }
            });
            var s="";
            s+=".ilst{width: 100%;height: 100%;overflow-x: hidden;overflow-y: auto;position: relative;display: none}";
            s+=".lst{display: block;list-style: none;margin: 0;padding: 0;}";
            s+=".lst li{display: inline-block;list-style: none;width: auto;height:auto; margin:0px 20px 20px 0px; background-color:#eee; overflow:hidden; cursor:pointer;position:relative; vertical-align:middle; border:3px solid rgba(255,255,255,0)}";
            s+=".lst li .imageItemResolution{position: absolute;left:0px;bottom:0px;background: #16fd0061;font-size:small;text-align: center;line-height: normal;}";
            s+=".lst li.select-item.selecting-item, .lst li.select-item.selected-item, .lst li.select-item:hover { border: 3px solid #1094fa; box-shadow: #1094fa 0 0 8px 0}";
            s+=".lst li.select-item.unselecting-item{border: 3px solid #83b6ff; box-shadow: #83b6ff 0 0 8px 0}";
            var style="<style>"+s+"</style>";
            $("html head").append(style);
        }
        var GetAllImg=function(){
            var h=[];
            var imgs=[];
            var allEl=$("body *");
            $.each(allEl,function(index,itemEl){
                var $el=$(itemEl);
                var el=$el[0];
                var elTagName=$el[0].tagName.toUpperCase();
                //img
                if(elTagName=="IMG")
                {
                    imgs.push($el.attr("src"));
                    return true;
                }
                //canvas
                if(elTagName=="CANVAS"){
                    imgs.push(el.toDataURL());
                    return true;
                }
                //backgroundimage
                var backgroundImage = getComputedStyle(el).backgroundImage;
                if (backgroundImage !== 'none' && backgroundImage.startsWith('url')) {
                    imgs.push(backgroundImage.slice(5, -2));
                }
            });
            imgs=ArrayUnique(imgs);
            $.each(imgs,function(index,item){
                var imgObj=HandleImg(item);
                var src=imgObj.imgSrc;
                var width=imgObj.width;
                var height=imgObj.height;
                var naturalWH=imgObj.naturalWidth+"x"+imgObj.naturalHeight;
                if(imgObj.naturalWidth<=15||imgObj.naturalHeight<=15) {return true;}
                var imgResolution=StringFormat('<span class="imageItemResolution" style="width:{0}px;">{1}</span>',width,naturalWH);
                imgResolution=height>=32&&width>=32?imgResolution:"";
                var fe=GetFileExt(src);
                var fileExt=fe.type!=""?fe.ext+"("+fe.type+")":fe.ext;
                var LocalDownload=fe.type!=""?"Y":"N";
                var yellowBorder="";
                var isSelect="select-item";
                if(!imgObj.isCors){
                    yellowBorder="border:3px solid red";
                    //isSelect="";
                }
                var nameExt=fe.ext=="other"?"jpg":fe.ext;
                var fileName=(Math.round(new Date().getTime()/1000)+index)+"."+nameExt;
                var imgTitle=StringFormat("分辨率: {0} / 类型: {1}",naturalWH,fileExt);
                h.push(StringFormat('<li class="{8}" style="{7}" title="{6}" data-src="{0}" data-type="{9}" data-localdownload="{11}" data-filename="{10}">\
                            <img src="{0}" width="{1}px" height="{2}px">\
                            {5}</li>',src,width,height,width-6,height-6,imgResolution,imgTitle,yellowBorder,isSelect,fe.ext,fileName,LocalDownload));
            });
            return h.join("");
        }
        var GetFileExt=function(src){
            var fileExt={};
            var imgBase64Reg=/^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
            var imgExtReg=/(\.(\w+)\?)|(\.(\w+)$)/gim;
            if(imgBase64Reg.test(src)){
                var imgBase64ExtReg=/^\s*data:([a-z]+\/)([a-z0-9-+.]+)/gim;
                var s=imgBase64ExtReg.exec(src);
                fileExt.ext=s[2];
                fileExt.type="base64";
            }
            else if(imgExtReg.test(src)){
                fileExt.ext=src.match(imgExtReg)[0].replace(/\.|\?/gim,"");
                fileExt.type="";
            }
            else{
                fileExt.ext="other";
                fileExt.type="";
            }
            return fileExt;
        }
        var HandleImg=function(src){
            var outHeight=170;
            var imgObj={};
            var width,height,naturalWidth,naturalHeight,scaleWidth,scaleHeight,isCors;
            var image = new Image();
            image.src = src;
            width=parseInt(image.width);
            height=parseInt(image.height);
            naturalWidth=width;
            naturalHeight=height;
            outHeight=parseInt(outHeight);
            if(height<outHeight){
                scaleWidth=width;
                scaleHeight=height;
            }else{
                scaleWidth=parseInt(outHeight*width/height);
                scaleHeight=outHeight;
            }
            isCors=true;//corsEnabled(image.src);
            imgObj.imgSrc=image.src;
            imgObj.isCors=isCors;
            imgObj.naturalWidth=naturalWidth;
            imgObj.naturalHeight=naturalHeight;
            imgObj.width=scaleWidth;
            imgObj.height=scaleHeight;
            return imgObj;
        }
        var corsEnabled=function(url){
            var xhr={};
            try{
                $.ajax({
                    type:"head",
                    url:url,
                    async:false,
                    complete:function(rxhr){
                        xhr=rxhr;
                    }
                });
            }
            catch(e){}
            return xhr.status >= 200 && xhr.status <= 299;
        }
        var downloadImg=function (index,imgs){
            if(index>imgs.length-1) return;
            /*
            //不能下载不支持CORS的图片
            var image = new Image();
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = src+"?r="+Math.ceil(Math.random() * 10000);
            image.onload=function(){
                var canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, image.width, image.height);
                var ext = image.src.substring(image.src.lastIndexOf('.')+1).toLowerCase();
                var dataURL = canvas.toDataURL('image/' + ext);

                var $imgdownload=$("<a></a>").attr("href", dataURL).attr("download",downloadName).appendTo("body");
                $imgdownload[0].click();
                $imgdownload.remove();
            }
            */
           var delayTime=300;
            var src=imgs[index].src;
            var fileName=imgs[index].fileName;
            var localdownload=imgs[index].localdownload;
            if(localdownload=="Y"){
                GM_download(src,fileName);
                setTimeout(function(){
                    downloadImg(index + 1,imgs);
                }, delayTime);
            }
            else{
                GM_download({
                    url:src,
                    name:fileName,
                    onload:function(){
                        //downloadImg(index + 1,imgs);
                        setTimeout(function(){
                            downloadImg(index + 1,imgs);
                        }, delayTime);
                    },
                    onerror:function(e){
                        console.error(StringFormat("第{0}几张图片{1}下载失败，失败原因：{2}",index+1,fileName,e.error));
                        setTimeout(function(){
                            downloadImg(index + 1,imgs);
                        }, delayTime);
                        //console.log(errMsg);
                    },
                    ontimeout: function(){
			    		console.error(StringFormat("第{0}几张图片{1}下载超时",index+1,fileName));
                        setTimeout(function(){
                            downloadImg(index + 1,imgs);
                        }, delayTime);
			    	}
                });
            }
        }
        var RegMenu=function(){
            GM_registerMenuCommand("获取图片",function(){
                var h=GetAllImg();
                $("div#imglst ul.lst").html(h+"<li class='clearFloat'></li>");
                $("div#imglst").jDialog({
                    title:"图片列表",
                    width:980,
                    height:610,
                    close:function(){
                        $("div#imglst").jDialog("destroy");
                    },
                    menus:[{
                        text:"全选",   
                        type:"sddmenu",    
                        subMenus:[{         
                            text:"全不选", 
                            fn:function(){
                                $(".JDialog-body ul.lst").find('.select-item.selected-item').each(function(){
                                    var $thisEl=$(this);
                                    $thisEl.removeClass("selected-item");
                                });
                            }        
                        },
                        {
                            text:"反选", 
                            fn:function(){
                                $(".JDialog-body ul.lst").find('.select-item').each(function(){
                                    var $thisEl=$(this);
                                    if($thisEl.is(".selected-item")){
                                        $thisEl.removeClass("selected-item");
                                    }
                                    else{
                                        $thisEl.addClass("selected-item");
                                    }
                                })
                            }
                        }],
                        fn:function(){
                            $(".JDialog-body ul.lst").find('.select-item').each(function(){
                                var $thisEl=$(this);
                                $thisEl.addClass("selected-item");
                            })
                        }
                    }],
                    buttons:[                      
                        {
                            text:"下载",
                            fn:function(){
                                var imgLst=$("div.JDialog-body ul.lst").find("li.select-item.selected-item");
                                var imgs=[];
                                imgLst.each(function(index,imgItem){
                                    var $imgItem=$(imgItem);
                                    var imgSrc=$imgItem.attr("data-src");
                                    var localdownload=$imgItem.attr("data-localdownload");
                                    var imgFileName=$imgItem.attr("data-filename");
                                    imgs.push({
                                        src:imgSrc,
                                        fileName:imgFileName,
                                        localdownload:localdownload
                                    });
                                });
                                downloadImg(0,imgs);
                            }
                        }
                    ]
                });
                $("div#imglst").jDialog("show");
                $(".JDialog-body").JBoxSelect();
            });
        }
        var ArrayUnique=function(args){
            var temparr=[];
            $.each(args,function(i,v){
                if($.inArray(v,temparr)==-1) {
                    temparr.push(v);
                }
            });
            return temparr;
        }
         var StringFormat=function(formatStr){
            var args=arguments;
            return formatStr.replace(/\{(\d+)\}/g, function(m, i){
                i=parseInt(i);
                return args[i+1];
            });
         }
        this.init=function(){
            createStyle();
            createHtml();
            RegMenu();
        }
    }
    var gi=new GetImg();
    gi.init();
})();