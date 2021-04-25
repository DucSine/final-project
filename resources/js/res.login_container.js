var list_div_modal = document.getElementsByClassName('modal')
var formLogin = document.querySelector('.modal-content.login-modal-content.animate')
var checkSaveInfo = formLogin.querySelector('input.form-check-input')
var aLogin = formLogin.querySelectorAll('a.text-primary')
var list_txtPass = formLogin.querySelectorAll('input.form-control')
//
var list_patterm = {
    checkEmail: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
    checkPass: '[A-Za-z0-9]{8,30}',
}
//
var txt_li_email = ''
var txt_li_password = ''
var ischecked = ''

checkSaveInfo.checked = true
//
if (localStorage.getItem('ischecked')== 'true') {
    list_txtPass[0].value = localStorage.getItem('li_email')
    list_txtPass[1].value = localStorage.getItem('li_password')
    checkSaveInfo.checked = localStorage.getItem('ischecked')

    txt_li_email = localStorage.getItem('li_email')
    txt_li_password = localStorage.getItem('li_password')
}
else {
    list_txtPass[0].value = ''
    list_txtPass[1].value = ''
    checkSaveInfo.checked = false

    txt_li_email = ''
    txt_li_password = ''
}


list_txtPass[0].oninput = function () {
    txt_li_email = this.value
    if (txt_li_email.match(list_patterm.checkEmail) == null)
        this.classList.add('input-invalid')
    else {
        this.classList.remove('input-invalid')
        this.classList.add('input-valid')
    }
}

list_txtPass[1].oninput = function () {
    txt_li_password = this.value
    if (txt_li_password.match(list_patterm.checkPass) == null)
        this.classList.add('input-invalid')
    else {
        this.classList.remove('input-invalid')
        this.classList.add('input-valid')
    }
}

checkSaveInfo.onclick = function () {
    if (this.checked) {
        localStorage.setItem('li_email', txt_li_email)
        localStorage.setItem('li_password', txt_li_password)
        localStorage.setItem('ischecked', true)
    }
    else {
        localStorage.setItem('li_email', '')
        localStorage.setItem('li_password', '')
        localStorage.setItem('ischecked', false)
    }
}

aLogin[0].onclick = function () {
    list_div_modal[0].style.display = "none"
    list_div_modal[1].style.display = "block"
}
aLogin[1].onclick = function () {
    list_div_modal[0].style.display = "none"
    list_div_modal[2].style.display = "block"
}

function postLogin() {
    if (txt_li_email.match(list_patterm.checkEmail) == null)
        alert('Email không đúng định dạng.')
    else if (txt_li_password.match(list_patterm.checkPass) == null)
        alert('Password không chứa ký tự đặc biệt, gồm 8-30 ký tự')
    else {
        if (checkSaveInfo.checked) {
            localStorage.setItem('ischecked', true)
            localStorage.setItem('li_email', txt_li_email)
            localStorage.setItem('li_password', txt_li_password)

        }
        axios.post(
            `/res/auth/login`,
            {
                email: txt_li_email,
                password: txt_li_password
            })
            .then(res => {
                if (res.data.status == 'failed')
                    alert(res.data.error.message)
                else {
                    alert('Đăng nhập thành công')
                    window.location = '/res/hostpage'
                }

            })
            .catch(error => alert('có lỗi xảy ra'))
    }

}

// When the user clicks anywhere outside of the modal, close it
/*window.onclick = function(event) {
    switch(event.target){
        case modal[0] :
            modal[0].style.display = "none"
            break
            case modal[1] :
            modal[1].style.display = "none"
            break
            case modal[2] :
            modal[1].style.display = "none"
            break
    }
}*/

