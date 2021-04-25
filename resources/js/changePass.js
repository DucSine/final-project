var form_changePass = document.querySelector('form.modal-content.changepassmodal-content.animate')
var list_txtPass = form_changePass.querySelectorAll('input')
var pattern = '[A-Za-z0-9]{8,30}'

var password = ''
var newPassword = ''
var passwordConfirm = ''

list_txtPass[0].oninput = function () {
    password = this.value
    if (password.match(pattern) == null)
        this.classList.add('input-invalid')
    else {
        this.classList.remove('input-invalid')
        this.classList.add('input-valid')
    }
}
list_txtPass[1].oninput = function () {
    newPassword = this.value
    if (newPassword.match(pattern) == null || password == newPassword)
        this.classList.add('input-invalid')
    else {
        this.classList.remove('input-invalid')
        this.classList.add('input-valid')
    }
}
list_txtPass[2].oninput = function () {
    passwordConfirm = this.value
    if (passwordConfirm != newPassword)
        this.classList.add('input-invalid')
    else {
        this.classList.remove('input-invalid')
        this.classList.add('input-valid')
    }
}



function changePass() {
    if (password.match(pattern) == null || newPassword.match(pattern) == null)
        alert('Mật khẩu không đúng định dạng')
    else if (password == newPassword)
        alert('Mật khẩu mới phải khác mật khẩu cũ')
    else if (newPassword != passwordConfirm)
        alert('Mật khẩu không khớp')
    else {
        //post
        axios.post(
            '/res/auth/changePassword',
            {
                password,
                newPassword
            }
        )
        .then(res => {
            if (res.data.status == 'failed')
                alert(res.data.error.message)
            else {
                alert('Đổi mật khẩu thành công')
                window.location = '/res/hostpage'
            }

        })
        .catch(error => alert('có lỗi xảy ra'))
    }
}