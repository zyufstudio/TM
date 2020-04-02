/**
 * 字符串模板格式化
 * @param {string} formatStr - 字符串模板
 * @returns {string} 格式化后的字符串
 * @example
 * StringFormat("ab{0}c{1}ed",1,"q")  output "ab1cqed"
 */
export function StringFormat(formatStr) {
    var args = arguments;
    return formatStr.replace(/\{(\d+)\}/g, function (m, i) {
        i = parseInt(i);
        return args[i + 1];
    });
}
/**
 * 日期格式化
 * @param {Date} date - 日期
 * @param {string} formatStr - 格式化模板
 * @returns {string} 格式化日期后的字符串
 * @example
 * DateFormat(new Date(),"yyyy-MM-dd")  output "2020-03-23"
 * @example
 * DateFormat(new Date(),"yyyy/MM/dd hh:mm:ss")  output "2020/03/23 10:30:05"
 */
export function DateFormat(date, formatStr) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(formatStr)) {
            formatStr = formatStr.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return formatStr;
}
/**
 * 生成Guid
 * @param {boolean} hasLine - guid字符串是否包含短横线
 * @returns {string} guid
 * @example 
 * Guid(false)  output "b72f78a6cb88362c0784cb82afae450b"
 * @example
 * Guid(true) output "67b25d43-4cfa-3edb-40d7-89961ce7f388"
 */
export function Guid(hasLine){
    var guid="";
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    if(hasLine){
        guid=(S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
    else {
        guid=(S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
    }
    return guid;
}
/**
 * 清除dom元素默认事件
 * @param {object} e - dom元素
 */
export function ClearBubble(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}
export function ObjectToQueryString(object){
    var querystring=Object.keys(object).map(function(key) { 
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]) 
    }).join('&');
    return querystring;
}

/**
 * 配置参数
 */
export var options={
    //默认翻译引擎
    defaulttransengine:"yd"
}
/**
 * 获取配置参数
 */
export function GetSettingOptions(){
    var optionsJson=GM_getValue("webtranslate-options")||"";
    if(optionsJson!=""){
        var optionsData=JSON.parse(optionsJson);
        for (var key in options) {
            if (options.hasOwnProperty(key) && optionsData.hasOwnProperty(key)) {
                options[key]= optionsData[key];   
            }
        }
    }
    return options;
}
/**
 * 设置配置参数
 */
export function SetSettingOptions(){
    var optionsJson=JSON.stringify(options);
    GM_setValue("webtranslate-options", optionsJson);
}