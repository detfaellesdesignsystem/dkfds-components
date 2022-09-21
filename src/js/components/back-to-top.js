'use strict';

function BackToTop(backtotop){
    this.backtotop = backtotop;
}

BackToTop.prototype.init = function() {
    let backtotopbutton = this.backtotop;

    updateBackToTopButton(backtotopbutton);

    const observer = new MutationObserver( list => {
        const evt = new CustomEvent('dom-changed', {detail: list});
        document.body.dispatchEvent(evt)
    });

    // Which mutations to observe
    let config = {
        attributes            : true,
        attributeOldValue     : false,
        characterData         : true,
        characterDataOldValue : false,
        childList             : true,
        subtree               : true
    };

    // DOM changes
    observer.observe(document.body, config);
    document.body.addEventListener('dom-changed', function(e) {
        updateBackToTopButton(backtotopbutton);
    });

    // Scroll actions
    window.addEventListener('scroll', function(e) {
        updateBackToTopButton(backtotopbutton);
    });

    // Window resizes
    window.addEventListener('resize', function(e) {
        updateBackToTopButton(backtotopbutton);
    });
}

function updateBackToTopButton(button) {
    let docBody = document.body;
    let docElem = document.documentElement;
    let heightOfViewport = Math.max(docElem.clientHeight || 0, window.innerHeight || 0);
    let heightOfPage = Math.max(docBody.scrollHeight, docBody.offsetHeight, docBody.getBoundingClientRect().height, 
                                  docElem.scrollHeight, docElem.offsetHeight, docElem.getBoundingClientRect().height, docElem.clientHeight);
    
    let limit = heightOfViewport * 2; // The threshold selected to determine whether a back-to-top-button should be displayed
    
    // Never show the button if the page is too short
    if (limit > heightOfPage) {
        if (!button.classList.contains('d-none')) {
            button.classList.add('d-none');
        }
    }
    // If the page is long, calculate when to show the button
    else {
        if (button.classList.contains('d-none')) {
            button.classList.remove('d-none');
        }

        let lastKnownScrollPosition = window.scrollY;
        let footer = document.getElementsByTagName("footer")[0]; // If there are several footers, the code only applies to the first footer

        // Show the button, if the user has scrolled too far down
        if (lastKnownScrollPosition >= limit) {
            if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
                button.classList.remove('footer-sticky');
            }
            else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
                button.classList.add('footer-sticky');
            }
        }
        // If there's a sidenav, we might want to show the button anyway
        else {
            let sidenav = document.querySelector('.sidenav-list'); // Finds side navigations (left menus) and step guides

            if (sidenav && sidenav.offsetParent !== null) {
                // Only react to sidenavs, which are always visible (i.e. not opened from overflow-menu buttons)
                if (!(sidenav.closest(".overflow-menu-inner")?.previousElementSibling?.getAttribute('aria-expanded') === "true" &&
                sidenav.closest(".overflow-menu-inner")?.previousElementSibling?.offsetParent !== null)) {
                    
                    let rect = sidenav.getBoundingClientRect();
                    if (rect.bottom < 0) {
                        if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
                            button.classList.remove('footer-sticky');
                        }
                        else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
                            button.classList.add('footer-sticky');
                        }
                    }
                    else {
                        if (!button.classList.contains('footer-sticky')) {
                            button.classList.add('footer-sticky');
                        }
                    }

                }
            }
            // There's no sidenav and we know the user hasn't reached the scroll limit: Ensure the button is hidden
            else {
                if (!button.classList.contains('footer-sticky')) {
                    button.classList.add('footer-sticky');
                }
            }
        }
    }

}

function isFooterVisible(footerElement) {
    if (footerElement?.querySelector('.footer')) {
        let rect = footerElement.querySelector('.footer').getBoundingClientRect();

        // Footer is visible or partly visible
        if ((rect.top < window.innerHeight || rect.top < document.documentElement.clientHeight)) {
            return true;
        }
        // Footer is hidden
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

export default BackToTop;