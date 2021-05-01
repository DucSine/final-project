const _restPass_div = document.getElementById('resetPass_container')
const _afterLogin_div = document.getElementById('afterRegister_container')
const _restEmail_div = document.getElementById('resetEmail_container')

const query = location.href.split('?')[1]
const _funcId = Number((query.split('&')[0]).split('=')[1])
const _auth = query.split('&')[1].split('=')[1]
console.log(_auth)
console.log(_funcId)
switch (_funcId) {
    case 01:
        _restPass_div.style.display = BLOCK
        _afterLogin_div.style.display = NONE
        _restEmail_div.style.display = NONE
        break
    case 02:
        _restPass_div.style.display = NONE
        _afterLogin_div.style.display = BLOCK
        _restEmail_div.style.display = NONE
        break
    default:
        alert('Có lỗi xảy ra.')
        break
}

function fresetPass() {

    axios.post(
        `/resetpass?token=${_auth}`,
        {
            password: 'duc123456789'
        }
    )
    .then(res => {
        alert(res.data)
        if(res.data.status == 'failed')
            alert(res.data.error.message)
        else{
            if(res.data.oblect =='res')
            window.location = '/res_hostpage'
        }
            
    })
    .catch(error => alert(console.error()))
    return false
}

function a_getEmailAgain() {
    alert('Vui lòng kiểm tra email.')
    //axios.post()
}

function a_changeEmail() {
    _restPass_div.style.display = NONE
    _afterLogin_div.style.display = NONE
    _restEmail_div.style.display = BLOCK
}

function cancleChangeEmail() {
    _restPass_div.style.display = NONE
    _afterLogin_div.style.display = BLOCK
    _restEmail_div.style.display = NONE
}