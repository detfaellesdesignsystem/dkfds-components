'use strict';

function BackToTop(backtotop){
    this.backtotop = backtotop;
}

BackToTop.prototype.init = function(){
    let backtotopbutton = this.backtotop;

    updateBackToTopButton(backtotopbutton);

    window.addEventListener('scroll', function(e) {
        updateBackToTopButton(backtotopbutton);
    });
}

function updateBackToTopButton(button) {
    let lastKnownScrollPosition = window.scrollY;
    let lastKnownWindowHeight = window.innerHeight;

    let sidenav = document.querySelector('.sidenav-list');

    if (sidenav && sidenav.offsetParent !== null) {
        let rect = sidenav.getBoundingClientRect();
        if (rect.bottom < 0 && button.classList.contains('d-none')) {
            button.classList.remove('d-none');
            let eventShow = new Event('fds.backtotop.displayed');
            button.dispatchEvent(eventShow);
        }
        else if (rect.bottom >= 0 && !button.classList.contains('d-none')) {
            button.classList.add('d-none');
            let eventHide = new Event('fds.backtotop.hidden');
            button.dispatchEvent(eventHide);
        }
    }
    else {
        let limit = lastKnownWindowHeight*4;
        if (lastKnownScrollPosition >= limit && button.classList.contains('d-none')) {
            button.classList.remove('d-none');
            let eventShow = new Event('fds.backtotop.displayed');
            button.dispatchEvent(eventShow);
        }
        else if (lastKnownScrollPosition < limit && !button.classList.contains('d-none')) {
            button.classList.add('d-none');
            let eventHide = new Event('fds.backtotop.hidden');
            button.dispatchEvent(eventHide);
        }
    }
    
}

export default BackToTop;