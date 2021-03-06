//header
function accInfoSubmit() {
  listIconIfVisible(INLINE)
  _select_resType.style.display = NONE
  return true
}

function accInfoCancel() {
  assignValueToController()

  listIconIfVisible(INLINE)
  listInputIfDisable(true)

  _select_resType.style.display = NONE
  _b_resType.style.display = INLINE

}

function changePassSubmit() {
  if (_list_input_changePass[0].value == _list_input_changePass[1].value)
    alert('Mật khẩu mới phải khác mật khẩu cũ.')
  else if (_list_input_changePass[2].value != _list_input_changePass[1].value)
    alert('Mật khẩu xác nhận không khớp.')
  else {
    axios.post(
      POST_CHANGE_PASS,
      {
        password: _list_input_changePass[0].value,
        newPassword: _list_input_changePass[2].value
      }
    ).then(res => {
      alert(res.data.status)
      console.log(res.data)
      if (res.data.status != 'failed') {
        alert('Cập nhật mật khẩu thành công.')
        document.getElementById('accountChangePass').style.display = 'none'
      } else
        alert(res.data.message)
    })
      .catch(error => alert('Có lỗi xảy ra'))
  }

  return false
}

function listIconIfVisible(style) {
  _list_ic_editor[0].style.display = style
  _list_ic_editor[1].style.display = style
  _list_ic_editor[2].style.display = style
  _list_ic_editor[3].style.display = style
}

function listInputIfDisable(boolean) {
  _list_input_accInfo[0].disabled = boolean
  _list_input_accInfo[1].disabled = boolean
  _list_input_accInfo[2].disabled = boolean
}

function assignValueToController() {
  _list_input_accInfo[0].value = _restaurantName_if
  _list_input_accInfo[1].value = _restaurantPhone_if
  _list_input_accInfo[2].value = _restaurantAddress_if
  _b_resType.textContent = _restaurantType_if
  _img_Banner.src = _restaurantBanner_if
  _img_Avatar.src = _restaurantBanner_if

  _div_accInfo.style.display = NONE
}


//body
set_btn_direct_food()

function search() {
  location.replace(`?load=${_load}&p=${_page}&keySearch=${_charsSearch}`)
}

//hostpage

let myChart = document.getElementById('reschart').getContext('2d')
// Global Options
Chart.defaults.global.defaultFontFamily = 'Lato'
Chart.defaults.global.defaultFontSize = 18
Chart.defaults.global.defaultFontColor = '#777'
// let massPopChart = new Chart(myChart, {
//   type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
//   data: {
//     labels: ['Đã hoàn tất', 'Chưa xác nhận', 'Đã xác nhận', 'Đã hủy'],
//     datasets: [{
//       label: 'Đơn hàng',
//       data: getDataReport(),
//       //backgroundColor:'green',
//       backgroundColor: [
//         'rgba(54, 162, 235, 0.6)',
//         'rgba(54, 162, 235, 0.6)',
//         'rgba(54, 162, 235, 0.6)',
//         'rgba(54, 162, 235, 0.6)',

//       ],
//       borderWidth: 1,
//       borderColor: '#777',
//       hoverBorderWidth: 3,
//       hoverBorderColor: '#000'
//     }]
//   },
//   options: {
//     title: {
//       display: true,
//       text: 'Tổng đơn hàng',
//       fontSize: 25
//     },
//     legend: {
//       display: true,
//       position: 'right',
//       labels: {
//         fontColor: '#000'
//       }
//     },
//     layout: {
//       padding: {
//         left: 50,
//         right: 0,
//         bottom: 0,
//         top: 0
//       }
//     },
//     tooltips: {
//       enabled: true
//     }
//   }
// });

