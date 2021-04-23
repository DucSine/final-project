var imgAvatar = document.querySelector('.avatar')
var userContainer = document.querySelector('.user-container')
var tagA_usContainer = document.querySelectorAll('.user-container a')
var btn_logout = document.getElementById('btn_logout')
console.log(tagA_usContainer)

userContainer.style.display = 'none'
imgAvatar.onclick = function(){
        userContainer.style.display == 'none' ?
        userContainer.style.display = 'flex' : 
        userContainer.style.display = 'none'
}

btn_logout.onclick= function() {
    userContainer.style.display = 'none'
    window.location="/";  
}

tagA_usContainer[0].onclick = function() {
    userContainer.style.display = 'none'
    document.getElementById('accountInfo').style.display='block'
}

tagA_usContainer[1].onclick = function() {
    userContainer.style.display = 'none'
    document.getElementById('accountChangePass').style.display='block'
}