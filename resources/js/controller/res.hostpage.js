//form iconlogin
const _img_Avatar = document.querySelector('img.avatar')
const _div_userContainer = document.querySelector('div.user-container')
const _a_usContainer = document.querySelectorAll('.user-container a')
const _btn_logout = document.getElementById('btn_logout')

// from res info
const _div_accInfo = document.getElementById('accountInfo')
const _list_ic_editor = _div_accInfo.querySelectorAll('i.fas.fa-edit')
const _list_input_accInfo = _div_accInfo.querySelectorAll('input')
const _select_resType = _div_accInfo.querySelector('select')
const _b_resType = _div_accInfo.querySelector('b#ifb_resTypeName')

var _restaurantName_if = _list_input_accInfo[0].value
var _restaurantPhone_if = _list_input_accInfo[1].value
var _restaurantAddress_if = _list_input_accInfo[2].value
var _fileFormat = ''

//body
const _a_sidebars = document.querySelectorAll('a.nav-link')
const _div_contents = document.querySelectorAll('.div-content')
const _p_productsTotal = document.getElementById('productsTotal')
const _ul_product = document.getElementById('listProduct')
const _list_btn_next = document.getElementById('listButtonPage')
const _div_searchForm = document.querySelector('.search-container')
const _ip_search = _div_searchForm.querySelector('input#inputSearch')




const _div_direct = document.querySelector('#divDirect')
const _btn_next = document.querySelector('#btn_next.btn.btn-primary')
const _btn_pre = document.querySelector('#btn_pre.btn.btn-primary')

//
//
var _pageTotal = document.getElementById('totalPage').textContent // if else thay doi

var query = location.search
var _page = '1'
var _load = 'hostpage'
var _keySearch = ''

if (query != '') {
    for (var key of query.split('&')) {
        switch (key.split('=')[0]) {
            case 'p':
                _page = key.split('=')[1]
                break;
            case 'keySearch':
                _keySearch = key.split('=')[1]
                break
            default:
                _load = key.split('=')[1]
                break;
        }
    }
}

console.log(_load)
console.log(_page)
console.log(_keySearch)
var _charsSearch = ''
_ip_search.oninput = function () {
    _charsSearch = this.value
}

// init page
switch (_load) {
    case 'hostpage':
        initPageFunctions(_a_sidebars[0], _div_contents[0], NONE)
        break;
    case 'product':
        initPageFunctions(_a_sidebars[1], _div_contents[1], BLOCK)
        break
    case 'bill':
        initPageFunctions(_a_sidebars[2], _div_contents[2], BLOCK)
        break
    case 'discount':
        initPageFunctions(_a_sidebars[3], _div_contents[3], BLOCK)
        break
    default:
        initPageFunctions(_a_sidebars[0], _div_contents[0], NONE)
        break;
}

window.onclick = function (e) {
    switch (e.target) {
        // image login
        case _img_Avatar:
            _div_userContainer.classList.toggle(CLASS_SHOW)
            break
        case _a_usContainer[0]:
            _div_userContainer.classList.toggle(CLASS_SHOW)
            document.getElementById('accountInfo').style.display = BLOCK
            break
        case _a_usContainer[1]:
            _div_userContainer.classList.toggle(CLASS_SHOW)
            document.getElementById('accountChangePass').style.display = BLOCK
            break
        case _btn_logout:
            document.cookie = "token="
            _div_userContainer.classList.toggle(CLASS_SHOW)
            window.location = "/";
            break

        // accInfo
        case _list_ic_editor[0]:
            _list_ic_editor[0].style.display = NONE
            _list_input_accInfo[0].disabled = false
            break
        case _list_ic_editor[1]:
            _list_ic_editor[1].style.display = NONE
            _b_resType.style.display = NONE
            _select_resType.style.display = INLINE
            break
        case _list_ic_editor[2]:
            _list_ic_editor[2].style.display = NONE
            _list_input_accInfo[1].disabled = false
            break
        case _list_ic_editor[3]:
            _list_ic_editor[3].style.display = NONE
            _list_input_accInfo[2].disabled = false
            break


        default:
            _div_userContainer.classList.remove(CLASS_SHOW)
            break
    }
}

window.oninput = function (e) {
    switch (e.target) {
        case _list_input_accInfo[3]:
            _fileFormat = e.target.value.split('.')[1]
            alert(_fileFormat)
            break;

    }
}


















function initPageFunctions(tagA, tagDiv, status) {
    for (var aItem of _a_sidebars)
        (aItem == tagA) ?
            aItem.classList.add(CLASS_ACTIVE) :
            aItem.classList.remove(CLASS_ACTIVE)
    for (var divItem of _div_contents)
        (divItem == tagDiv) ?
            divItem.style.display = BLOCK :
            divItem.style.display = NONE


    _div_searchForm.style.display = status
    _div_direct.style.display = status
}

















