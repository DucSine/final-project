
//resType
function resTypeChanged(object) {
    console.log(object.value)
    _typeId = object.value
    let getDataURL = ''
    _typeId == 1 ?
        getDataURL = GET_ADMIN_GET_ALL_RESTAURANT :
        getDataURL = `${GET_ADMIN_GET_ALL_RESTAURANT}?type=${_typeId}`
    console.log(getDataURL)

    axios.get(getDataURL)
        .then(res => {
            if (res.data.status == 'success') {
                let restaurant = res.data.data.restaurant

                let tbRes = restaurant.map((item) =>
                    `<tr>
                    <td>${item.restaurantName}</td> 
                    <td>${item.email}</td>
                    <td><button class='btn btn-warning' onclick="resLock('${item._id},${item.isLock}'); ">${item.isLock ? this.innerText= 'Mở Khóa':this.innerText='Khóa'}</button></td>
                    <td><button class='btn btn-primary' onclick="resDetail('${item._id}')">Chi tiết</button></td>
                </tr>`
                )

                _tbody_Res.innerHTML = tbRes.join(' ')
            }
            else alert(res.data.error.message)
        })
        .catch(error => console.log(error))
}

function resLock(value) {

    let resId = value.split(',')[0]
    let status_lock = value.split(',')[1]
    let isLock = false
    status_lock == 'false' ? isLock = true : isLock = false

    axios.post(POST_ADMIN_EDIT_LOCK_RESTAURANT,{resId, isLock})
    .then(res => {
        if (res.data.status == 'success') {
            alert('Cập nhật thành công.')
            localStorage.setItem('_typeId', _typeId)
            location.reload()
                
        }
        else alert(res.data.error.message)
    })
    .catch(error => console.log(error))
}

function resDetail(resId){


}