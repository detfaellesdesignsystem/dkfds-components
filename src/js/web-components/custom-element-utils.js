import { generateAndVerifyUniqueId } from '../utils/generate-unique-id';

/**
 * Configuration object for a MutationObserver.
 * Tracked attributes: `hidden`, `aria-hidden`, `id`, `class`, `disabled`, `required`.
 *
 * @type {MutationObserverInit}
 */
export const mutationObserverConfig = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['hidden', 'aria-hidden', 'id', 'class', 'disabled', 'required', 'aria-required'],
    attributeOldValue: false,
    characterData: false,
    characterDataOldValue: false
}

/**
 * Associates a label element with an (input) element.
 * If the element lacks an ID, a unique one is generated using the given prefix.
 * If no element is provided, the `for` attribute is removed from the label.
 *
 * @param {HTMLLabelElement} label - The label element to associate.
 * @param {HTMLElement} element - The element to associate the label with.
 * @param {string} prefix - The prefix used when generating a unique ID for the element.
 */
export function associateLabelWithElement(label, element, prefix) {
    if (!label) return;

    if (element) {
        if (!element.id) {
            element.id = generateAndVerifyUniqueId(prefix);
        }
        label.htmlFor = element.id;
    }
    else {
        label.removeAttribute('for');
    }
}

/**
 * Creates an SVG icon element with a single path.
 * The SVG is given a fixed viewBox of '0 -960 960 960'.
 *
 * @param {string} pathD - The `d` attribute value defining the shape of the SVG path.
 * @returns {SVGSVGElement} The constructed SVG element containing the specified path.
 */
export function createSvgIcon(pathD) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 -960 960 960');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('icon-svg');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    svg.appendChild(path);

    return svg;
}

/**
 * Shows or hides a required status indicator in a label element based on the given value.
 * If value is null, the indicator is removed. If value is an empty string, a default
 * text is used based on whether the element is required or not.
 *
 * @param {HTMLLabelElement} label - The label element to update.
 * @param {HTMLElement|HTMLFieldSetElement} element - The form element or fieldset to check for required status.
 * @param {string|null} value - The value to display in the status indicator.
 */
export function showRequiredStatus(label, element, value) {
    if (!label || !element) return;

    let statusIndicator = label.querySelector(':scope > span.weight-normal');

    if (value === null && statusIndicator) {
        statusIndicator.remove();
        return;
    }

    if (!statusIndicator) {
        const span = document.createElement('span');
        span.className = 'weight-normal';
        label.appendChild(span);
        statusIndicator = span;
    }

    const isRequired = isElementRequired(element);

    let text = value;
    if (value === '' && isRequired) text = 'skal udfyldes';
    if (value === '' && !isRequired) text = 'frivilligt';

    const nextText = isRequired ? ` (*${text})` : ` (${text})`;

    if (statusIndicator.textContent !== nextText) {
        statusIndicator.textContent = nextText;
    }
}

/**
 * Determines whether a form element or fieldset is considered required.
 * For fieldsets, returns true if any child form element is required.
 *
 * @param {HTMLElement|HTMLFieldSetElement} element - The element to check.
 * @returns {boolean} Whether the element (or any child within a fieldset) is required.
 */
function isElementRequired(element) {
    if (element instanceof HTMLFieldSetElement) {
        const fields = element.querySelectorAll('input, select, textarea');
        return Array.from(fields).some(field =>
            field.hasAttribute('required') ||
            (field.hasAttribute('aria-required') && field.getAttribute('aria-required') !== 'false')
        );
    }

    return element.hasAttribute('required') ||
        (element.hasAttribute('aria-required') && element.getAttribute('aria-required') !== 'false');
}

/**
 * Notifies the error summary that error messages have been disconnected/removed.
 * The parent wrapper dispatches 'error-message-callback' events for each error message found.
 *
 * @param {HTMLElement} element - The element to query for error messages.
 */
export function notifySummaryOnDisconnect(element) {
    if (!document.querySelector('fds-error-summary[auto]')) return;

    element.querySelectorAll('fds-error-message[id]').forEach((errorMessage) => {
        document.dispatchEvent(new CustomEvent('error-message-callback', {
            detail: {
                errorId: errorMessage.id,
                isRemoved: true
            }
        }));
    });
}

/**
 * Notifies the error summary of visibility changes in error messages.
 * The parent wrapper dispatches 'error-message-visibility-changed' events for each error message found.
 *
 * @param {HTMLElement} element - The element to query for error messages.
 */
export function notifySummaryOnVisibilityChange(element) {
    if (!document.querySelector('fds-error-summary[auto]')) return;

    element.querySelectorAll('fds-error-message[id]').forEach((errorMessage) => {
        document.dispatchEvent(new CustomEvent('error-message-visibility-changed', {
            detail: {
                errorId: errorMessage.id
            }
        }));
    });
}

/**
 * Determines whether an element is visible to screen readers.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if the element is visible to screen readers, false otherwise.
 */
export function isVisibleToScreenReader(element) {
    return !element.closest('.d-none, [hidden]:not([hidden="false"]), [aria-hidden="true"]');
}

/**
 * Matches the disabled class of a label element to the disabled attribute of a form element.
 *
 * @param {HTMLLabelElement} label - The label element to update.
 * @param {HTMLElement} element - The form element to match the disabled state from.
 */
export function setDisabledClass(label, element) {
    if (!label || !element) return;

    label.classList.toggle('disabled', element.hasAttribute('disabled'));
}

/**
 * Sets the `aria-describedby` attribute on a form element or fieldset based on
 * the IDs of visible error messages, help texts, and an optional character limit element.
 *
 * @param {HTMLElement|HTMLFieldSetElement} element - The form element or fieldset to update.
 * @param {NodeList} errorMessages - Error message elements to consider.
 * @param {NodeList} helpTexts - Help text elements to consider.
 * @param {HTMLElement|null} [characterLimit=null] - Optional character limit element to consider.
 */
export function setAriaDescribedBy(element, errorMessages, helpTexts, characterLimit = null) {
    if (!element) return;

    const ids = [...errorMessages, ...helpTexts, characterLimit]
        .filter(el => el && el.id && isVisibleToScreenReader(el))
        .map(el => el.id);

    ids.length > 0 ? element.setAttribute('aria-describedby', ids.join(' ')) : element.removeAttribute('aria-describedby');
}

/**
 * Sets or removes the `aria-invalid` attribute on a form element
 * based on whether any error messages are visible to screen readers.
 *
 * @param {HTMLElement} element - The form element to update.
 * @param {NodeList} errorMessages - Error message elements to evaluate.
 */
export function setInvalid(element, errorMessages) {
    if (!element) return;

    const invalid = Array.from(errorMessages).some(el => isVisibleToScreenReader(el));

    invalid ? element.setAttribute('aria-invalid', 'true') : element.removeAttribute('aria-invalid');
}

/**
 * Determines if an element is visible and focusable.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if the element is visible and focusable, false otherwise.
 */
export function isVisibleAndFocusable(element) {
    return (
        element.offsetParent !== null &&
        !element.disabled &&
        element.tabIndex >= 0
    );
}
