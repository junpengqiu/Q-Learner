// const fs = require('fs');
const Jimp = require("jimp")
const files = [ 'IGP2768W.jpg',
  'IMG_1533.jpg',
  'file0001079221497.jpg',
  'file0001116000079.jpg',
  'file0001141038889.jpg',
  'file0001176452626.jpg',
  'file0001209214386.jpg',
  'file0001224117612.jpg',
  'file0001316404158.jpg',
  'file000132701536.jpg',
  'file0001376718168.jpg',
  'file0001454659375.jpg',
  'file0001545806234.jpg',
  'file0001565782100.jpg',
  'file0001601969844.jpg',
  'file0001608482449.jpg',
  'file0001625591306.jpg',
  'file0001637922945.jpg',
  'file0001706961259.jpg',
  'file0001735386118.jpg',
  'file0001750264747.jpg',
  'file0001792779106.jpg',
  'file0001817248786.jpg',
  'file0001896291699.jpg',
  'file0001958769599.jpg',
  'file0001966720664.jpg',
  'file0001971407787.jpg',
  'file0002056219390.jpg',
  'file0002063905655.jpg',
  'file0002073981867.jpg',
  'file0002081215668.jpg',
  'file000267747089.jpg',
  'file000267804564.jpg',
  'file000325161223.jpg',
  'file000466623310.jpg',
  'file000477760838.jpg',
  'file00053809264.jpg',
  'file000541344089.jpg',
  'file000555007525.jpg',
  'file000615586116.jpg',
  'file000626266718.jpg',
  'file000656451307.jpg',
  'file000693070568.jpg',
  'file000698862236.jpg',
  'file000738769552.jpg',
  'file000741141463.jpg',
  'file000844922903.jpg',
  'file000855094214.jpg',
  'file000927030990.jpg',
  'file1301234046357.jpg',
  'file1561246251481.jpg',
  'file1651272386454.jpg',
  'file1821253941895.jpg',
  'file2231273355591.jpg',
  'file2961261953471.jpg',
  'file2961342149502.jpg',
  'file3181278525287.jpg',
  'file3251255366828.jpg',
  'file3811267338835.jpg',
  'file451264266022.jpg',
  'file4741298583098.jpg',
  'file4811312660912.jpg',
  'file4821300966298.jpg',
  'file5001258630705.jpg',
  'file5051300055797.jpg',
  'file5391259700152.jpg',
  'file5861288554715.jpg',
  'file621250696198.jpg',
  'file7561294493011.jpg',
  'file761244456443.jpg',
  'file7681334413913.jpg',
  'file801263247199.jpg',
  'file8081258144701.jpg',
  'file8261246814968.jpg',
  'file9221293737060.jpg',
  'file9241312063946.jpg',
  'file991289430233.jpg' ]

for(var i = 0; i < files.length; i++){
Jimp.read("./client/img/sample/" + files[i], function (error, image) {
    if(error){
        console.log(error)
    }
    var w = image.bitmap.width;
    var h = image.bitmap.height;
    var hTow = 1.4;
    var w_id = 250, h_id = w_id * hTow;
                      
    var resizeArg1, resizeArg2;
    if(h / w < hTow){
        resizeArg1 = Jimp.AUTO;
        resizeArg2 = h_id;
    }else{
        resizeArg1 = w_id;
        resizeArg2 = Jimp.AUTO;
    }
                      
    image.resize(resizeArg1,resizeArg2)
                      
    w = image.bitmap.width;
    h = image.bitmap.height;
                      
    var x,y;
    if(h / w < hTow){
        x = (w - w_id) / 2;
        y = 0;
    }else{
        x = 0;
        y = (h - h_id) / 2;
    }
    image.crop(x, y, w_id, h_id)
    var lb = Math.round(Math.random() * 100000000).toString();
    console.log(lb)
    image.write("./temp/proc/ho" + lb + ".jpg")
})
}