const _div_login = document.getElementById('adLogin')
const _list_inputLogin = _div_login.querySelectorAll('input')
const _list_btn_login = _div_login.querySelectorAll('button')
const _a_forgotPass = _div_login.querySelector('a')
const _ip_forgotPass = document.getElementById('fg_email')

var _cb_save = localStorage.getItem(AD_CB_SAVE)
var _ad_username = ''
var _ad_password = ''

if (Boolean(_cb_save)) {
    _ad_username = localStorage.getItem(AD_USERNAME)
    _ad_password = localStorage.getItem(AD_PASSWORD)
} else {
    _ad_username = ''
    _ad_password = ''
}