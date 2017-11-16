const http = require('http');
const fs = require('fs'); // for static files
const path = require('path'); // for static files
const qs = require('querystring'); // for parse cookie
const server = http.createServer();
const Jimp = require("jimp")
const mongoose = require("mongoose");
const md5 = require("md5");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/h_starter_data", {useMongoClient: true})
//database config
var userBaseSchema = new mongoose.Schema({
   email: String,
   password: String,
   emailVerified: Boolean,
   
   remainedCoins: Number,
  spentCoinsOnProjects: Number, //Projects that are successful
  spentCoinsOnBooks:Number,
  frozenCoins: Number,

  //follow
  followedDrawersId: [String],

  //projects
  savedProjectsId: [String],
  //userType
  isAdmin: Boolean,
  isDrawer: Boolean,
  projectsId: {}, //currently pleged projects, project id: charge id of stripe/'creater'
  coinsEarned: Number,

  //userInfo
  nickName: String,
  nickNameTag: String,
});
var UserBase = mongoose.model("UserBase", userBaseSchema);

var sessionSet = {} // sid: [_id,ip]
function updateIdToSession(id,ip){
  var ifRollingDices = true;
  var sid = "";
  while(ifRollingDices){
    sid = (Math.floor(Math.random() * 10000000)).toString(36)
    if (!(sid in sessionSet)){
      ifRollingDices = false; // new sid value is here
    }else{
      //the sid can still be used if sessionSet[sid] is added too long ago
      var nowTime = new Date().getTime();
      //90 days = 7776000000 ms
      if(sessionSet[sid].time <= nowTime - 7776000000)
        ifRollingDices = false;
    }
  }
  
  var time = new Date().getTime();
  sessionSet[sid] = {
    id,
    ip,
    time 
  }
  return sid;
}

function reqIdentity(sid,ip) {
  if(!(sid in sessionSet)){
    return "";
  }else{
    if(sessionSet[sid].ip != ip){
      return "";
    }
    else{
      var tempTime = new Date.now()
      if(sessionSet[sid].time <= tempTime - 7776000000){
        return "";
      }else{
        return sessionSet[sid].id;
      }
    }
  }
}

//sever running
server.on('request',function(req,res){
  
  // console.log(req.headers['x-forwarded-for'])
  
  const urlSep = req.url.split('/') // "/part1/part2/" => ["","part1","part2",""]
  if(req.method === "GET"){
    if(req.url === "/"){
      const filePath = './client/index.html'
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    // if src is "/js/xxx.js"
    else if(urlSep[1] === "js"){
      const filePath = './client' + req.url;
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        res.writeHead(200, {
            'Content-Type': 'text/javascript'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    // img tag src = /img/xxx
    else if(urlSep[1] === "img"){
      const filePath = './client' + req.url;
      fs.readFile(filePath, function(error, content) {
        // console.log(content)
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        })
        res.end(content,'utf-8');
        return;
      })
    }
    
    //no idea why cloud9 love sending such request
    else if(req.url === "/favicon.ico"){
      const filePath = './client/img/favicon.ico'
      fs.readFile(filePath,function(error,content){
        res.writeHead(200,{
          'Content-Type': 'image/ico'
        })
        res.end(content,'utf-8');
        return;
      })
      res.end();
      return;
    }
    
    //no fucking idea what this GET request is about
    else{
      console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
      res.end()
      return;
    }
  }

  else if(req.method === "POST"){
    req.body = [];
    req.on('data', function(chunk) {
      req.body.push(chunk);
    });
    req.on('end', function(){
      var bodyStr = Buffer.concat(req.body).toString();
      var bodyJson = "";
      try{
        bodyJson  = JSON.parse(bodyStr);
      }catch(e){
        console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
        res.end(JSON.stringify({error:"cannot parse the request"}))
      }
      
      //for dev Test
      if(bodyJson.action === "imgtest"){
          var toBuf = bodyJson.actualData.replace(/^data:image\/\w+;base64,/, "")
          var buf = new Buffer(toBuf,'base64')
          Jimp.read(buf,function(error,image){
            if(!!error){
              console.log(error)
            }else{
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
              
              image.resize(resizeArg1,resizeArg2,function(error,imageResized){
                if(!!error){
                  res.end(JSON.stringify({"error": "fail to resize the image"}));
                  return;
                }
                w = imageResized.bitmap.width;
                h = imageResized.bitmap.height;
                
                var x,y;
                if(h / w < hTow){
                  x = (w - w_id) / 2;
                  y = 0;
                }else{
                  x = 0;
                  y = (h - h_id) / 2;
                }
                imageResized.crop(x, y, w_id, h_id, function(error,imageCroped){
                  if(!!error){
                    res.end(JSON.stringify({"error": "fail to crop the image"}));
                    return;
                  }
                  imageCroped.write("./temp/ho7.jpg",function(error,data){
                    if(!!error){
                      res.end(JSON.stringify({"error": "fail to save the image"}));
                      return;
                    }
                    res.end(JSON.stringify({"error": null}));
                  })
                })
              })
              
              
              
            }
          })
      }
      
      //register User
      else if(bodyJson.action === "register"){
        //see if actual data is complete
        if(!bodyJson.actualData){
          console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`); res.end(JSON.stringify({error: "submitted data not complete"})); return;
        }
        else if(!bodyJson.actualData.nickName || !bodyJson.actualData.email || !bodyJson.actualData.email){
          console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`); res.end(JSON.stringify({error: "submitted data not complete"})); return;
        }
        //see if those fields are valid NOTIMP
        
        //we can add the user data now
        UserBase.create({
          email: bodyJson.actualData.email,
          password : md5(bodyJson.actualData.password),
          nickName : bodyJson.actualData.nickName,
          emailVerified : false
        },function(error,data){
          if(!!error){
            var toResp = {"error":error}
            res.end(JSON.stringify(toResp))
          }else{
            var sid = updateIdToSession(data._id, req.headers['x-forwarded-for'])
            var toResp = {"error":null, "sid": sid}
            res.end(JSON.stringify(toResp))
          }
        })
        
      }
      
      else if(bodyJson.action === "usrNavRetrieve"){
        if(bodyJson.sid === ""){
          res.end(JSON.stringify({error: null, ifLoggedIn: false})); return;
        }else{
          var usrIdInMongo = reqIdentity(bodyJson.sid, req.headers['x-forwarded-for']);
          if(usrIdInMongo === ""){
            res.end(JSON.stringify({error: null, ifLoggedIn: false})); return;
          }else{
            res.end(JSON.stringify({error: null, ifLoggedIn: true})); return;
          }
        }
      }
      
      // I dont know what this post req is
      else if(bodyJson !== ""){
        console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
        res.end(JSON.stringify({error: "hit else, unspecified or non-understandable action specified"}));
        return;
      }
      // var postData = qs.parse(bodyStr);
      
    })
  }
  
  
  
  //I don't know what the fuck this req is
  else{
    console.log(`Cannot process req with url of ${req.url} and method of ${req.method}`)
    res.end();
    return;
  }
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});