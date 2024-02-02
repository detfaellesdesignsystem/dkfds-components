'use strict';

const ARROW_DISTANCE_TO_TARGET = 4;     // Must match '$-arrow-dist-to-target' in 'src\stylesheets\components\_tooltip.scss'
const ARROW_HEIGHT = 8;                 // Must match '$-arrow-height' in 'src\stylesheets\components\_tooltip.scss'
const PAGE_MARGIN = 16;

function Tooltip(wrapper) {
    if ((wrapper.getElementsByClassName('tooltip-target')).length === 0) {
        throw new Error(`Tooltip target is missing. Add class 'tooltip-target' to first element inside tooltip wrapper.`);
    }
    else if ((wrapper.getElementsByClassName('tooltip')).length === 0) {
        throw new Error(`Tooltip element is missing. Add class 'tooltip' to second element inside tooltip wrapper.`);
    }
    else {
        this.wrapper = wrapper;
        this.target = wrapper.getElementsByClassName('tooltip-target')[0];
        this.tooltip = wrapper.getElementsByClassName('tooltip')[0];
    }
}

/**
 * Set eventlisteners
 */
Tooltip.prototype.init = function () {
    let wrapper = this.wrapper;
    let tooltipTarget = this.target;
    let tooltipEl = this.tooltip;
    wrapper.classList.add('hide-tooltip');
    window.addEventListener('resize', function () {
        setWidth(tooltipEl);
        placeAboveOrBelow(wrapper, tooltipTarget, tooltipEl);
        setLeft(tooltipTarget, tooltipEl);
        setBottomAndTop(wrapper, tooltipEl);
        
    });
    document.addEventListener('scroll', function () {
        setWidth(tooltipEl);
        placeAboveOrBelow(wrapper, tooltipTarget, tooltipEl);
        setLeft(tooltipTarget, tooltipEl);
        setBottomAndTop(wrapper, tooltipEl);
    });
    setWidth(tooltipEl);
    placeAboveOrBelow(wrapper, tooltipTarget, tooltipEl);
    setLeft(tooltipTarget, tooltipEl);
    setBottomAndTop(wrapper, tooltipEl);
    
    document.getElementsByTagName('body')[0].removeEventListener('click', closeAllTooltips);
    document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);

    document.getElementsByTagName('body')[0].removeEventListener('keyup', closeOnTab);
    document.getElementsByTagName('body')[0].addEventListener('keyup', closeOnTab);

    let trueTooltip = tooltipEl.classList.contains('onhover');

    if (trueTooltip) {
        tooltipTarget.addEventListener('focus', function () {
            wrapper.classList.remove('hide-tooltip');
            setWidth(tooltipEl);
            placeAboveOrBelow(wrapper, tooltipTarget, tooltipEl);
            setLeft(tooltipTarget, tooltipEl);
            setBottomAndTop(wrapper, tooltipEl);
            tooltipEl.setAttribute("aria-hidden", "false");
        });

        tooltipTarget.addEventListener('mouseover', function (e) {
            tooltipTarget.classList.add('js-hover');
            setTimeout(function () {
                if (tooltipTarget.classList.contains('js-hover')) {
                    wrapper.classList.remove('hide-tooltip');
                    setWidth(tooltipEl);
                    placeAboveOrBelow(wrapper, tooltipTarget, tooltipEl);
                    setLeft(tooltipTarget, tooltipEl);
                    setBottomAndTop(wrapper, tooltipEl);
                    tooltipEl.setAttribute("aria-hidden", "false");
                }
            }, 500);
        });
    
        tooltipTarget.addEventListener('mouseleave', function () {
            tooltipTarget.classList.remove('js-hover');
            tooltipEl.setAttribute("aria-hidden", "true");
            wrapper.classList.add('hide-tooltip');
        });
    }
    else {
        tooltipTarget.addEventListener('click', function () {
            if (wrapper.classList.contains('hide-tooltip')) {
                wrapper.classList.remove('hide-tooltip');
                setWidth(tooltipEl);
                placeAboveOrBelow(wrapper, tooltipTarget, tooltipEl);
                setLeft(tooltipTarget, tooltipEl);
                setBottomAndTop(wrapper, tooltipEl);
                tooltipEl.setAttribute("aria-hidden", "false");
            }
            else {
                tooltipEl.setAttribute("aria-hidden", "true");
                wrapper.classList.add('hide-tooltip');
            }
        });
    }
    tooltipTarget.addEventListener('keyup', function (e) {
        let key = e.key;
        if (key === 'Escape') {
            tooltipEl.setAttribute("aria-hidden", "true");
            wrapper.classList.add('hide-tooltip');
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
    if (tooltipEl.classList.contains('below') && spaceBelow >= height || (height > spaceAbove && height <= spaceBelow)) {
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
            tooltip.setAttribute("aria-hidden", "true");
            wrapper.classList.add('hide-tooltip');
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
                tooltip.setAttribute("aria-hidden", "true");
                wrapper.classList.add('hide-tooltip');
            }
        }
    }
}

export default Tooltip;
