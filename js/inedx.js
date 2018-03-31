$(()=>{
    let vue = new Vue({
        el: '#vue-el',
        data:{
            imageNum:randomFrom(1,13),
            items:[]
        }
    })

    setInterval(()=>{
        vue.imageNum = randomFrom(1,13)
    },20 * 1000)


    let pageInfo = {}
    let loading = false
    const loadJson = (json) =>{
        let obj = JSON.parse(json)
        obj['article'].forEach((value, index, array)=>{
            vue.items.push(value)
        })
        let page = {
            next:obj['next'],
            previous:obj['previous']
        }
        return page
    }
    const load = ()=>{
        console.log(pageInfo)
        if (!pageInfo['next'])
            return
        loading = true
        $.get(pageInfo['next'],(data,state)=>{
            if (state==='success'){
                let node = $.parseHTML(data)
                $.each(node,(index, el)=>{
                    if (el.getAttribute&&el.getAttribute('id') === 'data-json') {
                        let data = el.innerHTML
                        pageInfo = loadJson(data)
                        loading = false
                    }
                });
            } else {
                console.log(state)
                loading = false
            }
        })
    }

    pageInfo = loadJson($('#data-json').html())



    const BOTTOM_OFFSET = 20;

    $(document).ready(() => {
        $(window).scroll(() => {
            if (loading)
                return
            let $currentWindow = $(window);
            let windowHeight = $currentWindow.height();
            let scrollTop = $currentWindow.scrollTop();
            let docHeight = $(document).height();


            if ((BOTTOM_OFFSET + scrollTop) >= docHeight - windowHeight) {
                console.log('Next Page')
                load()
            }
        });
    });

})