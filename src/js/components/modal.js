
function Modal ($modal){
  this.$modal = $modal;
  let id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="'+id+'"]');
  window.modal = {"lastFocus": document.activeElement, "ignoreUtilFocusChanges": false};
}

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

Modal.prototype.hide = function (){
  let modalElement = this.$modal;
  if(modalElement !== null){
    modalElement.setAttribute('aria-hidden', 'true');

    let eventClose = document.createEvent('Event');
    eventClose.initEvent('fds.modal.hidden', true, true);
    modalElement.dispatchEvent(eventClose);

    let $backdrop = document.querySelector('#modal-backdrop');
    $backdrop.parentNode.removeChild($backdrop);

    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.removeEventListener('focus', this.trapFocus, true);

    document.removeEventListener('keyup', handleEscape);
  }
};


Modal.prototype.show = function (){
  let modalElement = this.$modal;
  if(modalElement !== null){
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
    window.modal.lastFocus = document.activeElement;

    document.addEventListener('focus', this.trapFocus, true);

    document.addEventListener('keyup', handleEscape);

  }
};

let handleEscape = function (event) {
  var key = event.which || event.keyCode;
  let currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
  if (key === 27 && currentModal.hide()) {
    event.stopPropagation();
  }
};


Modal.prototype.trapFocus = function(event){
    if (window.modal.ignoreUtilFocusChanges) {
      return;
    }
    var currentDialog = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
    if (currentDialog.$modal.getElementsByClassName('modal-content')[0].contains(event.target) || currentDialog.$modal == event.target) {
      window.modal.lastFocus = event.target;
    }
    else {
      currentDialog.focusFirstDescendant(currentDialog.$modal);
      if (window.modal.lastFocus == document.activeElement) {
        currentDialog.focusLastDescendant(currentDialog.$modal);
      }
      window.modal.lastFocus = document.activeElement;
    }
};

Modal.prototype.isFocusable = function (element) {
  if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
    return true;
  }

  if (element.disabled) {
    return false;
  }

  switch (element.nodeName) {
    case 'A':
      return !!element.href && element.rel != 'ignore';
    case 'INPUT':
      return element.type != 'hidden' && element.type != 'file';
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;
    default:
      return false;
  }
};


Modal.prototype.focusFirstDescendant = function (element) {
  for (var i = 0; i < element.childNodes.length; i++) {
    var child = element.childNodes[i];
    if (this.attemptFocus(child) ||
      this.focusFirstDescendant(child)) {
      return true;

    }
  }
  return false;
};

Modal.prototype.focusLastDescendant = function (element) {
  for (var i = element.childNodes.length - 1; i >= 0; i--) {
    var child = element.childNodes[i];
    if (this.attemptFocus(child) ||
      this.focusLastDescendant(child)) {
      return true;
    }
  }
  return false;
};

Modal.prototype.attemptFocus = function (element) {
  if (!this.isFocusable(element)) {
    return false;
  }

  window.modal.ignoreUtilFocusChanges = true;
  try {
    element.focus();
  }
  catch (e) {
  }
  window.modal.ignoreUtilFocusChanges = false;
  return (document.activeElement === element);
};


export default Modal;
