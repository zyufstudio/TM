const gulp = require('gulp');
const concat=require("gulp-concat");
const path=require("path");
const config=require("./config");
const del=require("del");
const checks=require("./check");

const resolveFile=function(filePath){
    return path.join(__dirname,'..',filePath);
}

function js(){ 
    return gulp.src([resolveFile(config.options.tmconfigPath),resolveFile(config.options.distPath)])
        .pipe(concat("webTranslate.js"))
        .pipe(gulp.dest(resolveFile("dist")))
}
function removeFile(){
    return del([resolveFile("dist/webTranslate.dev.js")],{force:true});
}
exports.default=gulp.series(checks.check,config.build,js,removeFile);

