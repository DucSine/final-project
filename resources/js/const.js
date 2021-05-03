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

// patterm
const LIST_PATTERM = {
  checkEmail: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
  checkPass: '[A-Za-z0-9]{8,30}',
  checkPhone: /((09|03|07|08|05)+([0-9]{8})\b)/g,
}

//URI
const GET_HOST_PAGE = '/res_hostpage'
const POST_LOGIN = 'api/res/auth/login'
const POST_REGISTER = 'api/res/auth/register'
const POST_FOGOT_PASSWORD = 'api/res/auth/fogotPassword'

const POST_CHANGE_PASS = 'api/res/auth/changePassword'

const POST_ADD_PRODUCT = ''
const POST_EDIT_PRODUCT = ''
const POST_DEL_PRODUCT = ''

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