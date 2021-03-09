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
    const o = {
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
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(formatStr)) {
            formatStr = formatStr.replace(
                RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return formatStr;
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
/**
 * 对象转URL查询字符串
 * @param {Object} object 
 */
export function ObjectToQueryString(object) {
    const querystring = Object.keys(object).map((key)=>{
        return encodeURIComponent(key) + '=' + encodeURIComponent(object[key])
    }).join('&');
    return querystring;
}
/**
 * 判断是否为空或undefined
 * @param {Any} input 
 */
export function IsEmpty(input){
    let is=false
    if(input=="" || input==null || typeof(input)==="undefined"){
        is=true
    }
    return is
}