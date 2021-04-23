var aSidebars = document.querySelectorAll('a.nav-link')

aSidebars[0].onclick = function() {
    this.classList.add('active')
    aSidebars[1].classList.remove('active')
    aSidebars[2].classList.remove('active')
    aSidebars[3].classList.remove('active')
}

aSidebars[1].onclick = function() {
    this.classList.add('active')
    aSidebars[0].classList.remove('active')
    aSidebars[2].classList.remove('active')
    aSidebars[3].classList.remove('active')
}
    
aSidebars[2].onclick = function() {
    this.classList.add('active')
    aSidebars[0].classList.remove('active')
    aSidebars[1].classList.remove('active')
    aSidebars[3].classList.remove('active')
}

aSidebars[3].onclick = function() {
    this.classList.add('active')
    aSidebars[0].classList.remove('active')
    aSidebars[1].classList.remove('active')
    aSidebars[2].classList.remove('active')
}