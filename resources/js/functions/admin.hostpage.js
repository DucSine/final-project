
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
                    <td><button class='btn btn-warning' onclick="alert('${item._id}'); ">Khóa</button></td>
                    <td><button class='btn btn-primary'>Chi tiết</button></td>
                </tr>`
                )

                _tbody_Res.innerHTML = tbRes.join(' ')
            }
            else alert(res.data.error.message)
        })
        .catch(error => console.log(error))
    // switch(_typeId){ 
    //     case "606c29b97141a71498bd32d8" : // Quán bún, phở, hủ tiếu,...
    //     break
    //     case "606c29c27141a71498bd32d9" : // Quán cơm
    //     break
    //     case "606c29df7141a71498bd32da" : //Quán coffee, trà sữa,...
    //     break
    //     case "606c29fb7141a71498bd32db" : // Đồ ăn nhanh (bánh mỳ, fast foods,...)
    //     break
    //     case "606c2a067141a71498bd32dc" :// Đồ ăn vặt
    //     break
    //     case "60829a97c0f329750c092ee0" : // Khác
    //     break
    //     default://tất cả
    //         break
    // }
}

function resLock(value) {

    let resId = value.split(',')[0]
    let status = value.split(',')[1]
    let isLock = false
    status == 'false' ? isLock = true : isLock = false

    axios.post(POST_ADMIN_EDIT_LOCK_RESTAURANT,{resId, isLock})
    .then(res => {
        if (res.data.status == 'success') {
            alert('Cập nhật thành công.')
        }
        else alert(res.data.error.message)
    })
    .catch(error => console.log(error))
}