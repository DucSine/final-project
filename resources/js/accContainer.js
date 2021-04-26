var imgAvatar = document.querySelector('.avatar')
var userContainer = document.querySelector('.user-container')
var tagA_usContainer = document.querySelectorAll('.user-container a')
var btn_logout = document.getElementById('btn_logout')
console.log(userContainer)
imgAvatar.onclick = function(){
    userContainer.classList.toggle('show')
}

btn_logout.onclick= function() {
    userContainer.classList.toggle('show')
    window.location="/";  
}

tagA_usContainer[0].onclick = function() {
    userContainer.classList.toggle('show')
    document.getElementById('accountInfo').style.display='block'
}

tagA_usContainer[1].onclick = function() {
    userContainer.classList.toggle('show')
    document.getElementById('accountChangePass').style.display='block'
}
