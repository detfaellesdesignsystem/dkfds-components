

function Modal ($modal){
  this.$modal = $modal;
  let id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="'+id+'"]');
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

Modal.prototype.show = function (){
  let modalElement = this.$modal;
  if(modalElement !== null){
    modalElement.setAttribute('aria-hidden', 'false');

    let eventOpen = document.createEvent('Event');
    eventOpen.initEvent('fds.modal.shown', true, true);
    modalElement.dispatchEvent(eventOpen);

    let $backdrop = document.createElement('div');
    $backdrop.classList.add('modal-backdrop');
    $backdrop.setAttribute('id', "modal-backdrop");
    document.getElementsByTagName('body')[0].appendChild($backdrop);

    document.getElementsByTagName('body')[0].classList.add('modal-open');
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
  }
};


export default Modal;
