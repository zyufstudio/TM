const rollup=require("rollup");
const path=require("path");

const resolveFile=function(filePath){
    return path.join(__dirname,'..',filePath);
}
//配置参数
const options={
    //源文件
    srcPath:"src/webTranslate.js",
    //编译后文件
    distPath:"dist/webTranslate.js",
    //TM配置
    tmconfigPath:"src/webTranslate.tmconfig.js",
}

const inputOptions={
    input:resolveFile(options.srcPath),
}
const outputOptions={
    output:{
        file:resolveFile(options.distPath),
        format:"iife"
    },
}

async function build(){
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
}



module.exports={
    //inputOptions:inputOptions,
    //outputOptions:outputOptions,
    build:build,
    options:options
}
