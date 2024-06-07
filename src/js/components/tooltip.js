'use strict';

const ARROW_DISTANCE_TO_TARGET = 4; // Must match '$-arrow-dist-to-target' in 'src\stylesheets\components\_tooltip.scss'
const ARROW_HEIGHT = 8;             // Must match '$-arrow-height' in 'src\stylesheets\components\_tooltip.scss'
const MIN_MARGIN = 8;               // Minimum margin to the edge of the window

function Tooltip(wrapper) {
    if ((wrapper.getElementsByClassName('tooltip-target')).length === 0) {
        throw new Error(`Missing tooltip target. Add class 'tooltip-target' to element inside tooltip wrapper.`);
    }
    else if (!wrapper.hasAttribute('data-tooltip') || wrapper.dataset.tooltip === '') {
        throw new Error(`Missing tooltip text. Wrapper must have data attribute 'data-tooltip'.`);
    }
    else if (wrapper.dataset.trigger !== 'hover' && wrapper.dataset.trigger !== 'click') {
        throw new Error(`Missing trigger. Tooltip wrapper must have data attribute 'data-trigger="hover"' or 'data-trigger="click"'.`);
    }
    else if (!wrapper.hasAttribute('data-tooltip-id') || wrapper.dataset.tooltipId === '') {
        throw new Error(`Missing ID. Tooltip wrapper must have data attribute 'data-tooltip-id'.`);
    }
    else {
        this.wrapper = wrapper;
        this.target = wrapper.getElementsByClassName('tooltip-target')[0];

        this.tooltip = document.createElement('span');
        this.tooltip.classList.add('tooltip');

        let arrow = document.createElement('span');
        arrow.classList.add('tooltip-arrow');
        arrow.setAttribute('aria-hidden', true);
    }
}

Tooltip.prototype.init = function () {
    let wrapper = this.wrapper;
    let tooltipTarget = this.target;
    let tooltipEl = this.tooltip;

    hideTooltip(wrapper, tooltipTarget, tooltipEl);

    /* Ensure tooltip remains visible if window size is reduced */
    window.addEventListener('resize', function () {
        updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
    });

    document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
    document.getElementsByTagName('body')[0].addEventListener('keyup', closeOnTab);

    /* A "true" tooltip describes the element which triggered it and is triggered on hover */
    let trueTooltip = (wrapper.dataset.trigger === 'hover');
    tooltipEl.id = wrapper.dataset.tooltipId;

    if (trueTooltip) {
        wrapper.append(tooltipEl);
        appendArrow(wrapper);
        if (tooltipTarget.classList.contains('tooltip-is-label')) {
            tooltipTarget.setAttribute('aria-labelledby', wrapper.dataset.tooltipId);
        }
        else {
            tooltipTarget.setAttribute('aria-describedby', wrapper.dataset.tooltipId);
        }
        tooltipEl.setAttribute('role', 'tooltip');
        tooltipEl.innerText = wrapper.dataset.tooltip;

        tooltipTarget.addEventListener('focus', function () {
            showTooltip(wrapper, tooltipTarget, tooltipEl);
            updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
        });

        tooltipTarget.addEventListener('blur', function () {
            tooltipTarget.classList.remove('js-hover');
            hideTooltip(wrapper, tooltipTarget, tooltipEl);
        });

        tooltipTarget.addEventListener('mouseover', function (e) {
            /* The tooltip should not appear if the user just briefly moves the cursor 
               across the component. Use the 'js-hover' class as a flag to check, if
               the hover action is persistant. */
            tooltipTarget.classList.add('js-hover');
            setTimeout(function () {
                if (tooltipTarget.classList.contains('js-hover')) {
                    showTooltip(wrapper, tooltipTarget, tooltipEl);
                    updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
                }
            }, 300);
        });
    
        tooltipTarget.addEventListener('mouseleave', function (e) {
            tooltipTarget.classList.remove('js-hover');
            let center = (tooltipTarget.getBoundingClientRect().top + tooltipTarget.getBoundingClientRect().bottom) / 2; // Use center of target due to rounding errors
            let onTooltip = false;
            if (wrapper.classList.contains('place-above')) {
                onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && e.clientY <= center;
            }
            else if (wrapper.classList.contains('place-below')) {
                onTooltip = tooltipTarget.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipTarget.getBoundingClientRect().right && e.clientY >= center;
            }
            /* WCAG 1.4.13: It must be possible to hover on the tooltip */
            if (!onTooltip) {
                hideTooltip(wrapper, tooltipTarget, tooltipEl);
            }
        });

        tooltipEl.addEventListener('mouseleave', function (e) {
            tooltipTarget.classList.remove('js-hover');
            let center = (tooltipEl.getBoundingClientRect().top + tooltipEl.getBoundingClientRect().bottom) / 2; // Use center of tooltip due to rounding errors
            let onTarget = false;
            if (wrapper.classList.contains('place-above')) {
                onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && e.clientY >= center;
            }
            else if (wrapper.classList.contains('place-below')) {
                onTarget = tooltipEl.getBoundingClientRect().left <= e.clientX && e.clientX <= tooltipEl.getBoundingClientRect().right && e.clientY <= center;
            }
            /* Don't remove tooltip if hover returns to the target which triggered the tooltip */
            if (!onTarget) {
                hideTooltip(wrapper, tooltipTarget, tooltipEl);
            }
        });

        /* If the mouse leaves while in the gap between the target and the tooltip,
           ensure that the tooltip closes */
        wrapper.addEventListener('mouseleave', function (e) {
            tooltipTarget.classList.remove('js-hover');
            hideTooltip(wrapper, tooltipTarget, tooltipEl);
        });
    }
    /* The "tooltip" is actually a "toggletip", i.e. a button which turns a tip on or off */
    else {
        let live_region = document.createElement('span');
        live_region.setAttribute('aria-live', 'assertive');
        live_region.setAttribute('aria-atomic', 'true');
        wrapper.append(live_region);
        live_region.append(tooltipEl);
        appendArrow(wrapper);
        tooltipTarget.setAttribute('aria-expanded', 'false');
        tooltipTarget.setAttribute('aria-controls', wrapper.dataset.tooltipId);
        tooltipTarget.addEventListener('click', function () {
            if (wrapper.classList.contains('hide-tooltip')) {
                showTooltip(wrapper, tooltipTarget, tooltipEl);
                updateTooltipPosition(wrapper, tooltipTarget, tooltipEl);
            }
            else {
                hideTooltip(wrapper, tooltipTarget, tooltipEl);
            }
        });
    }
};

