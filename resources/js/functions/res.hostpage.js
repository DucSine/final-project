set_btn_direct_food()

// function showListProduct(page) {
//     axios.get(GET_PRODUCT + `?p=${page}`)
//         .then(res => {
//             if (res.data.status == 'success') {
//                 _p_productsTotal.innerText = `Tổng sản phẩm: ${res.data.data.foodTotal}`
//                 for (var item of res.data.data.food) {
//                     var productItem = `<li onclick="alert()">
//                                 <div class="media border p-1">
//                                     <img src="${item.image}" class="mr-3 mt-3 img-thumbnail" style="width:80px;">
//                                     <div class="media-body">
//                                         <label style="font-size: x-large;"><b>${item.foodName}</b></label>
//                                         <i class="fas fa-star text-warning" style="float: right;"> 
//                                             <b style="color: black">${item.rate}</b>
//                                         </i>
//                                         <p><b>Giá:&nbsp;</b>${item.price}đ</p>  
//                                         <p>${item.buys} lượt mua </p>    
//                                     </div>
//                                 </div>
//                             </li>`

//                     var prli = document.createElement('li')
//                     prli.innerHTML = productItem
//                     _ul_product.appendChild(prli)
//                 }
//                 // for(var page = 2; page <= Number(res.data.data.pageTotal); page++){
//                 //     var btn_page = document.createElement('button')
//                 //     btn_page.classList.add('btn')
//                 //     btn_page.innerText = page;
//                 //     _list_btn_next.appendChild(btn_page)
//                 // }

//             }
//             else
//                 alert('Có lỗi xảy ra.')
//         })
//         .catch(error => alert(error.message))
// }








function reportContent() {

}
function billContent() {

}
function discountCodeContent() {

}

//init page after click sidebar
// function initPageFunctions(tagA, tagDiv) {
//     for (var aItem of _a_sidebars)
//         (aItem == tagA) ?
//             aItem.classList.add(CLASS_ACTIVE) :
//             aItem.classList.remove(CLASS_ACTIVE)
//     for (var divItem of _div_contents)
//         (divItem == tagDiv) ?
//             divItem.style.display = BLOCK :
//             divItem.style.display = NONE
// }


function foodSearch(){
    var isKey = location.href.search('&keySearch')
    if(isKey = -1) 
        location.replace(location.href + `&keySearch=${_charsSearch}`)
    else
        location.replace(location.href.slice(0,isKey) + `&keySearch=${_charsSearch}`)
}


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
    if (_foodPage == '1') {
        _btn_next.disabled == true
        _btn_pre.disabled = true
    } else {
        if (_page == '1')
            _btn_pre.disabled = true
        else
            _btn_pre.disabled = false

        if (_page == _foodPage)
            _btn_next.disabled = true
        else
            _btn_next.disabled = false
    }
}

function getPageTotal() {

}