class Toast{

    constructor(element){
        this.element = element;
    }

    show(){
        this.element.classList.remove('hide');
        this.element.classList.add('showing');
        this.element.getElementsByClassName('notification-close')[0].addEventListener('click', function(){
            let toast = this.parentNode.parentNode;
            new Toast(toast).hide();
        });
        requestAnimationFrame(showToast);
    }

    hide(){
        this.element.classList.remove('show');
        this.element.classList.add('hiding');        
        requestAnimationFrame(hideToast);
                
    }

    dispose(){
        this.hide();

    }
}
function showToast(){
    let toasts = document.querySelectorAll('.notification.showing');
    toasts.forEach(toast => {
        toast.classList.remove('showing');
        toast.classList.add('show');
    });
}

function hideToast(){
    let toasts = document.querySelectorAll('.notification.hiding');
    toasts.forEach(toast => {
        toast.classList.remove('hiding');
        toast.classList.add('hide');
    });
}

module.exports = Toast;
