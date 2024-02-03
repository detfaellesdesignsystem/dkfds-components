'use strict';

const ARROW_DISTANCE_TO_TARGET = 4;     // Must match '$-arrow-dist-to-target' in 'src\stylesheets\components\_tooltip.scss'
const ARROW_HEIGHT = 8;                 // Must match '$-arrow-height' in 'src\stylesheets\components\_tooltip.scss'
const PAGE_MARGIN = 32 * 0.5;           // Must match '$grid-gutter-width' in 'src\stylesheets\variables\variables\_grid.scss'

function Tooltip(wrapper) {
    if ((wrapper.getElementsByClassName('tooltip-target')).length === 0) {
        throw new Error(`Tooltip target is missing. Add class 'tooltip-target' to element inside tooltip wrapper.`);
    }
    else {
        this.wrapper = wrapper;
        this.target = wrapper.getElementsByClassName('tooltip-target')[0];
        //this.tooltip = wrapper.getElementsByClassName('tooltip')[0];

        this.tooltip = document.createElement('span');
        this.tooltip.classList.add('tooltip');
        this.wrapper.append(this.tooltip);

        let arrow = document.createElement('span');
        arrow.classList.add('tooltip-arrow');
        this.wrapper.append(arrow);
    }
}

Tooltip.prototype.init = function () {
    let wrapper = this.wrapper;
    let tooltipTarget = this.target;
    let tooltipEl = this.tooltip;

    hideTooltip(wrapper, tooltipEl);

    // Ensure tooltip remains visible if window size is reduced
    window.addEventListener('resize', function () {
        updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
    });

    document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
    document.getElementsByTagName('body')[0].addEventListener('keyup', closeOnTab);

    /* A "true" tooltip describes the element which triggered it and is triggered on hover */
    let trueTooltip = (wrapper.dataset.trigger === 'hover');
    if (trueTooltip) {
        tooltipEl.id = wrapper.dataset.tooltipId;
        tooltipTarget.setAttribute('aria-describedby', wrapper.dataset.tooltipId);

        tooltipTarget.addEventListener('focus', function () {
            showTooltip(wrapper, tooltipEl);
            updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
        });

        tooltipTarget.addEventListener('mouseover', function (e) {
            /* The tooltip should not appear if the user just briefly moves the cursor 
               across the component. Use the 'js-hover' class as a flag to check, if
               the hover action is persistant. */
            tooltipTarget.classList.add('js-hover');
            setTimeout(function () {
                if (tooltipTarget.classList.contains('js-hover')) {
                    showTooltip(wrapper, tooltipEl);
                    updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
                }
            }, 300);
        });
    
        tooltipTarget.addEventListener('mouseleave', function (e) {
            tooltipTarget.classList.remove('js-hover');
            let onTooltip = false;
            if (wrapper.classList.contains('place-above')) {
                onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && 
                            tooltipTarget.getBoundingClientRect().top >= e.clientY;
            }
            else if (wrapper.classList.contains('place-below')) {
                onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && 
                            tooltipTarget.getBoundingClientRect().bottom <= e.clientY;
            }
            /* WCAG 1.4.13: It must be possible to hover on the tooltip */
            if (!onTooltip) {
                hideTooltip(wrapper, tooltipEl);
            }
        });

        tooltipEl.addEventListener('mouseleave', function (e) {
            tooltipTarget.classList.remove('js-hover');
            let onTarget = false;
            if (wrapper.classList.contains('place-above')) {
                onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && 
                           tooltipEl.getBoundingClientRect().top <= e.clientY;
            }
            else if (wrapper.classList.contains('place-below')) {
                onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && 
                           tooltipEl.getBoundingClientRect().bottom >= e.clientY;
            }
            /* Don't remove tooltip if hover returns to the target which triggered the tooltip */
            if (!onTarget) {
                hideTooltip(wrapper, tooltipEl);
            }
        });
    }
    /* The "tooltip" is actually a "toggletip", i.e. a button which turns a tip on or off */
    else {
        wrapper.setAttribute('aria-live', 'assertive');
        wrapper.setAttribute('aria-atomic', 'false');
        tooltipTarget.addEventListener('click', function () {
            if (wrapper.classList.contains('hide-tooltip')) {
                showTooltip(wrapper, tooltipEl);
                updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
            }
            else {
                hideTooltip(wrapper, tooltipEl);
            }
        });
    }

    tooltipTarget.addEventListener('keyup', function (e) {
        let key = e.key;
        if (key === 'Escape') {
            hideTooltip(wrapper, tooltipEl);
        }
    });
};

function setWidth(tooltipEl) {
    tooltipEl.style.width = 'max-content';
    let WCAG_Reflow_criteria = 320; // Width of 320 px defined in WCAG 2.1, Criterion 1.4.10 "Reflow"
    let accessibleMaxWidth = WCAG_Reflow_criteria - (PAGE_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > accessibleMaxWidth) {
        tooltipEl.style.width = accessibleMaxWidth + 'px';
    }
    let screenMaxWidth = document.body.clientWidth - (PAGE_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > screenMaxWidth) {
        tooltipEl.style.width = screenMaxWidth + 'px';
    }
}

function placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl) {
    let spaceAbove = tooltipTarget.getBoundingClientRect().top;
    let spaceBelow = window.screen.availHeight - tooltipTarget.getBoundingClientRect().bottom;
    let height = tooltipEl.getBoundingClientRect().height + ARROW_DISTANCE_TO_TARGET + ARROW_HEIGHT;
    let placement = 'above'; // Default
    if (tooltipWrapper.dataset.position === 'below' && spaceBelow >= height || (height > spaceAbove && height <= spaceBelow)) {
        placement = 'below';
    }
    if (placement === 'above') {
        tooltipWrapper.classList.add('place-above');
        tooltipWrapper.classList.remove('place-below');
    }
    else if (placement === 'below') {
        tooltipWrapper.classList.add('place-below');
        tooltipWrapper.classList.remove('place-above');
    }
}

function setLeft(tooltipTarget, tooltipEl) {
    // Center the tooltip on the tooltip arrow
    let left = (parseInt(tooltipTarget.getBoundingClientRect().width) - parseInt(tooltipEl.getBoundingClientRect().width))/2;
    tooltipEl.style.left = left + 'px';
    // If the tooltip exceeds the left side of the screen, adjust it
    if (tooltipEl.getBoundingClientRect().left < PAGE_MARGIN) {
        let adjustedLeft = 0 - parseInt(tooltipTarget.getBoundingClientRect().left) + PAGE_MARGIN;
        tooltipEl.style.left = adjustedLeft + 'px';
    }
    // If the tooltip exceeds the right side of the screen, adjust it
    else if (tooltipEl.getBoundingClientRect().right > (document.body.clientWidth - PAGE_MARGIN)) {
        let adjustedLeft = parseInt(window.getComputedStyle(tooltipEl).left) - (tooltipEl.getBoundingClientRect().right - document.body.clientWidth + PAGE_MARGIN);
        tooltipEl.style.left = adjustedLeft + 'px';
    }
}

function setBottomAndTop(tooltipWrapper, tooltipEl) {
    let total = 0 - tooltipEl.getBoundingClientRect().height - ARROW_HEIGHT - ARROW_DISTANCE_TO_TARGET + 1;
    if (tooltipWrapper.classList.contains('place-above')) {
        tooltipEl.style.top = total + 'px';
        tooltipEl.style.bottom = 'auto';
    }
    else if (tooltipWrapper.classList.contains('place-below')) {
        tooltipEl.style.bottom = total + 'px';
        tooltipEl.style.top = 'auto';
    }
}

function updateTooltipPosition(tooltipWrapper, tooltipTarget, tooltipEl) {
    setWidth(tooltipEl);
    placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl);
    setLeft(tooltipTarget, tooltipEl);
    setBottomAndTop(tooltipWrapper, tooltipEl);
}

function hideTooltip(tooltipWrapper, tooltipEl) {
    tooltipWrapper.classList.add('hide-tooltip');
    tooltipEl.innerText = "";
}

function showTooltip(tooltipWrapper, tooltipEl) {
    tooltipEl.innerText = tooltipWrapper.dataset.tooltip;
    tooltipWrapper.classList.remove('hide-tooltip');
}

function closeAllTooltips(event) {
    let tooltips = document.getElementsByClassName('tooltip-wrapper');
    for (let t = 0; t < tooltips.length; t++) {
        let wrapper = tooltips[t];
        let target = wrapper.getElementsByClassName('tooltip-target')[0];
        let tooltip = wrapper.getElementsByClassName('tooltip')[0];
        let clickedOnTarget = target.getBoundingClientRect().left <= event.clientX && 
                              event.clientX <= target.getBoundingClientRect().right && 
                              target.getBoundingClientRect().top <= event.clientY && 
                              event.clientY <= target.getBoundingClientRect().bottom;
        let clickedOnTooltip = window.getComputedStyle(tooltip).display !== 'none' &&
                               tooltip.getBoundingClientRect().left <= event.clientX && 
                               event.clientX <= tooltip.getBoundingClientRect().right && 
                               tooltip.getBoundingClientRect().top <= event.clientY && 
                               event.clientY <= tooltip.getBoundingClientRect().bottom;
        if (!clickedOnTarget && target !== document.activeElement && !clickedOnTooltip) {
            hideTooltip(wrapper, tooltip);
        }
    }
}

function closeOnTab(e) {
    let key = e.key;
    if (key === 'Tab') {
        let tooltips = document.getElementsByClassName('tooltip-wrapper');
        for (let t = 0; t < tooltips.length; t++) {
            let wrapper = tooltips[t];
            let target = wrapper.getElementsByClassName('tooltip-target')[0];
            let tooltip = wrapper.getElementsByClassName('tooltip')[0];
            if (document.activeElement !== target) {
                hideTooltip(wrapper, tooltip);
            }
        }
    }
}

export default Tooltip;
