$(document).ready(()=>{
    let key = window.location.hash.toString().toLowerCase().substring(1)
    let result = $('.content')
    $.ajax({
        url: '/search.json',
        dataType: 'json',
        success: db => {
           db.forEach(data => {
               try{
                   
                    let isMatch = true
                    let data_title = data.title.trim().toLowerCase();
                    let data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                    if(data_title.indexOf(key) != -1 || data_content.indexOf(key) != -1){
                        let tags_node = ''
                        data.tags.forEach(c => {
                            tags_node+=`<a class="tag" href="/tags/${c}/" title="${c}">${c}</a>`
                        })
                        let node = `<div class="post animated fadeInDown">
                                        <div class="post-title">
                                            <h3><a href="${data.url}">${data.title.trim()}</a></h3>
                                        </div>
                                        <div class="post-content">
                                            <p>${data_content.substring(0,100)}</p>
                                        </div>
                                        <div class="post-footer">
                                            <div class="meta">
                                                <div class="info">
                                                    <i class="fa fa-tag"></i>
                                                    ${tags_node}
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
                        result.prepend($(node))
                    }
                }catch(e){
                    
                }
           })
        }
    })
})