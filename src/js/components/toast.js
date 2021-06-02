class Toast{

    constructor(element){
        this.element = element;
    }

    show(){
        this.element.classList.remove('hide');
        this.element.classList.add('showing');
        this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function(){
            let toast = this.parentNode.parentNode;
            new Toast(toast).hide();
        });
        requestAnimationFrame(showToast);
    }

    hide(){
        this.element.classList.remove('show');
        this.element.classList.add('hide');
                
    }
}

function showToast(){
    let toasts = document.querySelectorAll('.toast.showing');
    for(let t in toasts){
        let toast = toasts[t];
        toast.classList.remove('showing');
        toast.classList.add('show');
    }
}

module.exports = Toast;
