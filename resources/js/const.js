//io
const socket = io(`http://kltn-foodoffer.herokuapp.com`)
// init key style
const NONE = 'none'
const INLINE = 'inline'
const BLOCK = 'block'

//init key class
const CLASS_ACTIVE = 'active'
const CLASS_SHOW = 'show'
const CLASS_SHOW_FLEX = 'show-flex'
// key localStorage
//login
const CB_SAVE = 'cb_save'
const EMAIL_SIGN = '_emailSign'
const PASSWORD_SIGN = '_passwordSign'

const AD_CB_SAVE = 'ad_cb'
const AD_USERNAME = 'ad_username'
const AD_PASSWORD = 'ad_password'

// patterm
const LIST_PATTERM = {
  checkEmail: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
  checkPass: '[A-Za-z0-9]{8,30}',
  checkPhone: /((09|03|07|08|05)+([0-9]{8})\b)/g,
}

//URI
const POST_RES_LOGIN = '/api/res/auth/login'
const POST_RES_REGISTER = '/api/res/auth/register'
const POST_RES_FORGOT_PASSWORD = '/api/res/auth/fogotPassword'
const GET_RES_HOST_PAGE = '/res_hostpage'
const POST_RES_CHANGE_PASS = '/api/res/auth/changePassword'

const GET_RES_PODUCT_PAGE = '/res_hostpage?load=product'
const GET_RES_PODUCT_DETAIL = '/api/res/func/getFood?food_id='
const POST_RES_ADD_PRODUCT = '/api/res/func/addFood'
const POST_RES_EDIT_PRODUCT = '/api/res/func/editFood'
const POST_RES_DEL_PRODUCT = '/api/res/func/delFood?foodId='

const GET_RES_BILL_PAGE = '/res_hostpage?load=bill'
const POST_RES_CONFIRM_BILL = '/api/res/func/confirmBill?billId='
const POST_RES_CANCEL_BILL = '/api/res/func/cancelBill'
const GET_RES_GET_BILL_DETAIL = 'api/res/func/getBillDetail?bill_id='

const GET_RES_DISCOUNT_PAGE = '/res_hostpage?load=discount'
const POST_RES_CREATE_PUBLIC_DISCOUNT_CODE = '/api/res/func/createPublicDiscount'
const POST_RES_CREATE_PRIVATE_DISCOUNT_CODE = '/api/res/func/createPrivateDiscount'
const GET_RES_GET_DISCOUNT_CODE_BY_ID = '/api/res/func/getDiscountById?discount_id='
const GET_RES_GET_LOYAL_USER_DETAIL = '/api/res/func/getLoyalUser?user_id='
const GET_RES_GET_LOYAL_USER_HIS_TRANSACSIONS = '/api/res/func/getLoyalUserHisTrans?user_id='

const POST_ADMIN_LOGIN = '/api/admin/auth/login'
const POST_ADMIN_FORGOT_PASSWORD = '/api/admin/auth/fogotPassword'
const GET_ADMIN_HOST_PAGE = '/admin_hostPage'

const GET_ADMIN_GET_DATA_REPORT = '/api/admin/func/getDataReport'

const GET_ADMIN_GET_ALL_RESTAURANT = '/api/admin/func/getRestaurant'
const GET_ADMIN_GET_RESTAURANT_BY_ID = '/api/admin/func/getRestaurantById?resId='
const GET_ADMIN_GET_RESTAURANT_BY_NAME = '/api/admin/func/getRestaurantByName?restaurantName='
const GET_ADMIN_GET_ALL_RESTAURANT_TYPE = '/api/admin/func/getRestaurantType'
const POST_ADMIN_EDIT_LOCK_RESTAURANT = '/api/admin/func/flagLockRestaurant'

const GET_ADMIN_GET_ALL_USERS = '/api/admin/func/getUser'
const GET_ADMIN_GET_USERS_BY_ID = '/api/admin/func/getUserById?userId='
const GET_ADMIN_GET_USERS_BY_USERNAME = '/api/admin/func/getUserByUsername?username='
const POST_ADMIN_EDIT_LOCK_USER = '/api/admin/func/flagLockUser'

const GET_ADMIN_GET_DISCOUNT = '/api/admin/func/getDiscount'
const GET_ADMIN_GET_DISCOUNT_BY_ID = '/api/admin/func/getDiscountById?discountId='
const POST_ADMIN_CREATE_DISCOUNT = '/api/admin/func/createDiscount'
const POST_ADMIN_EDIT_DISCOUNT = '/api/admin/func/editDiscount?discountCode_id='


