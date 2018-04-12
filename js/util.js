function randomFrom(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function searchText() {
    window.open(`/pages/search.html#q=${encodeURIComponent($('#search-text').val())}&t=${$('#enable-fast-search').prop('checked')}`)
}

function scrollToTop(callback) {
    const gotoTop = function () {
        let currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= 40;
        if (currentPosition > 0) {
            window.scrollTo(0, currentPosition);
        }
        else {
            window.scrollTo(0, 0);
            clearInterval(timer);
            timer = null;
            callback&&callback()
        }
    }
    let timer = setInterval(gotoTop, 1);
}

function downloadPage() {
    scrollToTop(function () {
        let content = $('#content')
        if (content.length===0){
            content = $('.main')
        }
        content.css("background", "#fff")
        let filename = document.title+'.pdf';

        html2canvas(content, {
            onrendered:function(canvas) {
                const contentWidth = canvas.width;
                const contentHeight = canvas.height;

                let pageHeight = contentWidth / 592.28 * 841.89;
                let leftHeight = contentHeight;
                let position = 0;
                let imgWidth = 595.28;
                let imgHeight = 592.28/contentWidth * contentHeight;

                let pageData = canvas.toDataURL('image/jpeg', 1.0);

                const pdf = new jsPDF('p', 'pt', 'a4');

                pdf.setProperties({
                    title: document.title,
                    author: 'Mslxl',
                });

                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        if(leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }
                pdf.output("save", filename)
            }
        })
    })
}