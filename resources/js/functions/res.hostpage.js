//header
function accInfoSubmit() {
    if (
        _fileFormat == ''
        || Boolean(_fileFormat.match(/JPG/ig))
        || Boolean(_fileFormat.match(/GIF/ig))
        || Boolean(_fileFormat.match(/PNG/ig))
    ){
        alert('ok')
        return true
    }
    else
        return false
}

function accInfoCancel() {
    _list_input_accInfo[0].value = _restaurantName_if
    _list_input_accInfo[0].disabled = true
    _list_ic_editor[0].style.display = INLINE

    _list_input_accInfo[1].value = _restaurantPhone_if
    _list_input_accInfo[1].disabled = true
    _list_ic_editor[2].style.display = INLINE

    _list_input_accInfo[2].value = _restaurantAddress_if
    _list_input_accInfo[2].disabled = true
    _list_ic_editor[3].style.display = INLINE

    _select_resType.style.display = NONE
    _b_resType.style.display = INLINE
    _list_ic_editor[1].style.display = INLINE

    _div_accInfo.style.display = NONE
}

function changePassSubmit() {
    alert('dd')
    return false
}







//body
set_btn_direct_food()

function search() {
    location.replace(`?load=${_load}&p=${_page}&keySearch=${_charsSearch}`)
}

//hostpage


//food

function showProductDetail(value) {
    alert('day la: ' + value)
}





































//cuoi cung
function nextPage() {
    set_btn_direct_food()
    var p = Number(_page) + 1
    _keySearch != '' ?
        window.location = `?load=${_load}&p=${p}&keySearch=${_keySearch}`
        : window.location = `?load=${_load}&p=${p}`
}

function previousPage() {
    set_btn_direct_food()
    var p = Number(_page) - 1
    _keySearch != '' ?
        window.location = `?load=${_load}&p=${p}&keySearch=${_keySearch}`
        : window.location = `?load=${_load}&p=${p}`
}

function set_btn_direct_food() {
    if (_pageTotal == '1') {
        _btn_next.disabled = true
        _btn_pre.disabled = true
    } else if (_page == _pageTotal)
        _btn_next.disabled = true
    else
        _btn_pre.disabled = false

    if (_page == '1')
        _btn_pre.disabled = true
    else
        _btn_pre.disabled = false
}
