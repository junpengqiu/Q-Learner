function extFromCookie(toExt){
    var temp = document.cookie;
    var varName = toExt + "=";
    var varNameIdx = temp.indexOf(varName);
    if(varNameIdx == "-1") return ""; //cookie parse error
    var endIdx = temp.indexOf(";",varNameIdx);
    if(endIdx == -1) endIdx = temp.length;
    return temp.substring(varNameIdx + varName.length, endIdx);
}

function regUsr(event) {
    event.preventDefault(); // If it is just a regular button triggering this function, you don't need to prevent the default event, a regular button won't submit the form, thus no page refresh.
    
    var usrName = document.getElementById("usrName").value
    var psw = document.getElementById("psw").value
    var nickName = document.getElementById("nickName").value
    
    const actualData = {
        email : usrName,
        password : psw,
        nickName : nickName
    }

    var req = {
        action: "register",
        "actualData" : actualData
    }
    myAjax(JSON.stringify(req), function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            if(res.error !== null){
                console.log(res)
                return;
            }
            document.cookie = "sid="+res.sid;
        }
    })
}
 		
function renderJoinBorder(){
    if(!!document.getElementById("join-form")){
        if(document.documentElement.clientWidth < 992){
            document.getElementById("join-form").style.borderRight = "";
            document.getElementById("join-form").style.borderBottom = ".0625rem solid #c1c0c0";
        }else{
            document.getElementById("join-form").style.borderRight = ".0625rem solid #c1c0c0";
            document.getElementById("join-form").style.borderBottom = "";
        }
    }
}

//my Ajax:
function myAjax(toSend,cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = cb;
    xhttp.open("POST", "https://h-starter-dawahent.c9users.io/");
    xhttp.send(toSend);
}

function hey(argument) {
    let temp = document.getElementById("usrSectionTest")
    if(temp.style.height === "0px" || temp.style.height === ""){
        temp.style.height = "250px"
    }else{
        temp.style.height = "0"
    }
}