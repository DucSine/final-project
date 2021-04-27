// init key style
const NONE = 'none'
const INLINE = 'inline'
const BLOCK = 'block'
// init key class
const INPUT_VALID = 'input-valid'
const INPUT_INVALID = 'input-invalid'
const LABEL_VALID = 'label-valid'
const LABEL_INVALID = 'label-invalid'
// key localStorag
const IS_CHECKED = 'isChecked'
const LI_EMAIL = 'li_email'
const LI_PASSWORD = 'li_password'

// patterm
const LIST_PATTERM = {
    checkEmail: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
    checkPass: '[A-Za-z0-9]{8,30}',
    checkPhone: /((09|03|07|08|05)+([0-9]{8})\b)/g,
  }