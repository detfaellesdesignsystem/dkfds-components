'use strict';

function BackToTop(backtotop) {
    this.backtotop = backtotop;
}

BackToTop.prototype.init = function () {
    let backtotopbutton = this.backtotop;

    updateBackToTopButton(backtotopbutton);

    const observer = new MutationObserver(list => {
        const evt = new CustomEvent('dom-changed', { detail: list });
        document.body.dispatchEvent(evt)
    });

    // Which mutations to observe
    let config = {
        attributes: true,
        attributeOldValue: false,
        characterData: true,
        characterDataOldValue: false,
        childList: true,
        subtree: true
    };

    // DOM changes
    observer.observe(document.body, config);
    document.body.addEventListener('dom-changed', function (e) {
        updateBackToTopButton(backtotopbutton);
    });

    // Scroll actions
    window.addEventListener('scroll', function (e) {
        updateBackToTopButton(backtotopbutton);
    });

    // Window resizes
    window.addEventListener('resize', function (e) {
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
        let footerVisible = isFooterVisible(document.getElementsByTagName("footer")[0]);

        // Show the button, if the user has scrolled too far down
        if (lastKnownScrollPosition >= limit) {
            // If the footer is visible, place the button on top of the footer
            if (footerVisible && !button.classList.contains('footer-sticky')) {
                button.classList.add('footer-sticky');
            }
            // If the footer is not visible, place the button in the lower right corner
            else if (!footerVisible && button.classList.contains('footer-sticky')) {
                button.classList.remove('footer-sticky');
            }
        }
        // If the page has a sidenav, the threshold is always ignored when the bottom of the sidenav is no longer visible
        else {
            let maybeShowButton = false;

            // Check whether the page has a sidenav (left menu or step guide)
            let sidenav = document.querySelector('.sidenav-list');
            if (sidenav) {
                // Ensure that the sidenav hasn't been hidden, e.g. due to a window resize
                let sidenavParentNotHidden = (sidenav.offsetParent !== null);
                if (sidenavParentNotHidden) {
                    // If the sidenav is responsive, ensure that it is not collapsed
                    let sidenavContainer = sidenav.closest(".overflow-menu-inner");
                    if (sidenavContainer) {
                        if (sidenavContainer.getAttribute('aria-hidden') === "false") {
                            // Check that the sidenav was not opened from an overflow menu
                            let overflowMenu = sidenavContainer.previousElementSibling;
                            if (overflowMenu) {
                                let overflowMenuParentNotHidden = overflowMenu.offsetParent === null;
                                if (overflowMenuParentNotHidden) {
                                    maybeShowButton = true;
                                }
                            }
                        }
                    }
                    else {
                        maybeShowButton = true;
                    }
                }
            }

            if (!maybeShowButton) {
                if (!button.classList.contains('footer-sticky')) {
                    button.classList.add('footer-sticky');
                }
            }
            else {
                let rect = sidenav.getBoundingClientRect();
                // If the sidenav isn't visible, check where to place the button
                if (rect.bottom < 0) {
                    if (!footerVisible && button.classList.contains('footer-sticky')) {
                        button.classList.remove('footer-sticky');
                    }
                    else if (footerVisible && !button.classList.contains('footer-sticky')) {
                        button.classList.add('footer-sticky');
                    }
                }
                // If the sidenav is visible and the scroll threshold hasn't been met, place the button at the footer
                else {
                    if (!button.classList.contains('footer-sticky')) {
                        button.classList.add('footer-sticky');
                    }
                }
            }
        }
    }

}

function isFooterVisible(footerElement) {
    if (footerElement) {
        if (footerElement.querySelector('.footer')) {
            let rect = footerElement.querySelector('.footer').getBoundingClientRect();
            if ((rect.top < window.innerHeight || rect.top < document.documentElement.clientHeight)) {
                // Footer is (partly) visible
                return true;
            }
            else {
                // Footer is not visible
                return false;
            }
        }
        else {
            // Footer class is missing
            return false;
        }
    }
    else {
        // Footer element is missing
        return false;
    }
}

export default BackToTop;