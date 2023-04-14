'use strict';

const MAX_LENGTH = 'data-maxlength';
const TEXT_CHARACTERLIMIT = {
    "character_remaining": "Du har {value} tegn tilbage",
    "characters_remaining": "Du har {value} tegn tilbage",
    "character_too_many": "Du har {value} tegn for meget",
    "characters_too_many": "Du har {value} tegn for meget"
};

/**
 * Show number of characters left in a field
 * @param {HTMLElement} containerElement 
 * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
 */
 function CharacterLimit(containerElement, strings = TEXT_CHARACTERLIMIT) {
    if (!containerElement) {
        throw new Error(`Missing form-limit element`);
    }
    this.container = containerElement;
    this.input = containerElement.getElementsByClassName('form-input')[0];
    this.maxlength = this.container.getAttribute(MAX_LENGTH);
    this.text = strings;

    let lastKeyUpTimestamp = null;
    let oldValue = this.input.value;
    let intervalID = null;

    let handleKeyUp = () => {
        updateVisibleMessage(this);
        lastKeyUpTimestamp = Date.now();
    }

    let handleFocus = () => {
        /* Reset the screen reader message on focus to force an update of the message.
        This ensures that a screen reader informs the user of how many characters there is left
        on focus and not just what the character limit is. */
        if (this.input.value !== "") {
            let sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0];
            sr_message.innerHTML = '';
        }
    
        intervalID = setInterval(function () {
            /* Don't update the Screen Reader message unless it's been awhile
            since the last key up event. Otherwise, the user will be spammed
            with audio notifications while typing. */
            if (!lastKeyUpTimestamp || (Date.now() - 500) >= lastKeyUpTimestamp) {
                let sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0].innerHTML;
                let visible_message = this.container.getElementsByClassName('character-limit')[0].innerHTML;     
    
                /* Don't update the messages unless the input has changed or if there
                is a mismatch between the visible message and the screen reader message. */
                if (oldValue !== this.input.value || sr_message !== visible_message) {
                    oldValue = this.input.value;
                    this.updateMessages();
                }
            }
        }.bind(this), 1000);
    }
    
    let handleBlur = () => {
        clearInterval(intervalID);
        // Don't update the messages on blur unless the value of the textarea/text input has changed
        if (oldValue !== this.input.value) {
            oldValue = this.input.value;
            this.updateMessages();
        }
    }

    this.init = function() {
        if (!this.maxlength) {
            throw new Error(`Character limit is missing attribute ${MAX_LENGTH}`);
        }

        this.input.addEventListener('keyup', function() {
            handleKeyUp();
        });
        this.input.addEventListener('focus', function() {
            handleFocus();
        });
        this.input.addEventListener('blur', function() {
            handleBlur();
        });

        /* If the browser supports the pageshow event, use it to update the character limit
        message and sr-message once a page has loaded. Second best, use the DOMContentLoaded event. 
        This ensures that if the user navigates to another page in the browser and goes back, the 
        message and sr-message will show/tell the correct amount of characters left. */
        if ('onpageshow' in window) {
            window.addEventListener('pageshow', () => {
                this.updateMessages();
            });
        } 
        else {
            window.addEventListener('DOMContentLoaded', () => {
                this.updateMessages();
            });
        }
    };
}

CharacterLimit.prototype.charactersLeft = function () {
    let current_length = this.input.value.length;
    return this.maxlength - current_length;
}

function characterLimitMessage(formLimit) {
    let count_message = "";
    let characters_left = formLimit.charactersLeft();

    if (characters_left === -1) {
        let exceeded = Math.abs(characters_left);
        count_message = formLimit.text.character_too_many.replace(/{value}/, exceeded);
    }
    else if (characters_left === 1) {
        count_message = formLimit.text.character_remaining.replace(/{value}/, characters_left);
    }
    else if (characters_left >= 0) {
        count_message = formLimit.text.characters_remaining.replace(/{value}/, characters_left);
    }
    else {
        let exceeded = Math.abs(characters_left);
        count_message = formLimit.text.characters_too_many.replace(/{value}/, exceeded);
    }

    return count_message;
}

function updateVisibleMessage(formLimit) {
    let characters_left = formLimit.charactersLeft();
    let count_message = characterLimitMessage(formLimit);
    let character_label = formLimit.container.getElementsByClassName('character-limit')[0];

    if (characters_left < 0) {
        if (!character_label.classList.contains('limit-exceeded')) {
            character_label.classList.add('limit-exceeded');
        }
        if (!formLimit.input.classList.contains('form-limit-error')) {
            formLimit.input.classList.add('form-limit-error');
        }
    }
    else {
        if (character_label.classList.contains('limit-exceeded')) {
            character_label.classList.remove('limit-exceeded');
        }
        if (formLimit.input.classList.contains('form-limit-error')) {
            formLimit.input.classList.remove('form-limit-error');
        }
    }

    character_label.innerHTML = count_message;
}

function updateScreenReaderMessage(formLimit) {
    let count_message = characterLimitMessage(formLimit);
    let character_label = formLimit.container.getElementsByClassName('character-limit-sr-only')[0];
    character_label.innerHTML = count_message;
}

CharacterLimit.prototype.updateMessages = function () {
    updateVisibleMessage(this);
    updateScreenReaderMessage(this);
}

export default CharacterLimit;