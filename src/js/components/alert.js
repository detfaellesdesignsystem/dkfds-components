'use strict';
function Alert(alert){
    this.alert = alert;
}

Alert.prototype.init = function(){
    let close = this.alert.getElementsByClassName('alert-close');
    if(close.length === 1){
        close[0].addEventListener('click', this.hide.bind(this));
    }
}

Alert.prototype.hide = function(){
    this.alert.classList.add('d-none');
    let eventHide = new Event('fds.alert.hide');
    this.alert.dispatchEvent(eventHide);
};

Alert.prototype.show = function(){
    this.alert.classList.remove('d-none');
    
    let eventShow = new Event('fds.alert.show');
    this.alert.dispatchEvent(eventShow);
};

export default Alert;