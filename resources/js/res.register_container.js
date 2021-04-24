// get element
var form_container = document.querySelector('.modal-content.register-modal-content.animate')
var list_inputText = form_container.querySelectorAll('input')
var selectType = form_container.querySelector('select')
var btn_register = form_container.querySelector('#btn_register')

//value constructor
var typeValue = null
var email = null
var password = null
var passwordConfirm = null
var phone = null

// patterm
var list_patterm = {
  checkEmail: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
  checkPass: '[A-Za-z0-9]{8,30}',
  checkPhone: /((09|03|07|08|05)+([0-9]{8})\b)/g,
}

//get value 
selectType.onchange = function () {
  typeValue = selectType.value
}
var check = false
list_inputText[1].oninput = function () {
  email = this.value
}

list_inputText[2].oninput = function () {
  password = this.value
}

list_inputText[3].oninput = function () {
  passwordConfirm = this.value
}

list_inputText[4].oninput = function () {
  phone = this.value
}

function register_submit() {
  var err = []
  if (typeValue == null) {
    err.push('Vui lòng chọn loại nhà hàng.') 
  }
  if (email.match(list_patterm.checkEmail) == null) {
    err.push('Email sai định dạng.')
  }
  /*
  if (password.match(list_patterm.checkPass) == null) {
    err.message = 'Mật khẩu không chứa ký tự đặc biệt, gồm 8-30 ký tự.'
  }
  if (password != passwordConfirm) {
    err.message = 'Mật khẩu không khớp.'
  }
  if (phone.match(list_patterm.checkPhone) == null) {
    err.message = 'Số điện thoại không hợp lệ'
  }
  */
  if (err.length > 0) {
    //alert(err)
    console.log(err)
    return false
  }else
    return true
}

//check email exists
function checkEmailExists(email) {
  axios.get(`/api/auth/checkemail?email=${email}`)
    .then(res => {
      if (res.data.status == 'failed')
        return false
      else
        return true
    })
    .catch(error => alert('có lỗi xảy ra'))
}


var ee = '093456432'
var eee = '0929233066'
console.log(list_patterm)
console.log('check true: ' + eee.match(list_patterm.checkPhone))
console.log('check false: ' + ee.match(list_patterm.checkPhone))