//food
function showProductDetail(value) {
  _food_id = value
  axios.get(GET_RES_PODUCT_DETAIL + value)
    .then(res => {
      if (res.data.status == 'failed')
        alert(res.data.error.message)
      else {
        flag_product = 1
        var food = res.data.data.food

        _div_productDetailModal.style.display = BLOCK
        _b_labelFormAddProduct.innerText = 'Chi tiết sản phẩm'

        _list_input_productDetail[0].value = food.foodName
        _list_input_productDetail[1].value = food.price
        _list_input_productDetail[2].removeAttribute('required')

        _textArea_caption.value = food.caption
        _imgProduct.src = food.image

        _list_btn_productDetail[0].innerText = 'Cập nhật'
        _list_btn_productDetail[2].classList.remove('collapse')
      }
    })
    .catch(error => alert(error.mesage))
}

function editProduct() {
  var formData = new FormData()
  if (_list_input_productDetail[2].files[0])
    formData.append('image', _list_input_productDetail[2].files[0])

  formData.append('foodName', _list_input_productDetail[0].value)
  formData.append('price', _list_input_productDetail[1].value)

  formData.append('caption', _textArea_caption.value)

  if (flag_product == 0) {
    //add product
    axios.post(
      POST_RES_ADD_PRODUCT,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
      .then(res => {
        if (res.data.status == 'success') {
          alert('Thêm sản phẩm thành công.')
          window.location = GET_RES_PODUCT_PAGE
        }
        alert(res.data.error.message)

      })
      .catch(error => console.log(error.mesage))
  }
  else {
    //Edit product
    formData.append('food_id', _food_id)
    axios.post(
      POST_RES_EDIT_PRODUCT,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
      .then(res => {
        if (res.data.status == 'success') {
          alert('Cập nhật thành công.')
          window.location = GET_RES_PODUCT_PAGE
        }
        else
          alert(res.data.error.message)

      })
      .catch(error => alert(error.mesage))
  }
  return false
}

//delProduct
_list_btn_productDetail[2].onclick = function () {
  var confirm_del = confirm('Xác nhận xóa sản phẩm?')
  if (confirm_del)
    axios.post(POST_RES_DEL_PRODUCT + _food_id)
      .then(res => {
        if (res.data.status == 'success') {
          alert('Cập nhật thành công.')
          window.location = GET_RES_PODUCT_PAGE
        }
        else
          alert(res.data.error.message)

      })
      .catch(error => alert(error.mesage))

}

//bill
function getWaitBillDetail(value) {
  var id = value.split(':')[1].trim()
  axios.get(GET_RES_GET_BILL_DETAIL + id)
    .then(res => {
      if (res.data.status == 'success') {
        const BILL = res.data.data.bill
        const BILL_DETAIL = res.data.data.bill_detail
        const RES_PAY = res.data.data.resPay

        _div_billDetail.classList.add(CLASS_SHOW)

        _b_billId.innerText = BILL._id
        _b_billStatus.innerText = BILL.status
        _b_billDateCreate.innerText = BILL.dateCreate
        _b_billUser.innerText = BILL.user.username
        _b_billReason.innerText = BILL.message

        if (BILL.discount_code != null) {
          axios.get(GET_RES_GET_DISCOUNT_CODE_BY_ID + BILL.discount_code)
            .then(res => {
              const DISCOUNT = res.data.data.discount
              var code = (DISCOUNT.restaurant != null) ? DISCOUNT.code + '(res)' : DISCOUNT.code + '(admin)'
              _b_billDiscount.innerText = code
            })
            .catch(error => {
              alert(error.mesage)
              console.log(error)
            })
        }

        _i_iconStatus.classList.remove(
          _i_iconStatus.classList.item(1),
          _i_iconStatus.classList.item(2)
        )
        switch (BILL.status) {
          case 'đã xác nhận':
            flag_bill = 0
            _p_billReason.style.display = NONE
            _i_iconStatus.classList.add('fa-calendar-check', 'text-primary')
            _list_btn_billDetail[0].style.display = NONE
            _list_btn_billDetail[1].innerText = 'Thoát'
            break
          case 'đã hủy':
            _p_billReason.style.display = INLINE
            flag_bill = 0
            _i_iconStatus.classList.add('fa-exclamation-triangle', 'text-danger')
            _list_btn_billDetail[0].style.display = NONE
            _list_btn_billDetail[1].innerText = 'Thoát'
            break
          case 'đã thanh toán':
            _p_billReason.style.display = NONE
            flag_bill = 0
            _i_iconStatus.classList.add('fa-check-circle', 'text-primary')
            _list_btn_billDetail[0].style.display = NONE
            _list_btn_billDetail[1].innerText = 'Thoát'
            break
          default:
            _p_billReason.style.display = NONE
            flag_bill = 1
            _i_iconStatus.classList.add('fa-clock', 'text-warning')
            _list_btn_billDetail[0].style.display = INLINE
            _list_btn_billDetail[1].innerText = 'Hủy đơn'
            break
        }
        for (var product of BILL_DETAIL) {
          var tr = document.createElement('tr')
          var td_fName = document.createElement('td')
          var imgF = document.createElement('img')
          var bName = document.createElement('b')
          imgF.width = 80
          imgF.src = product.food.image
          bName.innerText = product.food.foodName
          td_fName.appendChild(imgF)
          td_fName.appendChild(bName)

          var td_amount = document.createElement('td')
          var bAmount = document.createElement('b')
          bAmount.innerText = product.amount
          td_amount.appendChild(bAmount)

          var td_total = document.createElement('td')
          var bTotal = document.createElement('b')
          bTotal.innerText = product.amount * product.food.price
          td_total.appendChild(bTotal)

          tr.appendChild(td_fName)
          tr.appendChild(td_amount)
          tr.appendChild(td_total)

          _tbody.appendChild(tr)
        }
        var tr_total = document.createElement('tr')

        var td_lable_total = document.createElement('td')
        var td_sp1 = document.createElement('td')
        var td_bill_total = document.createElement('td')

        td_lable_total.innerText = 'Tổng cộng: '
        td_bill_total.innerText = BILL.total

        tr_total.classList.add('text-primary')
        tr_total.style.fontWeight = 'bold'
        tr_total.style.fontSize = 'x-large'

        tr_total.appendChild(td_lable_total)
        tr_total.appendChild(td_sp1)
        tr_total.appendChild(td_bill_total)
        _tbody.appendChild(tr_total)

        var tr_pay = document.createElement('tr')

        var td_lable_pay = document.createElement('td')
        var td_sp2 = document.createElement('td')
        var td_bill_pay = document.createElement('td')

        td_lable_pay.innerText = 'Thực nhận:'
        td_bill_pay.innerText = RES_PAY

        tr_pay.classList.add('text-primary')
        tr_pay.style.fontWeight = 'bold'
        tr_pay.style.fontSize = 'x-large'

        tr_pay.appendChild(td_lable_pay)
        tr_pay.appendChild(td_sp2)
        tr_pay.appendChild(td_bill_pay)
        _tbody.appendChild(tr_pay)
      }
      else {
        alert(res.data.error.message)
      }


    })
    .catch(error => {
      alert(error.mesage)
      console.log(error)
    })


}

function editBill() {
  axios.post(POST_RES_CONFIRM_BILL + _b_billId.innerText)
    .then(res => {
      if (res.data.status == 'success') {
        alert('Cập nhật thành công.')
        _div_billDetail.classList.remove(CLASS_SHOW)
        location.reload()
      }
      else
        alert(res.data.error.message)

    })
    .catch(error => alert(error.mesage))
  return false
}

function fBillCancle() {
  if (flag_bill == 0) {
    _tbody.outerHTML = '<tbody></tbody>'
    _tbody = _div_billDetail.querySelector('tbody')
    _div_billDetail.classList.remove(CLASS_SHOW)
  }
  else {
    var reason = prompt('Lý do hủy đơn')
    console.log(reason == '')
    console.log(reason == null)
    if (reason == '' || reason == null)
      alert('Vui lòng nêu lý do hủy đơn')
    else {
      console.log(reason)
      axios.post(POST_RES_CANCEL_BILL,
        {
          bill_id: _b_billId.innerText.trim(),
          message: reason
        }
      ) // lỗi
        .then(res => {
          if (res.data.status == 'success') {
            alert('Cập nhật thành công.')
            _div_billDetail.classList.remove(CLASS_SHOW)
            location.reload()
          }
          else
            alert(res.data.error.message)

        })
        .catch(error => alert(error.mesage))
    }
  }

}

//discount
let loyal_user_id
function show_loyal_cus_detail(value) {
  loyal_user_id = value
  _div_loyalUser.classList.add(CLASS_SHOW)
  axios.get(
    GET_RES_GET_LOYAL_USER_DETAIL + value,      // loyal user info
  )
    .then(res => {
      if (res.data.status = 'success') {
        var data = res.data.data.loyal_user
        var user = res.data.data.loyal_user.user
        _img_loyal_user.src = user.avatar

        _b_loyal_user_username.innerText = user.username
        _i_loyal_user_point.innerText = data.point + ' point'
        _i_loyal_user_email.innerText = user.email

        _p_loyal_user_fullname.innerText = 'Họ tên: ' + user.fullName
        _p_loyal_user_phone.innerText = 'Điện thoại: ' + user.phone
        _p_loyal_user_address.innerText = 'Địa chỉ: ' + user.address
      }
      else
        alert(res.error.message)
    })
    .catch(error => alert(error.mesage))

  axios.get(
    GET_RES_GET_LOYAL_USER_HIS_TRANSACSIONS + value,      // loyal user his trans
  )
    .then(res => {
      if (res.data.status = 'success') {
        var hisTrans = res.data.data.hisTrans
        var inner = hisTrans.map((item) => `<ul><label>date: ${new Date(item.dateCreate)}</label> <label style="padding-left:50px">total: ${item.total}</label> </ul>`)
        _ul_loyal_user_listHisTrans.innerHTML = inner.join(' ')
      }
      else
        alert(res.error.message)
    })
    .catch(error => alert(error.mesage))

}

function formLoyal_customer() {
}

function sendDiscount() {
  flag_sendDiscount = 1

  _div_loyalUser.classList.remove(CLASS_SHOW)
  _div_createDiscount.classList.add(CLASS_SHOW)
  _list_input_createDiscount[2].style.display = NONE
  _list_input_createDiscount[2].disabled = true
  _lb_createDiscount_amount.style.display = NONE
}

function show_div_createDiscount_discountDetail(value) {
  _div_createDiscount.classList.add(CLASS_SHOW)
  _list_btn_createDiscount[0].innerText = 'Cập nhật'
  _list_btn_createDiscount[1].innerText = 'Thoát'

  axios.get(GET_RES_GET_DISCOUNT_CODE_BY_ID + value)
    .then(res => {
      if (res.data.status == 'success') {
        let discount = res.data.data.discount 
        _list_input_createDiscount[0].value = discount.code
        _list_input_createDiscount[1].value = discount.discount
        _list_input_createDiscount[3].value = discount.dateExprite.split('.')[0]

        if(discount.user == null){
          _lb_createDiscount_amount.innerText = 'Số lượng'
          _list_input_createDiscount[2].type = 'number'
          _list_input_createDiscount[2].value = discount.amount
        }
        else{
          _lb_createDiscount_amount.innerText = 'User'
          _list_input_createDiscount[2].type = 'text'
          _list_input_createDiscount[2].value = discount.user.username
        }
        //
        console.log(res.data.data.discount)
      }
      else alert(res.data.error.message)
    })
    .catch(error => alert(console.error()))
}

function show_div_createDiscount() {
  _div_createDiscount.classList.add(CLASS_SHOW)
}

function fCreateDiscount() {
  let dateExp = Number(new Date(_list_input_createDiscount[3].value)) 
  if(dateExp <= Date.now()){
    alert('Thời hạn không họp lệ')
    return false
  }

  if (flag_sendDiscount == 0) {
    _list_input_createDiscount[2].style.display = INLINE
    axios.post(
      POST_RES_CREATE_PUBLIC_DISCOUNT_CODE,
      {
        code: _list_input_createDiscount[0].value,
        discount: _list_input_createDiscount[1].value,
        amount: _list_input_createDiscount[2].value,
        dateExprite: Number(new Date(_list_input_createDiscount[3].value)).toString(), //number
      }
    )
      .then(res => {
        if (res.data.status == 'success') {
          alert(res.data.data.message)
          location.reload()
        }
        else alert(res.data.error.message)
      })
      .catch(error => alert(console.error()))
  }
  else {
    axios.post(
      POST_RES_CREATE_PRIVATE_DISCOUNT_CODE,
      {
        code: _list_input_createDiscount[0].value,
        discount: _list_input_createDiscount[1].value,
        user: loyal_user_id,
        dateExprite: Number(new Date(_list_input_createDiscount[3].value)).toString(), //number
      }
    )
      .then(res => {
        if (res.data.status == 'success') {
          alert(res.data.data.message)
          location.reload()
        }
        else alert(res.data.error.message)
      })
      .catch(error => alert(console.error()))
  }

  flag_sendDiscount = 0 // set flag default
  return false
}

function cancelCreateDiscount() {
  _list_input_createDiscount[0].value = ''
  _list_input_createDiscount[1].value = ''
  _list_input_createDiscount[2].type = 'number'
  _list_input_createDiscount[2].value = ''
  _list_input_createDiscount[3].value = ''
  _div_createDiscount.classList.remove(CLASS_SHOW)
  _list_input_createDiscount[2].style.display = INLINE
  _list_input_createDiscount[2].disabled = false
  
  _lb_createDiscount_amount.innerText = 'Số lượng'
  _lb_createDiscount_amount.style.display = INLINE


  _list_btn_createDiscount[0].innerText = 'Tạo'
  _list_btn_createDiscount[1].innerText = 'Hủy bỏ'
}

function hideFormLoyalUser() {
  _div_loyalUser.classList.remove(CLASS_SHOW)
}
//cuoi cung
function nextPage() {
  set_btn_direct_food()
  var p = Number(_page) + 1
  _keySearch != '' ?
    window.location = `?load=${_load}&p=${p}&keySearch=${_keySearch}`
    : window.location = `?load=${_load}&p=${p}`
}

function previousPage() {
  set_btn_direct_food()
  var p = Number(_page) - 1
  _keySearch != '' ?
    window.location = `?load=${_load}&p=${p}&keySearch=${_keySearch}`
    : window.location = `?load=${_load}&p=${p}`
}

function set_btn_direct_food() {
  if (_pageTotal == '1') {
    _btn_next.disabled = true
    _btn_pre.disabled = true
  } else if (_page == _pageTotal)
    _btn_next.disabled = true
  else
    _btn_pre.disabled = false

  if (_page == '1')
    _btn_pre.disabled = true
  else
    _btn_pre.disabled = false
}

async function getDataReport() {
  let res = await axios.get('/api/res/func/getDataReport')
  let data_rp = res.data.data
  //
  let massPopChart = new Chart(myChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: ['Đã hoàn tất', 'Đã xác nhận', 'Đã thanh toán', 'Chưa xác nhận', 'Đã hủy'],
      datasets: [{
        label: 'Đơn hàng',
        data: data_rp.bill || [],
        //backgroundColor:'green',
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(54, 162, 235, 0.6)',

        ],
        borderWidth: 1,
        borderColor: '#777',
        hoverBorderWidth: 3,
        hoverBorderColor: '#000'
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Tổng đơn hàng',
        fontSize: 25
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: '#000'
        }
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 0
        }
      },
      tooltips: {
        enabled: true
      }
    }
  });
  // rp
  _list_i_rp[0].innerText = data_rp.bills_amount
  _list_i_rp[1].innerText = data_rp.revenue
  _list_i_rp[2].innerText = data_rp.revenue - (data_rp.revenue * 10 / 100)
  _list_i_rp[3].innerText = data_rp.revenue / data_rp.bills_amount
  _list_i_rp[4].innerText = data_rp.customer_total
  _list_i_rp[5].innerText = 'new user'
  _list_i_rp[6].innerText = data_rp.rate_hight
  _list_i_rp[7].innerText = data_rp.rate_medium
  _list_i_rp[8].innerText = data_rp.rate_low

  //
  console.log(res.data.data)
}

getDataReport()
