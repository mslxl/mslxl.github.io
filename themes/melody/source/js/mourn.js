$(document).ready(function(){
    let now = new Date().getTime()
    let recoverDate = new Date("2020-04-05").getTime()
    if(recoverDate > now){
        $("body").css("-webkit-filter","grayscale(100%)")
    }
});
