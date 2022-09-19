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

    window.addEventListener('resize', function(e) {
        updateBackToTopButton(backtotopbutton);
    });
}

function updateBackToTopButton(button) {
    let lastKnownScrollPosition = window.scrollY;
    let lastKnownWindowHeight = window.innerHeight;

    let sidenavPresent = false;
    let limit = lastKnownWindowHeight * 2; // Defines how far the user must scroll before the back-to-top-button should become visible
    let sidenav = document.querySelector('.sidenav-list'); // Finds side navigations or step guides

    // Check whether there's a sidenav present and ensure it's not hidden (offsetParent !== null)
    if (sidenav && sidenav.offsetParent !== null) {
        sidenavPresent = true;

        // Ignore the sidenav if it's caused by clicking an overflow-menu button
        if (sidenav.closest(".overflow-menu-inner")?.previousElementSibling?.getAttribute('aria-expanded') === "true" &&
            sidenav.closest(".overflow-menu-inner")?.previousElementSibling?.offsetParent !== null) {
            sidenavPresent = false;
        }
        // If there's a sidenav in the left side of the screen, calculate whether it is visible
        else {
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
    }
    else {
        sidenavPresent = false;
    }

    // If there's no sidenav, use the limit to decide whether to show or hide the back-to-top button
    if (!sidenavPresent) {
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