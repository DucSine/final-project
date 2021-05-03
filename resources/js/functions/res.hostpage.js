//header
function accInfoSubmit() {
    listIconIfVisible(INLINE)
    _select_resType.style.display = NONE
    return true
}


function accInfoCancel() {
    assignValueToController()

    listIconIfVisible(INLINE)
    listInputIfDisable(true)

    _select_resType.style.display = NONE
    _b_resType.style.display = INLINE

}

function changePassSubmit() {
    if (_list_input_changePass[0].value == _list_input_changePass[1].value)
        alert('Mật khẩu mới phải khác mật khẩu cũ.')
    else if (_list_input_changePass[2].value != _list_input_changePass[1].value)
        alert('Mật khẩu xác nhận không khớp.')
    else{
        axios.post(
            POST_CHANGE_PASS,
            {
                password: _list_input_changePass[0].value,
                newPassword: _list_input_changePass[2].value
            }
        ).then(res => {
            alert(res.data.status)
            console.log(res.data)
            if (res.data.status != 'failed') {
                alert('Cập nhật mật khẩu thành công.')
                document.getElementById('accountChangePass').style.display='none'
            }else
                alert(res.data.message)
        })
        .catch(error => alert('Có lỗi xảy ra'))
    }
    
        return false
}

function listIconIfVisible(style) {
    _list_ic_editor[0].style.display = style
    _list_ic_editor[1].style.display = style
    _list_ic_editor[2].style.display = style
    _list_ic_editor[3].style.display = style
}

function listInputIfDisable(boolean) {
    _list_input_accInfo[0].disabled = boolean
    _list_input_accInfo[1].disabled = boolean
    _list_input_accInfo[2].disabled = boolean
}

function assignValueToController() {
    _list_input_accInfo[0].value = _restaurantName_if
    _list_input_accInfo[1].value = _restaurantPhone_if
    _list_input_accInfo[2].value = _restaurantAddress_if
    _b_resType.textContent = _restaurantType_if
    _img_Banner.src = _restaurantBanner_if
    _img_Avatar.src = _restaurantBanner_if

    _div_accInfo.style.display = NONE
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
