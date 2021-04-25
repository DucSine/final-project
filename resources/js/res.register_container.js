// get element
var form_container = document.querySelector('.modal-content.register-modal-content.animate')
var list_txtPass = form_container.querySelectorAll('input')
var selectType = form_container.querySelector('select')
var btn_register = form_container.querySelector('#btn_register')

//value constructor
var password = null
var typeValue = null
var email_ismatch = null
var password_ismatch = null
var passwordConfirm_ismatch = null
var phone_ismatch = null

// patterm
var list_patterm = {
  checkEmail: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
  checkPass: '[A-Za-z0-9]{8,30}',
  checkPhone: /((09|03|07|08|05)+([0-9]{8})\b)/g,
}

//get value 
selectType.onchange = function () {
  typeValue = selectType.value
  if(typeValue == null || typeValue == 'Chọn'){
    this.classList.add('input-invalid')
  }
  else{
    this.classList.remove('input-invalid')
    this.classList.add('input-valid')
  }
}


list_txtPass[1].oninput = function () {
  email_ismatch = this.value.match(list_patterm.checkEmail)
  if (email_ismatch == null)
    list_txtPass[1].classList.add('input-invalid')
  else {
    axios.get(`/api/auth/checkemail?email=${this.value}`)
      .then(res => {
        if (res.data.status == 'failed') {
          email_ismatch = null
          alert('Email đã được sử dụng.')
          list_txtPass[1].classList.add('input-invalid')
        }
        else {
          list_txtPass[1].classList.add('input-valid')
          list_txtPass[1].classList.remove('input-invalid')
        }

      })
      .catch(error => alert('có lỗi xảy ra'))
  }

}

list_txtPass[2].oninput = function () {
  password = this.value
  password_ismatch = password.match(list_patterm.checkPass)

  if (password_ismatch == null)
    this.classList.add('input-invalid')
  else {
    this.classList.add('input-valid')
    this.classList.remove('input-invalid')
  }
}

list_txtPass[3].oninput = function () {
  if (this.value != password)
    this.classList.add('input-invalid')
  else {
    passwordConfirm_ismatch = true
    this.classList.add('input-valid')
    this.classList.remove('input-invalid')
  }
}

list_txtPass[4].oninput = function () {
  phone_ismatch = this.value.match(list_patterm.checkPhone)
  if (phone_ismatch == null)
    this.classList.add('input-invalid')
  else {
    this.classList.add('input-valid')
    this.classList.remove('input-invalid')
  }
}
function register_submit() {
  var err = []
  var checkSubmit = false
  if (typeValue == null) {
    selectType.classList.add('input-invalid')
    err.push('Vui lòng chọn loại nhà hàng.')
  }
  if (email_ismatch == null) {
    err.push('Email sai định dạng hoặc đã tồn tại')
  }
  if (password_ismatch == null) {
    err.push('Mật khẩu không chứa ký tự đặc biệt, gồm 8-30 ký tự.')
  }
  if (passwordConfirm_ismatch == null) {
    err.push('Mật khẩu không khớp')
  }
  if (phone_ismatch == null) {
    err.push('Số điện thoại không hợp lệ.')
  }
  
  console.log('ar: ' + err.length)
  if (err.length > 0) {
    var erorMessages = ''
    for(var er of err)
      erorMessages += (er + '\n')
    alert(erorMessages)
    checkSubmit = false
  }
  else checkSubmit = true
  return checkSubmit
}