function appendArrow(tooltipWrapper) {
    let arrow = document.createElement('span');
    arrow.classList.add('tooltip-arrow');
    arrow.setAttribute('aria-hidden', true);
    tooltipWrapper.append(arrow);
}

function setWidth(tooltipEl) {
    tooltipEl.style.width = 'max-content';
    let WCAG_Reflow_criteria = 320; // Width of 320 px defined in WCAG 2.1, Criterion 1.4.10 "Reflow"
    let accessibleMaxWidth = WCAG_Reflow_criteria - (MIN_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > accessibleMaxWidth) {
        tooltipEl.style.width = accessibleMaxWidth + 'px';
    }
    let screenMaxWidth = document.body.clientWidth - (MIN_MARGIN * 2);
    if (parseInt(window.getComputedStyle(tooltipEl).width) > screenMaxWidth) {
        tooltipEl.style.width = screenMaxWidth + 'px';
    }
}

function placeAboveOrBelow(tooltipWrapper, tooltipTarget, tooltipEl) {
    let spaceAbove = tooltipTarget.getBoundingClientRect().top;
    let spaceBelow = window.innerHeight - tooltipTarget.getBoundingClientRect().bottom;
    let height = tooltipEl.getBoundingClientRect().height + ARROW_DISTANCE_TO_TARGET + ARROW_HEIGHT;
    let placement = 'above'; // Default placement
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
    /* Center the tooltip on the tooltip arrow */
    let left = (parseInt(tooltipTarget.getBoundingClientRect().width) - parseInt(tooltipEl.getBoundingClientRect().width))/2;
    tooltipEl.style.left = left + 'px';
    /* If the tooltip exceeds the left side of the screen, adjust it */
    if (tooltipEl.getBoundingClientRect().left < MIN_MARGIN) {
        let adjustedLeft = 0 - parseInt(tooltipTarget.getBoundingClientRect().left) + MIN_MARGIN;
        tooltipEl.style.left = adjustedLeft + 'px';
    }
    /* If the tooltip exceeds the right side of the screen, adjust it */
    else if (tooltipEl.getBoundingClientRect().right > (document.body.clientWidth - MIN_MARGIN)) {
        let adjustedLeft = parseInt(window.getComputedStyle(tooltipEl).left) - (tooltipEl.getBoundingClientRect().right - document.body.clientWidth + MIN_MARGIN);
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

function hideTooltip(tooltipWrapper, tooltipTarget, tooltipEl) {
    tooltipWrapper.classList.add('hide-tooltip');
    if (tooltipTarget.hasAttribute('aria-expanded')) {
        tooltipTarget.setAttribute('aria-expanded', 'false');
        tooltipEl.innerText = "";
    }
}

function showTooltip(tooltipWrapper, tooltipTarget, tooltipEl) {
    tooltipWrapper.classList.remove('hide-tooltip');
    if (tooltipTarget.hasAttribute('aria-expanded')) {
        tooltipTarget.setAttribute('aria-expanded', 'true');
        tooltipEl.innerText = tooltipWrapper.dataset.tooltip;
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
            hideTooltip(wrapper, target, tooltip);
        }
    }
}

function closeOnTab(e) {
    let key = e.key;
    let tooltips = document.getElementsByClassName('tooltip-wrapper');
    if (key === 'Tab') {
        for (let t = 0; t < tooltips.length; t++) {
            let wrapper = tooltips[t];
            let target = wrapper.getElementsByClassName('tooltip-target')[0];
            let tooltip = wrapper.getElementsByClassName('tooltip')[0];
            /* If the user is tabbing to an element, where a tooltip already is open,
               keep it open */
            if (document.activeElement !== target) {
                hideTooltip(wrapper, target, tooltip);
            }
        }
    }
    else if (key === 'Escape') {
        for (let t = 0; t < tooltips.length; t++) {
            let wrapper = tooltips[t];
            let target = wrapper.getElementsByClassName('tooltip-target')[0];
            let tooltip = wrapper.getElementsByClassName('tooltip')[0];
            hideTooltip(wrapper, target, tooltip);
        }
    }
}

export default Tooltip;
