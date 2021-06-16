//form iconlogin
const _img_Avatar = document.querySelector('img.avatar')
const _div_userContainer = document.querySelector('div.user-container')
const _a_usContainer = document.querySelectorAll('.user-container a')
const _btn_logout = document.getElementById('btn_logout')

// form icon notifications
const _notification = document.querySelector('i.fa.fa-bell')
const _div_notification = document.querySelector('.notifications_class')

// sidebar
const _a_sidebars = document.querySelectorAll('a.nav-link')
const _div_contents = document.querySelectorAll('.div-content')

//search form
const _div_searchForm = document.querySelector('.search-container')
const _ip_search = _div_searchForm.querySelector('input.inputSearch')

//table - tbbody
const _tbody_Res = document.querySelector('.tbRes')
const _tbody_User = document.querySelector('.tbUser')
const _tbody_Discount = document.querySelector('.tbDiscount')


//
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

// var _charsSearch = ''
// _ip_search.oninput = function () {
//     _charsSearch = this.value
// }


switch (_load) {
    case 'hostpage':
        initPageFunctions(_a_sidebars[0], _div_contents[0], NONE)
        break;
    case 'res_management':
        initPageFunctions(_a_sidebars[1], _div_contents[1], BLOCK)
        break
    case 'user_management':
        initPageFunctions(_a_sidebars[2], _div_contents[2], BLOCK)
        break
    case 'discount_management':
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
            _div_userContainer.classList.toggle(CLASS_SHOW_FLEX)
            break
        // ic notification
        case _notification:
            _div_notification.classList.toggle(CLASS_SHOW_FLEX)
            break
        // changge pass    
        case _a_usContainer[0]:
            _div_userContainer.classList.toggle(CLASS_SHOW_FLEX)
            document.getElementById('accountChangePass').style.display = BLOCK
            break
        // log out
        case _btn_logout:
            document.cookie = "token="
            _div_userContainer.classList.toggle(CLASS_SHOW_FLEX)
            window.location = "/admin_login"
            break
        default:
            _div_userContainer.classList.remove(CLASS_SHOW_FLEX)
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
    //_div_direct.style.display = status
}

socket.emit('adminJoin', { adminName: 'admin' })

axios.get(
    '/api/admin/func/getRestaurant'
)
.then(res => {
    if(res.data.status == 'success'){
        let restaurant = res.data.data.restaurant

        let tbRes = restaurant.map((item)=>
        `<tr>
            <td>${item.restaurantName}</td> 
            <td>${item.email}</td>
            <td><button class='btn btn-warning' onclick="alert('${item._id}'); ">Khóa</button></td>
            <td><button class='btn btn-primary'>Chi tiết</button></td>
        </tr>`)
        _tbody_Res.innerHTML = tbRes
        console.log(typeof restaurant)

        console.log(res.data)
    }
    else alert(res.data.error.message)
})
.catch(error => alert(console.error()))