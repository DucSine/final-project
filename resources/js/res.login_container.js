var account_register = document.getElementById('account_register')
var modal = document.getElementsByClassName('modal')
var aLogin = document.querySelectorAll('a.text-primary')
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    switch(event.target){
        case modal[0] :
            modal[0].style.display = "none" 
            break
            case modal[1] :
            modal[1].style.display = "none" 
            break
            case modal[2] :
            modal[1].style.display = "none" 
            break
    }
}

aLogin[0].onclick = function(){
    modal[0].style.display = "none"
    modal[1].style.display = "block"
}
aLogin[1].onclick = function(){
    modal[0].style.display = "none"
    modal[2].style.display = "block"
}