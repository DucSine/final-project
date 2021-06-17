//search
function search() {
    let ip_search = document.querySelector('input.inputSearch')

    axios.get(GET_ADMIN_GET_RESTAURANT_BY_NAME + ip_search.value)
        .then(res => {
            if (res.data.status == 'success') {
                let restaurant = res.data.data.restaurant

                let tbRes = restaurant.map((item) =>
                    `<tr>
                    <td>${item.restaurantName}</td> 
                    <td>${item.email}</td>
                    <td>
                        <button class='btn btn-warning' onclick="resLock('${item._id},${item.isLock}')">
                            ${item.isLock ? this.innerText = 'Mở Khóa' : this.innerText = 'Khóa'}
                        </button>
                    </td>
                    <td>
                        <button class='btn btn-primary' onclick="resDetail('${item._id}')">
                            Chi tiết
                        </button>
                    </td>
                </tr>`
                )
                _tbody_Res.innerHTML = tbRes.join(' ')
            }
            else console.log(res.data.error.message)
        })
        .catch(error => console.log(error))
    //
    axios.get(GET_ADMIN_GET_USERS_BY_USERNAME + ip_search.value)
        .then(res => {
            if (res.data.status == 'success') {
                let users = res.data.data.users
                let tbUser = users.map((item) =>
                    `<tr>
                    <td>${item.fullName}</td> 
                    <td>${item.username}</td>
                    <td>
                        <button class='btn btn-warning' onclick="userLock('${item._id},${item.isLock}')">
                            ${item.isLock ? this.innerText = 'Mở Khóa' : this.innerText = 'Khóa'}
                        </button>
                    </td>
                    <td>
                        <button class='btn btn-primary' onclick="userDetail('${item._id}')">
                            Chi tiết
                        </button>
                    </td>
                </tr>`)
                _tbody_User.innerHTML = tbUser.join(' ')
            }
            else console.log(res.data.error.message)
        })
        .catch(error => console.log(error))
}

async function report() {

}


//restaurant
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
                    <td><button class='btn btn-warning' onclick="resLock('${item._id},${item.isLock}'); ">${item.isLock ? this.innerText = 'Mở Khóa' : this.innerText = 'Khóa'}</button></td>
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

    axios.post(POST_ADMIN_EDIT_LOCK_RESTAURANT, { resId, isLock })
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

function resDetail(resId) {
    _div_resDetail.style.display = BLOCK

    axios.get(GET_ADMIN_GET_RESTAURANT_BY_ID + resId)
        .then(res => {
            if (res.data.status == 'success') {
                let restaurant = res.data.data.restaurant
                _b_detail_resName.innerText = restaurant.restaurantName
                _b_detail_resType.innerText = restaurant.type.typeName
                _b_detail_resPhone.innerText = restaurant.phone
                _b_detail_resEmail.innerText = restaurant.email
                _b_detail_resAddress.innerText = restaurant.address

                restaurant.isVerified == true ?
                    _b_detail_resVerified.innerText = 'Đã xác thực' :
                    _b_detail_resVerified.innerText = 'Chưa xác thực'

                restaurant.isLock == true ?
                    _b_detail_resLock.innerText = 'Tài khoản đang bị khóa' :
                    _b_detail_resLock.innerText = 'Tài khoản đang mở'

                _img_detail_res_banner.src = restaurant.banner

            }
            else alert(res.data.error.message)
        })
        .catch(error => console.log(error))
}

//user
function userLock(value) {
    let userId = value.split(',')[0]
    let status_lock = value.split(',')[1]
    let isLock = false
    status_lock == 'false' ? isLock = true : isLock = false

    axios.post(POST_ADMIN_EDIT_LOCK_USER, { userId, isLock })
        .then(res => {
            if (res.data.status == 'success') {
                alert('Cập nhật thành công.')
                location.reload()
            }
            else alert(res.data.error.message)
        })
        .catch(error => console.log(error))
}

function userDetail(userId) {
    _div_userDetail.style.display = BLOCK

    axios.get(GET_ADMIN_GET_USERS_BY_ID + userId)
        .then(res => {
            if (res.data.status == 'success') {
                let user = res.data.data.user
                _b_detail_user_fullName.innerText = user.fullName
                _b_detail_user_username.innerText = user.username
                _b_detail_user_Phone.innerText = user.phone
                _b_detail_user_Email.innerText = user.email
                _b_detail_user_Address.innerText = user.address

                user.isVerified == true ?
                    _b_detail_user_Verified.innerText = 'Đã xác thực' :
                    _b_detail_user_Verified.innerText = 'Chưa xác thực'

                user.isLock == true ?
                    _b_detail_user_Lock.innerText = 'Tài khoản đang bị khóa' :
                    _b_detail_user_Lock.innerText = 'Tài khoản đang mở'

                _img_detail_user_avatar.src = user.avatar

            }
            else alert(res.data.error.message)
        })
        .catch(error => console.log(error))
}

//discount
function discountCodeDetail(discountId) {

    axios.get(GET_ADMIN_GET_DISCOUNT_BY_ID + discountId)
        .then(res => {
            if (res.data.status == 'success') {
                discountCode_id = discountId
                let discount = res.data.data.discount 
                console.log(discount)
                _list_ip_discount[0].value = discount.code
                _list_ip_discount[1].value = discount.discount
                _list_ip_discount[2].value = discount.amount
                _list_ip_discount[3].value = discount.dateExprite.split('.')[0]
                _div_discountCode.style.display = BLOCK
                _btn_add_discount.innerText = 'Cập nhật'
                flag_Discount = 1
            }
            else alert(res.data.error.message)
        })
        .catch(error => console.log(error))
}

function fCreateDiscount() {
    let dateExp = Number(new Date(_list_ip_discount[3].value))
    if (dateExp <= Date.now()) {
        alert('Thời hạn không hợp lệ')
        return false
    }
    if (flag_Discount == 0)
        axios.post(
            POST_ADMIN_CREATE_DISCOUNT,
            {
                code: _list_ip_discount[0].value,
                discount: _list_ip_discount[1].value,
                amount: _list_ip_discount[2].value,
                dateExprite: dateExp, //number
            }
        )
            .then(res => {
                if (res.data.status == 'success') {
                    alert(res.data.data.message)
                    location.reload()
                }
                else alert(res.data.error.message)
            })
            .catch(error => console.log(error))
    else
        axios.post(
            POST_ADMIN_EDIT_DISCOUNT + discountCode_id,
            {
                code: _list_ip_discount[0].value,
                discount: _list_ip_discount[1].value,
                amount: _list_ip_discount[2].value,
                dateExprite: dateExp, //number
            }
        )
            .then(res => {
                if (res.data.status == 'success') {
                    alert('Cập nhật thành công.')
                    _div_discountCode.style.display = NONE
                    location.reload()
                }
                else alert(res.data.error.message)
            })
            .catch(error => console.log(error))
    return false
}

function cancelCreateDiscount() {
    _div_discountCode.style.display = NONE

    _list_ip_discount[0].value = ''
    _list_ip_discount[1].value = ''
    _list_ip_discount[2].value = ''
    _list_ip_discount[3].value = ''

    _btn_add_discount.innerText = 'Tạo'
    flag_Discount = 0
}