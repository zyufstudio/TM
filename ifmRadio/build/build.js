const rollup = require("rollup");
const gulp = require('gulp');
const concat = require("gulp-concat");
const replace = require('gulp-replace');
const path = require("path");
const del = require("del");
const fs = require('fs');
const less = require('gulp-less');
const cleancss = require('gulp-clean-css');
const rename = require("gulp-rename");

const resolveFile = function (filePath) {
    return path.join(__dirname, '..', filePath);
}
/*********** Rollup build*************/
const inputOptions = {
    input: resolveFile("src/ifmRadio.js"),
}
const outputOptions = {
    output: {
        file: resolveFile("dist/ifmRadio.js"),
        format: "iife"
    },
}
async function build() {
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
}
/*******************************/
function buildCSS(){
    return gulp.src([resolveFile("src/css/style.less")])
        .pipe(less())
        .pipe(rename("style.css"))
        .pipe(gulp.dest(resolveFile("dist")))
        .pipe(cleancss())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(resolveFile("dist")))
}
function css(){
    return gulp.src([resolveFile("src/css/style.css")])
        .pipe(cleancss())
        .pipe(gulp.dest(resolveFile("dist")))
}
function js() {
    return gulp.src([resolveFile("src/ifmRadioTMConfig.js"), resolveFile("dist/ifmRadio.js")])
        .pipe(concat("ifmRadio.js"))
        .pipe(replace('iFMStyle', function () {
            return fs.readFileSync(resolveFile("dist/style.min.css"), 'utf-8');
        }))
        .pipe(gulp.dest(resolveFile("dist")))
}
function removeFile() {
    return del([resolveFile("dist/style.min.css")], { force: true });
}
exports.default = gulp.series(buildCSS,build,js, removeFile);

