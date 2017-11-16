const fs = require('fs');

fs.readdir("./temp/proc",function(error,files){
    for(var i = 0; i < files.length ;  i++){
        fs.rename("./temp/proc/" + files[i], "././temp/proc/img" + i.toString() + ".jpg")
    }
})