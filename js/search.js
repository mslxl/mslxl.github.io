$(()=>{

    function back() {
        window.location = '/'
    }

    function parseArg(url) {
        if (url.indexOf('#')===-1){
            back()
        }
        let args = url.split('#')[1].split('&')
        let text = ''
        let onlyTitle = true
        args.forEach((value)=>{
            if (value.startsWith('q=')){
                text = decodeURIComponent(value.substring(2))
            } else if (value.startsWith('t=')){
                let t = value.substring(2)
                onlyTitle = (t==='true')
            }
        })
        let obj = {
            q: text,
            t: onlyTitle
        }

        obj.q||back()
        if (obj.t===undefined||obj.t==null){
            back()
        }
        return obj
    }
    
    function getContent(url,callback) {
        $.get(url,(data,state)=>{
            if (state==='success'){
                let nodes = $(data)
                let el = nodes.find('#content')
                let text = el.text().replace(new RegExp('\n','g'),'').replace(new RegExp(' {2}','g'),'')
                let content = text.substring(0,text.length>200?200:text.length-1)
                callback(content)
            } else {
                callback(state)
            }
        })
    }

    function search(msg,callback){
        let onlyTitle = msg.t
        let text = msg.q.toUpperCase()

        let result = []
        let complateNum = 0
        let compalte = () => {
            complateNum++
            if (complateNum>=result.length){
                callback(result)
            }
        }


        $.get('/pages/pages.json',(data,state)=>{
            if (state==='success'){

                data.forEach((value)=>{
                    if (value['title'].toUpperCase().indexOf(text)!==-1){
                        getContent(value['url'],(content)=>{
                            value.preview = content
                            compalte()
                        })
                        result.push(value)
                    } else if (!onlyTitle) {
                        getContent(value['url'],(content)=>{
                            if (content.toUpperCase().indexOf(text)!==-1){
                                value.preview = content
                                result.push(value)
                                compalte()
                            }
                        })
                    }
                })

            } else {
                alert(state)
                back()
            }
        })
    }

    let str = window.location.toString()
    let vue = new Vue({
        el:'#vue-el',
        data:{
            items:[]
        }
    })
    let logo = $('#logo')
    let args = parseArg(str)
    logo.html('Searching...')
    search(args,(result)=>{
        console.log(result)
        vue.items.length = 0
        result.forEach((item)=>{
            vue.items.push(item)
        })
        logo.html('Search result: ' + args.q)
    })
})