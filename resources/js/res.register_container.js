var form_container = document.querySelector('.modal-content.register-modal-content.animate')
console.log(form_container)

form_container.addEventListener('submit', event => {
  event.preventDefault();
  // actual logic, e.g. validate the form
  console.log('Form submission cancelled.');
});

var em = form_container.querySelector('input#regis_email')
console.log(em)

em.onchange = function(e){
  console.log(em.value)
  em.title = 'email đã sử dụng'


  const email = em.value.split('@')[1]
  em.pattern = ''
  console.log(email)
  axios.get(`/api/auth/checkemail?email=${em.value}`)
  .then(res => {
        console.log(res.data)
        em.title = 'Email đã tồn tại'
      })
      .catch(error => em.title = 'Email đã tồn tại')
}



//const rs = email.match(/^uchoangvo997@gmail.com/)


// sự kiện onchange
