const _list_div_modal = document.querySelectorAll('.modal')

const _formLogin = _list_div_modal[0].querySelector('form.modal-content')
const _formRegister = _list_div_modal[1].querySelector('form.modal-content')
const _formForgotPass = _list_div_modal[2].querySelector('form.modal-content')

const _list_inputLogin=_formLogin.querySelectorAll('input')
const _list_inputRegister=_formRegister.querySelectorAll('input')
const _list_inputForgotPass=_formForgotPass.querySelectorAll('input')

const _selectTypeRegister = _formRegister.querySelector('select') // value = ''

const _list_aLogin = _formLogin.querySelectorAll('a.text-primary')

const _list_btnLogin = _formLogin.querySelectorAll('.btn')
const _list_btnRegister= _formRegister.querySelectorAll('.btn')

// login
var _email_sign = ''
var _password_sign = ''
var _save = ''

//register

//fogot pass
var _email_fogotPass = ''

// get data sign
if (Boolean(localStorage.getItem(CB_SAVE))) {
    _list_inputLogin[0].value = localStorage.getItem(EMAIL_SIGN)
    _list_inputLogin[1].value = localStorage.getItem(PASSWORD_SIGN)
    _list_inputLogin[2].checked = localStorage.getItem(CB_SAVE)

    _email_sign = localStorage.getItem(EMAIL_SIGN)
    _password_sign = localStorage.getItem(PASSWORD_SIGN)
}

//input text
window.oninput = function (e) {
    switch (e.target) {
        //login
        case _list_inputLogin[0]:    // email
            _email_sign = e.target.value
            break
        case _list_inputLogin[1]: // pass
            _password_sign = e.target.value
            break

        //register

        //forgot pass
        case _list_inputForgotPass[0]:
            _email_fogotPass = e.target.value
            break
    }
}

//onclick
window.onclick = function (e) {
    switch (e.target) {
        // login
        case _list_inputLogin[2]:   // check box
            _save = e.target.checked
            break
        case _list_aLogin[0]: // register
            _list_div_modal[0].style.display = NONE
            _list_div_modal[1].style.display = BLOCK
            break
        case _list_aLogin[1]: // fogot pass
            _list_div_modal[0].style.display = NONE
            _list_div_modal[2].style.display = BLOCK
            break
        case _list_btnLogin[1]: // btn cancel
            _list_inputLogin[0].value = localStorage.getItem(EMAIL_SIGN)
            _list_inputLogin[1].value = localStorage.getItem(PASSWORD_SIGN)
            _list_inputLogin[2].checked = Boolean(localStorage.getItem(CB_SAVE))
            document.getElementById('login_dialog').style.display = NONE
            break

        //register


    }
}
