
//form iconlogin
const _img_Avatar = document.querySelector('img.avatar')
const _div_userContainer = document.querySelector('div.user-container')
var _a_usContainer = document.querySelectorAll('.user-container a')
var _btn_logout = document.getElementById('btn_logout')

// from res info

// form change pass


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

//
const _foodPage = document.getElementById('totalPage').textContent
var query = (location.href.split('?')[1]).split('&')
var _load = query[0].split('=')[1]
var _page = '1'
var _keySearch = ''
if(query.length > 1){
    for(var key of query){
        if(key.split('=')[0]== 'p')
            _page = key.split('=')[1]
        else if (key.split('=')[0]== 'keySearch')
            _keySearch = key.split('=')[1]
    }
}

var _charsSearch = ''
_ip_search.oninput = function(){
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
        default:
            _div_userContainer.classList.remove(CLASS_SHOW)
            break
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
    _div_direct.style.display= status
}


















