const rf=require("fs");
const gulp = require("gulp");
const cleancss = require("gulp-clean-css");
const concat = require("gulp-concat");
const less = require("gulp-less");
const replace = require("gulp-replace");
const htmlmin = require("gulp-htmlmin");
const rename = require("gulp-rename");
const gulpif = require("gulp-if");
const del=require("del");

const outPath = "../dist";
const buildMainFile = "../src/goTopBottom.js";

function gzipMainHtml() {
    return gulp.src(["../src/main.html"])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(rename("main.min.html"))
        .pipe(gulp.dest(outPath));
}

function gzipMainCss() {
    return gulp.src("../src/main.less")
        .pipe(less())
        .pipe(cleancss())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest(outPath))
}
function delMinFiles(){
    return del(['../dist/main.min.css', '../dist/main.min.html'],{force:true});
}
function build() {
    return gulp.src(buildMainFile)
        .pipe(replace("rep_html",function(math){
            let c= rf.readFileSync("../dist/main.min.html",'utf8');
            return c;
        }))
        .pipe(replace("rep_style",function(math){
            let c= rf.readFileSync("../dist/main.min.css",'utf8');
            return c;
        }))
        .pipe(gulp.dest(outPath))
}

//gulp.watch([buildMainFile,"../src/main.less","../src/main.html"],gulp.series(gzipMainHtml,gzipMainCss,build,delMinFiles))
exports.default = gulp.series(gzipMainHtml,gzipMainCss,build,delMinFiles);