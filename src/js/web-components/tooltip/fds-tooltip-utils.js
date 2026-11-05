const MIN_MARGIN = 8; // Minimum margin to the edge of the viewport in pixels
const MAX_WIDTH = 330; // Maximum width of the tooltip in pixels

/**
 * Get arrow dimensions from CSS custom properties.
 *
 * @returns {{ arrowHeight: number, arrowDistanceToTarget: number }} Arrow dimensions in pixels
 */
export function getArrowDimensions() {
    const style = getComputedStyle(document.documentElement);
    return {
        arrowHeight: parseInt(style.getPropertyValue('--tooltip-arrow-height')),
        arrowDistanceToTarget: parseInt(style.getPropertyValue('--tooltip-arrow-distance-to-target'))
    };
}

/**
 * Set the width of the tooltip bubble, capped at a maximum width and the viewport width.
 *
 * @param {HTMLElement} tooltip - The tooltip bubble element
 */
export function setTooltipWidth(tooltip) {
    // Start with natural width
    tooltip.style.width = 'max-content';

    // Cap at max width
    if (tooltip.offsetWidth > MAX_WIDTH) { tooltip.style.width = `${MAX_WIDTH}px`; }

    // Further cap if viewport is narrower than max width
    const viewportMaxWidth = document.documentElement.clientWidth - (MIN_MARGIN * 2);
    if (tooltip.offsetWidth > viewportMaxWidth) { tooltip.style.width = `${viewportMaxWidth}px`; }
}

/**
 * Set the horizontal position of the tooltip bubble, centered on the trigger element.
 * Adjusts if the tooltip exceeds the left or right edge of the viewport.
 *
 * @param {HTMLElement} tooltip - The tooltip bubble element
 * @param {HTMLElement} trigger - The trigger element
 */
export function setTooltipLeft(tooltip, trigger) {
    const triggerRect = trigger.getBoundingClientRect();

    // Center tooltip on trigger
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltip.offsetWidth / 2);

    // If tooltip exceeds right edge, shift left
    if (left + tooltip.offsetWidth > document.documentElement.clientWidth - MIN_MARGIN) {
        left = document.documentElement.clientWidth - MIN_MARGIN - tooltip.offsetWidth;
    }

    // If tooltip exceeds left edge, clamp to MIN_MARGIN
    if (left < MIN_MARGIN) { left = MIN_MARGIN; }

    tooltip.style.left = `${Math.round(left)}px`;
}

/**
 * Set the vertical placement of the tooltip bubble and arrow, either above or below the trigger element.
 * Placement is determined by the preferred placement and available space.
 *
 * @param {HTMLElement} tooltip - The tooltip bubble element
 * @param {HTMLElement} arrow - The tooltip arrow element
 * @param {HTMLElement} trigger - The trigger element
 * @param {string} preferredPlacement - Preferred placement, either 'above' or 'below'
 */
export function setVerticalPlacement(tooltip, arrow, trigger, preferredPlacement) {
    const triggerRect = trigger.getBoundingClientRect();
    const { arrowHeight, arrowDistanceToTarget } = getArrowDimensions();

    // Calculate space available above and below the trigger
    const spaceNeeded = tooltip.offsetHeight + arrowHeight + arrowDistanceToTarget;
    const spaceAbove = triggerRect.top;
    const spaceBelow = window.innerHeight - triggerRect.bottom;

    // Determine actual placement based on preferred placement and available space
    let actualPlacement = preferredPlacement;
    if (preferredPlacement === 'above' && spaceAbove < spaceNeeded) {
        actualPlacement = 'below';
    } 
    else if (preferredPlacement === 'below' && spaceBelow < spaceNeeded) {
        actualPlacement = 'above';
    }

    // Position tooltip bubble and arrow based on actual placement
    if (actualPlacement === 'above') {
        tooltip.style.top = `${Math.round(triggerRect.top - tooltip.offsetHeight - arrowHeight - arrowDistanceToTarget + 1)}px`;
        arrow.style.top = `${Math.round(triggerRect.top - arrowHeight - arrowDistanceToTarget)}px`;
        tooltip.classList.add('place-above');
        tooltip.classList.remove('place-below');
        arrow.classList.add('place-above');
        arrow.classList.remove('place-below');
    } 
    else {
        tooltip.style.top = `${Math.round(triggerRect.bottom + arrowHeight + arrowDistanceToTarget - 1)}px`;
        arrow.style.top = `${Math.round(triggerRect.bottom + arrowDistanceToTarget)}px`;
        tooltip.classList.add('place-below');
        tooltip.classList.remove('place-above');
        arrow.classList.add('place-below');
        arrow.classList.remove('place-above');
    }

    // Arrow is always centered on the trigger
    arrow.style.left = `${Math.round(triggerRect.left + (triggerRect.width / 2))}px`;
}