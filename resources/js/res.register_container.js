/*

//get element
var formRegister = document.querySelector('.modal-content.register-modal-content.animate') // form
var list_regis_input = formRegister.querySelectorAll('input') // input
var regis_selectType = formRegister.querySelector('select')// select type
var list_regis_labelError = formRegister.querySelectorAll('label.label-valid') // lb_error
var list_regis_button = formRegister.querySelectorAll('button') // list button
//var constructor
var regis_resName = ''
var regis_resEmail = ''
var regis_resPass = ''
var regis_resPassConfirm = ''
var regis_resPhone = ''
var regis_resAddress = ''
var regis_resType = 'Chọn'

// input valid
window.oninput = function (e) {
  switch (e.target) {
    case list_regis_input[0]: // res name
      regis_resName = e.target.value
      if (e.target.value == '') {
        e.target.classList.add(INPUT_INVALID)
        list_regis_labelError[0].classList.add(LABEL_INVALID)
        list_regis_button[0].disabled = true
      }
      else {
        e.target.classList.remove(INPUT_INVALID)
        e.target.classList.add(INPUT_VALID)
        list_regis_labelError[0].classList.remove(LABEL_INVALID)
        //set btn
        if (
          list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null
          && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null
          && list_regis_input[3].value == list_regis_input[2].value
          && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
          && list_regis_input[5].value != ''
          && regis_selectType != 'Chọn'
        )
          list_regis_button[0].disabled = false
      }
      break
    case list_regis_input[1]: // email
      regis_resEmail = e.target.value
      if (!e.target.value.match(LIST_PATTERM.checkEmail)) {
        e.target.classList.add(INPUT_INVALID)
        list_regis_labelError[2].classList.add(LABEL_INVALID)
        list_regis_button[0].disabled = true
      }
      else {
        e.target.classList.remove(INPUT_INVALID)
        e.target.classList.add(INPUT_VALID)
        list_regis_labelError[2].classList.remove(LABEL_INVALID)
        //set btn
        if (
          list_regis_input[0].value != ''
          && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null
          && list_regis_input[3].value == list_regis_input[2].value
          && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
          && list_regis_input[5].value != ''
          && regis_selectType != 'Chọn'
        )
          list_regis_button[0].disabled = false
      }
      break
    case list_regis_input[2]: // pass
      regis_resPass = e.target.value
      if (!e.target.value.match(LIST_PATTERM.checkPass)) {
        e.target.classList.add(INPUT_INVALID)
        list_regis_labelError[3].classList.add(LABEL_INVALID)
        list_regis_button[0].disabled = true
      }
      else {
        e.target.classList.remove(INPUT_INVALID)
        e.target.classList.add(INPUT_VALID)
        list_regis_labelError[3].classList.remove(LABEL_INVALID)
        //set btn
        if (
          list_regis_input[0].value != ''
          && list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null
          && list_regis_input[2].value == list_regis_input[3].value
          && list_regis_input[3].value == list_regis_input[2].value
          && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
          && list_regis_input[5].value != ''
          && regis_selectType != 'Chọn'
        )
          list_regis_button[0].disabled = false
      }
      break
    case list_regis_input[3]: // pass confirm
      regis_resPassConfirm = e.target.value
      if (e.target.value != regis_resPass) {
        e.target.classList.add(INPUT_INVALID)
        list_regis_labelError[4].classList.add(LABEL_INVALID)
        list_regis_button[0].disabled = true
      }
      else {
        e.target.classList.remove(INPUT_INVALID)
        e.target.classList.add(INPUT_VALID)
        list_regis_labelError[4].classList.remove(LABEL_INVALID)
        //set btn
        if (
          list_regis_input[0].value != ''
          && list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null
          && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null
          && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
          && list_regis_input[5].value != ''
          && regis_selectType != 'Chọn'
        )
          list_regis_button[0].disabled = false
      }
      break
    case list_regis_input[4]: // phone
      regis_resPhone = e.target.value
      if (!e.target.value.match(LIST_PATTERM.checkPhone)) {
        e.target.classList.add(INPUT_INVALID)
        list_regis_labelError[5].classList.add(LABEL_INVALID)
        list_regis_button[0].disabled = true
      }
      else {
        e.target.classList.remove(INPUT_INVALID)
        e.target.classList.add(INPUT_VALID)
        list_regis_labelError[5].classList.remove(LABEL_INVALID)
        //set btn
        if (
          list_regis_input[0].value != ''
          && list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null
          && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null
          && list_regis_input[3].value == list_regis_input[2].value
          && list_regis_input[5].value != ''
          && regis_selectType != 'Chọn'
        )
          list_regis_button[0].disabled = false
      }
      break
    case list_regis_input[5]: // address
      regis_resAddress = e.target.value
      if (e.target.value == '') {
        e.target.classList.add(INPUT_INVALID)
        list_regis_labelError[6].classList.add(LABEL_INVALID)
        list_regis_button[0].disabled = true
      }
      else {
        e.target.classList.remove(INPUT_INVALID)
        e.target.classList.add(INPUT_VALID)
        list_regis_labelError[6].classList.remove(LABEL_INVALID)
        //set btn
        if (
          list_regis_input[0].value != ''
          && list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null
          && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null
          && list_regis_input[3].value == list_regis_input[2].value
          && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
          && regis_selectType != 'Chọn'
        )
          list_regis_button[0].disabled = false
      }
      break
  }
}

// onchange select type, banner
window.onchange = function (e) {
  switch (e.target) {
    case regis_selectType:
      regis_resType = e.target.value
      if (e.target.value == 'Chọn') {
        regis_selectType.classList.add(INPUT_INVALID)
        list_regis_labelError[1].classList.add(LABEL_INVALID)
        list_regis_button[0].disabled = false
      }
      else {
        regis_selectType.classList.remove(INPUT_INVALID)
        regis_selectType.classList.add(INPUT_VALID)
        list_regis_labelError[1].classList.remove(LABEL_INVALID)
        //set button
        if (
          list_regis_input[0].value != ''
          && list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null
          && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null
          && list_regis_input[3].value == list_regis_input[2].value
          && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
          && list_regis_input[5].value != ''
        )
          list_regis_button[0].disabled = false
      }
      break
    case list_regis_input[6]:
      var splitFileName = list_regis_input[6].value.split('.')
      const fileFormat = ['gif', 'GIF', 'png', 'PNG', 'jpg', 'JPG']
      var rs = fileFormat.some((item) => item == splitFileName[splitFileName.length - 1])
      if (!rs) {
        list_regis_button[0].disabled = true
        alert('File không đúng định dạng. \nChỉ chấp nhận các định dạng sau: .gif, .png, .jpg')
      }
      else {
        if (
          list_regis_input[0].value != ''
          && list_regis_input[1].value.match(LIST_PATTERM.checkEmail) != null
          && list_regis_input[2].value.match(LIST_PATTERM.checkPass) != null
          && list_regis_input[3].value == list_regis_input[2].value
          && list_regis_input[4].value.match(LIST_PATTERM.checkPhone) != null
          && list_regis_input[5].value != ''
          && regis_selectType != 'Chọn'
        )
          list_regis_button[0].disabled = false
      }
      break
  }
}
//register

function funcRegister() {
  alert(list_regis_input[6].files[0])
  var formData = new FormData();
  formData.append("banner", list_regis_input[6].files[0]);
  axios.post('upload_file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
  /*axios.post(
    '/res/auth/register',
    {
      restaurantName: regis_resName,
      email: regis_resEmail,
      type: regis_resType,
      password: regis_resPass,
      phone: regis_resPhone,
      address: regis_resAddress
    }
  )
    .then(res => {
      if (res.data.status == 'failed')
        alert(res.data.error.message)
      else
        window.location = '/res/hostpage'
    })
    .catch(error => alert('có lỗi xảy ra'))
}*/
