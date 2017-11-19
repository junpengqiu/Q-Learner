//initiation
init()

function init(){
    // renderJoinBorder()
}

function onChoseFile(event){
    event.preventDefault();
    
    let reader = new FileReader();
    let file = event.target.files[0];
    		
    reader.onloadend = () => {
        var jsToPass = {}
        jsToPass.action = "imgtest";
        jsToPass.actualData = reader.result;
        myAjax(JSON.stringify(jsToPass),function(){
            if (this.readyState == 4 && this.status == 200){
                console.log(JSON.parse(this.response))
            }
        })
    }
    		
    reader.readAsDataURL(file)
}
 	 	
//resposing to clientWidth
 	 	
// document.getElementsByTagName("BODY")[0].onresize = function() {
//     renderJoinBorder()
// };