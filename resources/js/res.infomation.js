var form_resInfo = document.querySelector('.modal-content.accountInfo-modal-content.animate') //form
var list_iconEditor = form_resInfo.querySelectorAll('i')  // list icon edit
var list_regis_input = form_resInfo.querySelectorAll('input') // list input
var b_resType = form_resInfo.querySelector('#ifb_resTypeName') // type name
var regis_selectType = form_resInfo.querySelector('select')  // choose type
var list_optionItem = regis_selectType.querySelectorAll('option.dropdown-item') // type item
var img_banner = form_resInfo.querySelector('img#ifshow_image.img.img-thumbnail.img-circle') // banner
var list_regis_button = form_resInfo.querySelectorAll('button.btn') // list button

var resName = ''
var resType = ''
var resType_id = ''
var resPhone = ''
var resAddress = ''
var src_resImage = ''

var list_pattern = {
    checkPhone: /((09|03|07|08|05)+([0-9]{8})\b)/g
}

// init key style
const NONE = 'none'
const INLINE = 'inline'
// init key valid
const VALID = 'input-valid'
const INVALID = 'input-invalid'
// init key localStorage
const RES_NAME = 'resName'
const RES_TYPE = 'resType'
const RES_TYPE_ID = 'resType_id'
const RES_PHONE = 'resPhone'
const RES_ADDRESS = 'resAddress'
const RES_BANNER = 'resBanner'

//save data to backup
localStorage.setItem(RES_NAME, list_regis_input[0].value)
localStorage.setItem(RES_TYPE, b_resType.innerText)
localStorage.setItem(RES_PHONE, list_regis_input[1].value)
localStorage.setItem(RES_ADDRESS, list_regis_input[2].value)
localStorage.setItem(RES_BANNER, img_banner.src)
//
for (var item of list_optionItem)
    if (item.innerText.trim() == b_resType.innerText.trim())
        localStorage.setItem(RES_TYPE_ID, item.value)


console.log(resType_id == localStorage.getItem(RES_TYPE_ID))
console.log(resType_id)
console.log(localStorage.getItem(RES_TYPE_ID))



//event oninput (text)
window.oninput = function (e) {
    switch (e.target) {
        case list_regis_input[0]: //res name
            resName = list_regis_input[0].value
            if (resName == '') {
                alert('Tên không được để trống.')
                list_regis_input[0].classList.add(INVALID)
                list_regis_button[0].disabled = true
            }
            else {
                list_regis_input[0].classList.add(VALID)
                list_regis_input[0].classList.remove(INVALID)
                list_regis_button[0].disabled = false
            }
            break
        case list_regis_input[1]: // res phone
            resPhone = list_regis_input[1].value
            if (!resPhone.match(list_pattern.checkPhone)) {
                alert('Số điện thoại bạn nhập không hợp lệ.')
                list_regis_input[1].classList.add(INVALID)
                list_regis_button[0].disabled = true
            }
            else {
                list_regis_input[1].classList.add(VALID)
                list_regis_input[1].classList.remove(INVALID)
                list_regis_button[0].disabled = false
            }
            break
        case list_regis_input[2]: // res address
            resAddress = list_regis_input[2].value
            if (resAddress == '') {
                alert('Địa chỉ không được để trống')
                list_regis_input[2].classList.add(INVALID)
                list_regis_button[0].disabled = true
            }
            else {
                list_regis_input[2].classList.add(VALID)
                list_regis_input[2].classList.remove(INVALID)
                list_regis_button[0].disabled = false
            }
            break
    }
}


// event onchange (type, banner)
window.onchange = function (e) {
    switch (e.target) {
        case regis_selectType: // choose image
            resType_id = regis_selectType.value
            if (resType_id == localStorage.getItem(RES_TYPE_ID).trim())
                list_regis_button[0].disabled = true
            else if (resType_id == null || resType_id == 'Chọn' || resType_id == '') {
                alert('Vui lòng chọn loại nhà hàng.')
                list_regis_button[0].disabled = true
            }
            else {
                for (var item of list_optionItem)
                    if (regis_selectType.value == item.value)
                        resType = item.innerText
                list_regis_button[0].disabled = false
            }
            break
        case list_regis_input[3]:
            var splitFileName = list_regis_input[3].value.split('.')
            const fileFormat = ['gif', 'GIF', 'png', 'PNG', 'jpg', 'JPG']
            var rs = fileFormat.some((item) => item == splitFileName[splitFileName.length - 1])
            if (rs)
                list_regis_button[0].disabled = false
            else {
                alert('File không đúng định dạng. \nChỉ chấp nhận các định dạng sau: .gif, .png, .jpg')
                list_regis_button[0].disabled = true
            }
            break
    }
}

//event onclick
window.onclick = function (e) {
    switch (e.target) {
        case list_iconEditor[0]: //res name
            list_iconEditor[0].style.display = NONE
            list_regis_input[0].disabled = false
            break
        case list_iconEditor[1]: // res type
            list_iconEditor[1].style.display = NONE
            b_resType.style.display = NONE
            regis_selectType.style.display = INLINE
            break
        case list_iconEditor[2]: // phone
            list_iconEditor[2].style.display = NONE
            list_regis_input[1].disabled = false
            break
        case list_iconEditor[3]: // adress
            list_iconEditor[3].style.display = NONE
            list_regis_input[2].disabled = false
            break
        case list_regis_button[0]:  //btn update
            //upload
            //post axios,
            //update localStorage

            break
        case list_regis_button[1]: // btn cancle: rollback and cancle
            // res name
            list_iconEditor[0].style.display = INLINE
            list_regis_input[0].value = localStorage.getItem(RES_NAME)
            list_regis_input[0].disabled = true
            // res type
            list_iconEditor[1].style.display = INLINE
            b_resType.innerText = localStorage.getItem(RES_TYPE)
            b_resType.style.display = INLINE
            regis_selectType.style.display = NONE
            // res phone
            list_iconEditor[2].style.display = INLINE
            list_regis_input[1].value = localStorage.getItem(RES_PHONE)
            list_regis_input[1].disabled = true
            // res address
            list_iconEditor[3].style.display = INLINE
            list_regis_input[2].value = localStorage.getItem(RES_ADDRESS)
            list_regis_input[2].disabled = true
            //rollback banner
            img_banner.src = localStorage.getItem(RES_BANNER)
            //input 
            list_regis_input[3].value = ''
            // hidden form
            list_regis_button[0].disabled = true
            document.getElementById('accountInfo').style.display = NONE
            break
    }
}

//load image banner
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#ifshow_image').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#ifimage").change(function () {
    readURL(this);
});
//lỗi select