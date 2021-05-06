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

let myChart = document.getElementById('reschart').getContext('2d');
// Global Options
Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

let massPopChart = new Chart(myChart, {
  type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [{
      label: 'Đơn hàng',
      data: [
        90,
        56,
        95,
        30,
        20,
      ],
      //backgroundColor:'green',
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)'
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


//food

function showProductDetail(value) {
  _food_id = value
  axios.get(GET_PODUCT + value)
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
      POST_ADD_PRODUCT,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
      .then(res => {
        if (res.data.status == 'success') {
          alert('Thêm sản phẩm thành công.')
          window.location = GET_PODUCT_PAGE
        }
        alert(res.data.error.message)

      })
      .catch(error => alert(error.mesage))
  }
  else {
    //Edit product
    formData.append('food_id', _food_id)
    axios.post(
      POST_EDIT_PRODUCT,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
      .then(res => {
        if (res.data.status == 'success') {
          alert('Cập nhật thành công.')
          window.location = GET_PODUCT_PAGE
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
    axios.post(POST_DEL_PRODUCT + _food_id)
      .then(res => {
        if (res.data.status == 'success') {
          alert('Cập nhật thành công.')
          window.location = GET_PODUCT_PAGE
        }
        else
          alert(res.data.error.message)

      })
      .catch(error => alert(error.mesage))
    
}

//bill


//discount

































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
