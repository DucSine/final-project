// get element
var form_container = document.querySelector('.modal-content.register-modal-content.animate')
var list_regis_input = form_container.querySelectorAll('input')
var regis_selectType = form_container.querySelector('select')
var list_regis_labelError = form_container.querySelectorAll('label.label-valid')
var list_regis_button = form_container.querySelectorAll('button')
console.log(list_regis_labelError)
//value constructor
var restaurantName = ''
var email = ''
var password = ''
var passwordConfirm = ''
var type = ''
var phone = ''
var address = ''
var file = null

list_regis_input[6].onchange = function (e) {
  file = this.files[0]
  console.log(file)
  console.log(typeof file)
}

// get input text value
window.oninput = function (e) {
  switch (e.target) {
    case list_regis_input[0]:  // name
      restaurantName = list_regis_input[0].value
      if (restaurantName == '' || restaurantName == null) {
        list_regis_button[0].disabled = true
        list_regis_input[0].classList.add(INPUT_INVALID)
        list_regis_labelError[0].classList.add(LABEL_INVALID)
      }
      else {
        list_regis_input[0].classList.remove(INPUT_INVALID)
        list_regis_labelError[0].classList.remove(LABEL_INVALID)
        list_regis_input[0].classList.add(INPUT_VALID)
        list_regis_labelError[0].classList.add(LABEL_VALID)
        //set buttn 
        if(list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null 
        && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null 
        && list_regis_input[3].value == list_regis_input[2].value 
        && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
        && list_regis_input[5].value != '' 
        && regis_selectType.value != null
        && regis_selectType.value != 'Chọn'
        && regis_selectType.value != '')
        list_regis_button[0].disabled = false 
      }
      break
    case list_regis_input[1]:  // email
      email = list_regis_input[1].value
      if (!email.match(LIST_PATTERM.checkEmail)) {
        list_regis_button[0].disabled = true
        list_regis_input[1].classList.add(INPUT_INVALID)
        list_regis_labelError[2].classList.add(LABEL_INVALID)
      }
      else {
        list_regis_input[1].classList.remove(INPUT_INVALID)
        list_regis_labelError[2].classList.remove(LABEL_INVALID)
        list_regis_input[1].classList.add(INPUT_VALID)
        list_regis_labelError[2].classList.add(LABEL_VALID)
        //set buttn 
      }
      break
    case list_regis_input[2]:  // pass
      password = list_regis_input[2].value
      if (!password.match(LIST_PATTERM.checkPass)) {
        list_regis_button[0].disabled = true
        list_regis_input[2].classList.add(INPUT_INVALID)
        list_regis_labelError[3].classList.add(LABEL_INVALID)
      }
      else {
        list_regis_input[2].classList.remove(INPUT_INVALID)
        list_regis_labelError[3].classList.remove(LABEL_INVALID)
        list_regis_input[2].classList.add(INPUT_VALID)
        list_regis_labelError[3].classList.add(LABEL_VALID)
        //set buttn 
      }
      break
    case list_regis_input[3]:  // pass confirm
      passwordConfirm = list_regis_input[3].value
      if (passwordConfirm != password) {
        list_regis_button[0].disabled = true
        list_regis_input[3].classList.add(INPUT_INVALID)
        list_regis_labelError[4].classList.add(LABEL_INVALID)
      }
      else {
        list_regis_input[3].classList.remove(INPUT_INVALID)
        list_regis_labelError[4].classList.remove(LABEL_INVALID)
        list_regis_input[3].classList.add(INPUT_VALID)
        list_regis_labelError[4].classList.add(LABEL_VALID)
        //set buttn 
      }
      break
    case list_regis_input[4]:  // phone
      phone = list_regis_input[1].value
      if (phone.match(LIST_PATTERM.checkPhone)) {
        list_regis_button[0].disabled = true
        list_regis_input[4].classList.add(INPUT_INVALID)
        list_regis_labelError[5].classList.add(LABEL_INVALID)
      }
      else {
        list_regis_input[4].classList.remove(INPUT_INVALID)
        list_regis_labelError[5].classList.remove(LABEL_INVALID)
        list_regis_input[4].classList.add(INPUT_VALID)
        list_regis_labelError[5].classList.add(LABEL_VALID)
        //set buttn 
      }
      break
    case list_regis_input[5]:  // adress
      address = list_regis_input[5].value
      if (address == '' || address == null) {
        list_regis_button[0].disabled = true
        list_regis_input[5].classList.add(INPUT_INVALID)
        list_regis_labelError[6].classList.add(LABEL_INVALID)
      }
      else {
        list_regis_input[5].classList.remove(INPUT_INVALID)
        list_regis_labelError[6].classList.remove(LABEL_INVALID)
        list_regis_input[5].classList.add(INPUT_VALID)
        list_regis_labelError[6].classList.add(LABEL_VALID)
        //set buttn 
      }
      break
  }
}

//get value 



list_regis_input[1].oninput = function () {
  email_ismatch = this.value.match(list_patterm.checkEmail)
  if (email_ismatch == null)
    list_regis_input[1].classList.add('input-invalid')
  else {
    axios.get(`/api/auth/checkemail?email=${this.value}`)
      .then(res => {
        if (res.data.status == 'failed') {
          email_ismatch = null
          alert('Email đã được sử dụng.')
          list_regis_input[1].classList.add('input-invalid')
        }
        else {
          list_regis_input[1].classList.add('input-valid')
          list_regis_input[1].classList.remove('input-invalid')
        }

      })
      .catch(error => alert('có lỗi xảy ra'))
  }

}

list_regis_input[2].oninput = function () {
  password = this.value
  password_ismatch = password.match(list_patterm.checkPass)

  if (password_ismatch == null)
    this.classList.add('input-invalid')
  else {
    this.classList.add('input-valid')
    this.classList.remove('input-invalid')
  }
}

list_regis_input[3].oninput = function () {
  if (this.value != password)
    this.classList.add('input-invalid')
  else {
    passwordConfirm_ismatch = true
    this.classList.add('input-valid')
    this.classList.remove('input-invalid')
  }
}

list_regis_input[4].oninput = function () {
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
    regis_selectType.classList.add('input-invalid')
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
    for (var er of err)
      erorMessages += (er + '\n')
    alert(erorMessages)
    checkSubmit = false
  }
  else checkSubmit = true
  return checkSubmit
}


regis_selectType.onchange = function () {
  typeValue = regis_selectType.value
  if (typeValue == null || typeValue == 'Chọn') {
    this.classList.add('input-invalid')
  }
  else {
    this.classList.remove('input-invalid')
    this.classList.add('input-valid')
  }
}