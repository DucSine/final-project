
function login() {
    if (_list_inputLogin[2].checked) {
        localStorage.setItem(CB_SAVE, true)
        localStorage.setItem(EMAIL_SIGN, _email_sign)
        localStorage.setItem(PASSWORD_SIGN, _password_sign)
    }
    else {
        localStorage.setItem(CB_SAVE, false)
        localStorage.setItem(EMAIL_SIGN, '')
        localStorage.setItem(PASSWORD_SIGN, '')
    }

    axios.post(POST_LOGIN,
        {
            email: _email_sign,
            password: _password_sign
        }
    )
        .then(res => {
            (res.data.status == 'failed') ?
                alert(res.data.error.message) :
                window.location = '/res_hostpage'
        })
        .catch(error => alert(console.error()))

    return false
}

function register(){
    
}

function fogotPassword() {
    axios.post(POST_FOGOT_PASSWORD,
        {
            email: _email_fogotPass
        }
    )
        .then(res => {
            if(res.data.status == 'failed') 
                alert(res.data.error.message)
            else{
                alert('Vui lòng kiểm tra email')
                window.location = '/res_hostpage'
            }
                
        })
        .catch(error => alert(console.error()))

    return false

}