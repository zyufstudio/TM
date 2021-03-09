const gulp = require('gulp');
const concat=require("gulp-concat");
const sourcemaps=require("gulp-sourcemaps");
const path=require("path");
const config=require("./config");
const del=require("del");

const resolveFile=function(filePath){
    return path.join(__dirname,'..',filePath);
}

function js(){ 
    return gulp.src([resolveFile(config.options.tmconfigPath),resolveFile(config.options.distPath)])
        .pipe(sourcemaps.init())
        .pipe(concat("webTranslate.dev.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(resolveFile("dist")))
}
function removeFile(){
    return del([resolveFile(config.options.distPath)],{force:true});
}
exports.default=gulp.series(config.build,js,removeFile);

