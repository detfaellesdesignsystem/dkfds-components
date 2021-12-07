'use strict';
/**
 * Show/hide toast component
 * @param {HTMLElement} element 
 */
function Toast (element){
    this.element = element;
}

/**
 * Show toast
 */
Toast.prototype.show = function(){
    this.element.classList.remove('hide');
    this.element.classList.add('showing');
    this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function(){
        let toast = this.parentNode.parentNode;
        new Toast(toast).hide();
    });
    requestAnimationFrame(showToast);
}

/**
 * Hide toast
 */
Toast.prototype.hide = function(){
    this.element.classList.remove('show');
    this.element.classList.add('hide');         
}

/**
 * Adds classes to make show animation
 */
function showToast(){
    let toasts = document.querySelectorAll('.toast.showing');
    for(let t = 0; t < toasts.length; t++){
        let toast = toasts[t];
        toast.classList.remove('showing');
        toast.classList.add('show');
    }
}

export default Toast;