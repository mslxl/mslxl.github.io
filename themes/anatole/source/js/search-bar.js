$(document).ready(()=>{
    $("#toggle-search-bar").click(()=>{
        let bar = $(".search-bar")
        let btn = $("#toggle-search-bar")
        if(bar.css("display")=="none"){
            btn.removeClass("fa-search")
            btn.addClass("fa-close")
            bar.show("fast")
        }else {
            btn.removeClass("fa-close")
            btn.addClass("fa-search")
            bar.hide("fast")
        }
    })
    $(".search-btn").click(()=>{
        let text = $('#text-input').val()
        window.open(`/search#${text}`)
    })
})