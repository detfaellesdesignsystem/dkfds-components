class Dialog{

  constructor (element, setEvents = false){
    this.dialog = element;

    this.openEvent = new Event('fds.modal.open');
    this.closeEvent = new Event('fds.modal.close');
    if(this.dialog === null){
      return false;
    }

  }

  open (){
    document.getElementsByTagName('body')[ 0 ].classList.add('modal-active');
    this.dialog.classList.add('show');
    this.dialog.dispatchEvent(this.openEvent);
  }

  close (){
    this.dialog.classList.remove('show');
    document.getElementsByTagName('body')[ 0 ].classList.remove('modal-active');
    this.dialog.dispatchEvent(this.closeEvent);
  }

}
class Modal{
  constructor (button){
    console.log('MODAL:', button);
    this.button = button;
    this.modal = null;
    this.lastFocus = null;
    this.IgnoreUtilFocusChanges = false;
    if(this.button.getAttribute('data-target') !== undefined && document.querySelector(this.button.getAttribute('data-target')).length !== 0){
      this.modal = new Dialog(document.querySelector(this.button.getAttribute('data-target')));
    }
    if(this.modal.dialog !== null){
      this.setEvents();
    } else{
      console.log('Modal not found');
    }
  }

  setEvents (){
    const that = this;
    this.button.addEventListener('click', function (event){
      that.modal.open();
    });
    this.modal.dialog.addEventListener('click', function (event){
      if (event.target !== this) return;
      that.modal.close();
    });

    this.modal.dialog.getElementsByClassName('close')[ 0 ].addEventListener('click', function (event){
      that.modal.close();
    });
    this.modal.dialog.addEventListener('fds.modal.open', function (event){
      that.focusFirstDescendant(that.modal.dialog.getElementsByClassName('modal-dialog')[0]);
    });

    document.addEventListener('focus', function (event){
      that.trapFocus(event, that);
    }, true);

    document.addEventListener('keyup', function(event){
      that.handleEscape(event);
    });
  }

  handleEscape (event) {
    var key = event.which || event.keyCode;
    var modal = document.querySelector('.modal.show');
    if(modal !== null) {
      var dialog = new Dialog(modal);
      if (key === 27 && dialog.close()) {
        event.stopPropagation();
      }
    }
  }

  trapFocus (event, that) {
    if (that.IgnoreUtilFocusChanges) {
      return;
    }
    var currentDialog = that.modal.dialog.getElementsByClassName('modal-dialog')[0];
    console.log('currentDialog', currentDialog);
    if (currentDialog !== null && currentDialog.contains(event.target)) {
      that.lastFocus = event.target;
    }
    else {
      that.focusFirstDescendant(that.modal.dialog.getElementsByClassName('modal-dialog')[0]);
      if (that.lastFocus == document.activeElement) {
        that.focusLastDescendant(that.modal.dialog.getElementsByClassName('modal-dialog')[0]);
      }
      that.lastFocus = document.activeElement;
    }
  }
  /**
   * @desc Set focus on descendant nodes until the first focusable element is
   *       found.
   * @param element
   *          DOM node for which to find the first focusable descendant.
   * @returns
   *  true if a focusable element is found and focus is set.
   */
  focusFirstDescendant (element) {
    for (var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];
      if (this.attemptFocus(child) ||
        this.focusFirstDescendant(child)) {
        return true;
      }
    }
    return false;
  }

  /**
   * @desc Find the last descendant node that is focusable.
   * @param element
   *          DOM node for which to find the last focusable descendant.
   * @returns
   *  true if a focusable element is found and focus is set.
   */
  focusLastDescendant (element) {
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
      var child = element.childNodes[i];
      if (this.attemptFocus(child) ||
        this.focusLastDescendant(child)) {
        return true;
      }
    }
    return false;
  }

  /**
   * @desc Set Attempt to set focus on the current node.
   * @param element
   *          The node to attempt to focus on.
   * @returns
   *  true if element is focused.
   */
  attemptFocus (element) {
    if (!this.isFocusable(element)) {
      return false;
    }

    this.IgnoreUtilFocusChanges = true;
    try {
      element.focus();
    }
    catch (e) {
    }
    this.IgnoreUtilFocusChanges = false;
    console.log('focused', element);
    return (document.activeElement === element);
  }

  isFocusable (element) {
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
  }

}



module.exports = Modal;
