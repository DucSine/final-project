
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

function register() {
    var formdata = new FormData()

    if(_list_inputRegister[6].files[0])
        formdata.append('banner', _list_inputRegister[6].files[0])

    formdata.append('restaurantName', _list_inputRegister[0].value)
    formdata.append('email', _list_inputRegister[1].value)
    formdata.append('pasword', _list_inputRegister[2].value)
    formdata.append('phone', _list_inputRegister[4].value)
    formdata.append('address', _list_inputRegister[5].value)
    formdata.append('type', _selectTypeRegister.value)

    axios.post('api/res/auth/register', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
    .then(res => {
        
        (res.data.status == 'success') ?
        alert(res.data.message):    
        alert(res.data.error.message) 
            
    })
    .catch(error => alert(console.error()))

    return false
}



function fogotPassword() {
    axios.post(POST_FOGOT_PASSWORD,
        {
            email: _email_fogotPass
        }
    )
        .then(res => {
            if (res.data.status == 'failed')
                alert(res.data.error.message)
            else {
                alert('Vui lòng kiểm tra email')
                window.location = '/res_hostpage'
            }

        })
        .catch(error => alert(console.error()))

    return false

}
