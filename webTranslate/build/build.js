const gulp = require('gulp');
const rename=require("gulp-rename");
const concat=require("gulp-concat");
const rollup=require("gulp-rollup");
const path=require("path");


const resolveFile=function(filePath){
    return path.join(__dirname,'..',filePath);
}
const inputOptions={
    input:resolveFile("src/webTranslate.js"),
}
const outputOptions={
    output:{
        file:resolveFile("dist/webTranslate.js"),
        format:"iife"
    },
}
async function build(){
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);

}
function js(){

    return gulp.src("./src/**/*.js")
        .pipe(rollup({
            input:"../src/webTranslate.js"
        }))
        .pipe(concat("../src/webTranslate.tm.js"))
        .pipe(rename("webTranslate.js"))
        .pipe(gulp.dest("../dist"))
    
}
//build();
//js()
exports.default=gulp.series(js);

