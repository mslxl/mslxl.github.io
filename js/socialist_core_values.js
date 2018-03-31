$(()=>{
    let index = 0;
    $(document).ready(() => {
        $("body").click(function(e) {
            let a = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正" ,"法治", "爱国", "敬业", "诚信", "友善"];
            let span = $("<span/>").text(a[index]);
            index = (index + 1) % a.length;
            let x = e.pageX,
                y = e.pageY;
            span.css({
                "z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
                "top": y - 20,
                "left": x,
                "position": "absolute",
                "font-weight": "bold",
                "color": "#ff6651"
            });
            $("body").append(span)
            span.animate({
                    "top": y - 180,
                    "opacity": 0
                },
                1500,
                function() {
                    span.remove()
                });
        })
    })
})