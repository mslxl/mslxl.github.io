function randomFrom(low,high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function searchText() {
    window.open(`/pages/search.html#q=${encodeURIComponent($('#search-text').val())}&t=${$('#enable-fast-search').prop('checked')}`)
}