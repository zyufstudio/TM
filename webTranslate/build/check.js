const gulp = require('gulp');
const jshint=require("gulp-jshint");

const jshintConfig={
    "esversion": 6,
    "lookup":false,
    "undef": true,
    "unused": true,
    "funcscope":true,
    "predef": [ "GM_getValue","GM_setValue","GM_xmlhttpRequest",
                "setTimeout","console","$","GM_registerMenuCommand","window","GM_addStyle","document","alert"]
}
function checkjs(){
    return gulp.src(["../src/**/*.js","!../src/googlezyfy.js","!../src/transEngine/baiduTrans/calcSign.js"])
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter('default'))
}
module.exports={
    check:checkjs
}