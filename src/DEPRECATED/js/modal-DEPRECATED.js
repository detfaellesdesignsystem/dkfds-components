'use strict';
/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */
function Modal ($modal) {
    this.$modal = $modal;
    let id = this.$modal.getAttribute('id');
    this.triggers = document.querySelectorAll('[data-module="modal"][data-target="'+id+'"]');
}

/**
 * Set events
 */
Modal.prototype.init = function () {
  let triggers = this.triggers;
  for (let i = 0; i < triggers.length; i++){
    let trigger = triggers[ i ];
    trigger.addEventListener('click', this.show.bind(this));
  }
  let closers = this.$modal.querySelectorAll('[data-modal-close]');
  for (let c = 0; c < closers.length; c++){
    let closer = closers[ c ];
    closer.addEventListener('click', this.hide.bind(this));
  }
};

/**
 * Hide modal
 */
Modal.prototype.hide = function (){
  let modalElement = this.$modal;
  if(modalElement !== null){
    modalElement.setAttribute('aria-hidden', 'true');

    let eventClose = document.createEvent('Event');
    eventClose.initEvent('fds.modal.hidden', true, true);
    modalElement.dispatchEvent(eventClose);

    let $backdrop = document.querySelector('#modal-backdrop');
    $backdrop?.parentNode.removeChild($backdrop);

    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.removeEventListener('keydown', trapFocus, true);

    if(!hasForcedAction(modalElement)){
      document.removeEventListener('keyup', handleEscape);
    }
    let dataModalOpener = modalElement.getAttribute('data-modal-opener');
    if(dataModalOpener !== null){
      let opener = document.getElementById(dataModalOpener)
      if(opener !== null){
        opener.focus();
      }
      modalElement.removeAttribute('data-modal-opener');
    }
  }
};

/**
 * Show modal
 */
Modal.prototype.show = function (e = null){
  let modalElement = this.$modal;
  if(modalElement !== null){
    if(e !== null){
      let openerId = e.target.getAttribute('id');
      if(openerId === null){
        openerId = 'modal-opener-'+Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        e.target.setAttribute('id', openerId)
      }
      modalElement.setAttribute('data-modal-opener', openerId);
    }

    // Hide open modals - FDS do not recommend more than one open modal at a time
    let activeModals = document.querySelectorAll('.fds-modal[aria-hidden=false]');
    for(let i = 0; i < activeModals.length; i++){
      new Modal(activeModals[i]).hide();
    }

    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.setAttribute('tabindex', '-1');

    let eventOpen = document.createEvent('Event');
    eventOpen.initEvent('fds.modal.shown', true, true);
    modalElement.dispatchEvent(eventOpen);

    let $backdrop = document.createElement('div');
    $backdrop.classList.add('modal-backdrop');
    $backdrop.setAttribute('id', "modal-backdrop");
    document.getElementsByTagName('body')[0].appendChild($backdrop);

    document.getElementsByTagName('body')[0].classList.add('modal-open');

    modalElement.focus();

    document.addEventListener('keydown', trapFocus, true);
    if(!hasForcedAction(modalElement)){
      document.addEventListener('keyup', handleEscape);
    }

  }
};

/**
 * Close modal when hitting ESC
 * @param {KeyboardEvent} event 
 */
let handleEscape = function (event) {
  var key = event.which || event.keyCode;
  let modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
  let currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
  if (key === 27){
    let possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');
    if(possibleOverflowMenus.length === 0){
      currentModal.hide();
    }
  }
};

/**
 * Trap focus in modal when open
 * @param {PointerEvent} e
 */
 function trapFocus(e){
  var currentDialog = document.querySelector('.fds-modal[aria-hidden=false]');
  if(currentDialog !== null){
    var focusableElements = currentDialog.querySelectorAll('a[href]:not([disabled]):not([aria-hidden=true]), button:not([disabled]):not([aria-hidden=true]), textarea:not([disabled]):not([aria-hidden=true]), input:not([type=hidden]):not([disabled]):not([aria-hidden=true]), select:not([disabled]):not([aria-hidden=true]), details:not([disabled]):not([aria-hidden=true]), [tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden=true])');
    
    var firstFocusableElement = focusableElements[0];
    var lastFocusableElement = focusableElements[focusableElements.length - 1];

    var isTabPressed = (e.key === 'Tab' || e.keyCode === 9);

    if (!isTabPressed) { 
      return; 
    }

    if ( e.shiftKey ) /* shift + tab */ {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
          e.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
          e.preventDefault();
      }
    }
  }
};

function hasForcedAction (modal){
  if(modal.getAttribute('data-modal-forced-action') === null){
    return false;
  }
  return true;
}

export default Modal;
