'use strict';

const MAX_LENGTH = 'data-maxlength';
const CHARACTERS_REMAINING_MANY_TEXT = "Du har 0 tegn tilbage";
const CHARACTERS_REMAINING_ONE_TEXT = "Du har 1 tegn tilbage";
const CHARACTERS_EXCEEDED_MANY_TEXT = "Du har 0 tegn for meget";
const CHARACTERS_EXCEEDED_ONE_TEXT = "Du har 1 tegn for meget";

/**
 * Number of characters left
 * @param {HTMLElement} containerElement 
 */
 function CharacterLimit(containerElement) {
    this.container = containerElement;
    this.input = containerElement.getElementsByClassName('form-input')[0];
    this.maxlength = this.container.getAttribute(MAX_LENGTH);
    this.lastKeyUpTimestamp = null;
    this.oldValue = this.input.value;
}

CharacterLimit.prototype.init = function() {
    this.input.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.input.addEventListener('focus', this.handleFocus.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));

    if ('onpageshow' in window) {
        window.addEventListener('pageshow', this.updateMessages.bind(this));
    } 
    else {
        window.addEventListener('DOMContentLoaded', this.updateMessages.bind(this));
    }
}

CharacterLimit.prototype.charactersLeft = function () {
    let current_length = this.input.value.length;
    return this.maxlength - current_length;
}

function characterLimitMessage (characters_left) {
    let regex = /\d+/;
    let count_message = "";

    if (characters_left === -1) {
        let exceeded = Math.abs(characters_left);
        count_message = CHARACTERS_EXCEEDED_ONE_TEXT.replace(regex, exceeded);
    }
    else if (characters_left === 1) {
        count_message = CHARACTERS_REMAINING_ONE_TEXT.replace(regex, characters_left);
    }
    else if (characters_left >= 0) {
        count_message = CHARACTERS_REMAINING_MANY_TEXT.replace(regex, characters_left);
    }
    else {
        let exceeded = Math.abs(characters_left);
        count_message = CHARACTERS_EXCEEDED_MANY_TEXT.replace(regex, exceeded);
    }

    return count_message;
}

CharacterLimit.prototype.updateVisibleMessage = function () {
    let characters_left = this.charactersLeft();
    let count_message = characterLimitMessage(characters_left);
    let character_label = this.container.getElementsByClassName('character-limit')[0];

    if (characters_left < 0) {
        if (!character_label.classList.contains('limit-exceeded')) {
            character_label.classList.add('limit-exceeded');
        }
        if (!this.input.classList.contains('form-limit-error')) {
            this.input.classList.add('form-limit-error');
        }
    }
    else {
        if (character_label.classList.contains('limit-exceeded')) {
            character_label.classList.remove('limit-exceeded');
        }
        if (this.input.classList.contains('form-limit-error')) {
            this.input.classList.remove('form-limit-error');
        }
    }

    character_label.innerHTML = count_message;
}

CharacterLimit.prototype.updateScreenReaderMessage = function () {
    let characters_left = this.charactersLeft();
    let count_message = characterLimitMessage(characters_left);
    let character_label = this.container.getElementsByClassName('character-limit-sr-only')[0];
    character_label.innerHTML = count_message;
}

CharacterLimit.prototype.updateMessages = function (e) {
    this.updateVisibleMessage();
    this.updateScreenReaderMessage();
}

CharacterLimit.prototype.handleKeyUp = function (e) {
    this.updateVisibleMessage();
    this.lastKeyUpTimestamp = Date.now();
}

CharacterLimit.prototype.handleFocus = function (e) {
    this.intervalID = setInterval(function () {
        // Don't update the Screen Reader message unless it's been awhile
        // since the last key up event. Otherwise, the user will be spammed
        // with audio notifications while typing.
        if (!this.lastKeyUpTimestamp || (Date.now() - 500) >= this.lastKeyUpTimestamp) {
            // Don't update the messages unless the value of the textarea/text input has changed
            if (this.oldValue !== this.input.value) {
                this.oldValue = this.input.value;
                this.updateMessages();
            }
        }
      }.bind(this), 1000);
}

CharacterLimit.prototype.handleBlur = function (e) {
    clearInterval(this.intervalID);
    // Don't update the messages on blur unless the value of the textarea/text input has changed
    if (this.oldValue !== this.input.value) {
        this.oldValue = this.input.value;
        this.updateMessages();
    }
}

export default CharacterLimit;