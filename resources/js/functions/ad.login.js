function adLogin(){
    if(_list_inputLogin[2].checked){
        localStorage.setItem(AD_CB_SAVE, true)
        localStorage.setItem(AD_USERNAME, _list_inputLogin[0].value)
        localStorage.setItem(AD_PASSWORD, _list_inputLogin[1].value)
    }
    else{
        localStorage.setItem(AD_CB_SAVE, false)
        localStorage.setItem(AD_USERNAME, '')
        localStorage.setItem(AD_PASSWORD, '')
    }

    axios.post(
        POST_ADMIN_LOGIN,
        {
            username:_list_inputLogin[0].value,
            password: _list_inputLogin[1].value
        }
    )
    .then(res => {
        if(res.data.status == 'success'){
            alert(res.data.data.message)
            window.location = GET_ADMIN_HOST_PAGE
        }
        else alert(res.data.error.message)
    })
    .catch(error => alert(console.error()))
    return false
}


function fogotPassword(){
    axios.post(POST_ADMIN_FORGOT_PASSWORD,
        {
            email: _ip_forgotPass.value
        }
    )
        .then(res => {
            if (res.data.status == 'failed')
                alert(res.data.error.message)
            else {
                alert('Vui lòng kiểm tra email')
                location.reload()
            }
        })
        .catch(error => alert(console.error()))

    return false
}

