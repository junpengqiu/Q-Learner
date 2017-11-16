const md = require("mongoose")
md.Promise = global.Promise;
md.connect("mongodb://localhost/try", {useMongoClient: true})

const userSchema = new md.Schema({
    name: String,
    imgSet : [String]
})

const User = md.model("User",userSchema)

// var JP = new User({
//     name: "shuai",
//     imgSet: ["hey","ho"]
// })

// JP.save(function(error,data){
//     console.log(error)
// })

exports.module = {User}