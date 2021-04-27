var list_div_modal = document.getElementsByClassName('modal')
var formLogin = document.querySelector('.modal-content.login-modal-content.animate')
var checkSaveInfo = formLogin.querySelector('input.form-check-input')
var list_a_formLogin = formLogin.querySelectorAll('a.text-primary')
var list_inputAccount = formLogin.querySelectorAll('input.form-control')
var list_regis_labelError = formLogin.querySelectorAll('label.label-valid')
var list_regis_button = formLogin.querySelectorAll('button')

checkSaveInfo.checked = true
// validate
var list_pattern = {
    checkEmail: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
    checkPass: '[A-Za-z0-9]{8,30}',
}


var email = ''
var password = ''
var cb_isChecked = ''

// get data
if (Boolean(localStorage.getItem(IS_CHECKED))) {
    list_inputAccount[0].value = localStorage.getItem(LI_EMAIL)
    list_inputAccount[1].value = localStorage.getItem(LI_PASSWORD)
    checkSaveInfo.checked = localStorage.getItem(IS_CHECKED)

    email = localStorage.getItem(LI_EMAIL)
    password = localStorage.getItem(LI_PASSWORD)
}
else {
    list_inputAccount[0].value = ''
    list_inputAccount[1].value = ''
    checkSaveInfo.checked = false

    email = ''
    password = ''
}

//input text
window.oninput = function (e) {
    switch (e.target) {
        case list_inputAccount[0]:    // email
            email = list_inputAccount[0].value
            if (!email.match(list_pattern.checkEmail)) {
                list_inputAccount[0].classList.add(INPUT_INVALID)
                list_regis_labelError[0].classList.add(LABEL_INVALID)
                list_regis_button[0].disabled = true
            }
            else {
                list_inputAccount[0].classList.remove(INPUT_INVALID)
                list_regis_labelError[0].classList.remove(LABEL_INVALID)
                list_inputAccount[0].classList.add(INPUT_VALID)
                if (list_inputAccount[1].value.match(list_pattern.checkPass) != null)
                    list_regis_button[0].disabled = false
            }
            break
        case list_inputAccount[1]: // pass
            password = list_inputAccount[1].value
            if (!password.match(list_pattern.checkPass)) {
                list_inputAccount[1].classList.add(INPUT_INVALID)
                list_regis_labelError[1].classList.add(LABEL_INVALID)
                list_regis_button[0].disabled = true
            }
            else {
                list_inputAccount[1].classList.remove(INPUT_INVALID)
                list_regis_labelError[1].classList.remove(LABEL_INVALID)
                list_inputAccount[1].classList.add(INPUT_VALID)
                if (list_inputAccount[0].value.match(list_pattern.checkEmail) != null)
                    list_regis_button[0].disabled = false
            }
            break
    }
}


//onclick
window.onclick = function (e) {
    switch (e.target) {
        case checkSaveInfo:   // check box
            if (checkSaveInfo.checked) {
                localStorage.setItem(LI_EMAIL, email)
                localStorage.setItem(LI_PASSWORD, password)
                localStorage.setItem(IS_CHECKED, true)
            }
            else {
                localStorage.setItem(LI_EMAIL, '')
                localStorage.setItem(LI_PASSWORD, '')
                localStorage.setItem(IS_CHECKED, false)
            }
            break
        case list_a_formLogin[0]: // register
            list_div_modal[0].style.display = NONE
            list_div_modal[1].style.display = BLOCK
            break
        case list_a_formLogin[1]: // fogot pass
            list_div_modal[0].style.display = NONE
            list_div_modal[2].style.display = BLOCK
            break
        case list_regis_button[0]:  // btn login
            if (checkSaveInfo.checked) {
                localStorage.setItem(IS_CHECKED, true)
                localStorage.setItem(LI_EMAIL, email)
                localStorage.setItem(LI_PASSWORD, password)
            }
            axios.post(
                `/res/auth/login`,
                {
                    email: email,
                    password: password
                }
            )
                .then(res => {
                    if (res.data.status == 'failed')
                        alert(res.data.error.message)
                    else
                        window.location = '/res/hostpage'

                })
                .catch(error => alert('có lỗi xảy ra'))

            break
        case list_regis_button[1]: // btn cancel
            list_inputAccount[0].value = localStorage.getItem(LI_EMAIL)
            list_inputAccount[1].value = localStorage.getItem(LI_PASSWORD)
            checkSaveInfo.checked = Boolean(localStorage.getItem(IS_CHECKED))
            document.getElementById('login_dialog').style.display = NONE
            break

    }
}