import path from "path"

const resolveFile=function(filePath){
    return path.join(__dirname,'..',filePath);
}
export default {
    input:resolveFile("src/webTranslate.js"),
    output:{
        file:resolveFile("dist/webTranslate.js"),
        format:"iife",
    }
}