// init key style
const NONE = 'none'
const INLINE = 'inline'
const BLOCK = 'block'

//init key class
const CLASS_ACTIVE = 'active'
const CLASS_SHOW = 'show'

// key localStorage
  //login
const CB_SAVE = 'cb_save'
const EMAIL_SIGN = '_emailSign'
const PASSWORD_SIGN = '_passwordSign'

const AD_CB_SAVE ='ad_cb'
const AD_USERNAME ='ad_username'
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

const POST_ADMIN_LOGIN = '/api/admin/auth/login'
const POST_ADMIN_FORGOT_PASSWORD = '/api/admin/auth/fogotPassword'

const GET_ADMIN_HOST_PAGE = '/admin/index'



const GET_RES_HOST_PAGE = '/res_hostpage'
const GET_PODUCT_PAGE = '/res_hostpage?load=product'
const GET_BILL_PAGE = '/res_hostpage?load=bill'
const GET_DISCOUNT_PAGE = '/res_hostpage?load=discount'

const POST_CHANGE_PASS = 'api/res/auth/changePassword'

const GET_PODUCT = 'api/res/func/getFood?food_id='
const POST_ADD_PRODUCT = 'api/res/func/addFood'
const POST_EDIT_PRODUCT = 'api/res/func/editFood'
const POST_DEL_PRODUCT = 'api/res/func/delFood?foodId='

const GET_BILL_HISTORY = ''
const GET_WAIT_BILL_AUTH = ''
const GET_FIND_BILL_BY_ID = ''
const POST_EDIT_BILL = ''

const GET_LOYAL_USERS = ''
const GET_MY_DISCOUNT_CODE=''
const GET_FIND_MY_DISCOUNT_CODE = ''
const POST_CREATE_DISCOUNT_CODE = ''
const POST_EDIT_DISCOUNT_CODE = ''
const POST_SEND_DISCOUNT_CODE_TO_LOYAL_USER = ''

const GET_REPORT_DATE = ''
const GET_REPORT_MONTH = ''
const GET_REPORT_yEAR = ''