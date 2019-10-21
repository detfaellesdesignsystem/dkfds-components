'use strict';

class RadioToggleGroup{
    constructor(el){
        this.jsToggleTrigger = '.js-radio-toggle-group';
        this.jsToggleTarget = 'data-js-target';

        this.eventClose = document.createEvent('Event');
        this.eventClose.initEvent('fds.collapse.close', true, true);

        this.eventOpen = document.createEvent('Event');
        this.eventOpen.initEvent('fds.collapse.open', true, true);
        this.radioEls = null;
        this.targetEl = null;

        this.init(el);
    }

    init (el){
        this.radioGroup = el;
        this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
        var that = this;

        for(let i = 0; i < this.radioEls.length; i++){
          var radio = this.radioEls[ i ];
          radio.addEventListener('change', function (){
            for(let a = 0; a < that.radioEls.length; a++ ){
              that.toggle(that.radioEls[ a ]);
            }
          });

          this.toggle(radio); //Initial value;
        }
    }

    toggle (triggerEl){
        var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
        if(targetAttr !== null && targetAttr !== undefined){
            var targetEl = document.querySelector(targetAttr);
            if(targetEl !== null && targetEl !== undefined){
                if(triggerEl.checked){
                    this.open(triggerEl, targetEl);
                }else{
                    this.close(triggerEl, targetEl);
                }
            }
        }
    }

    open(triggerEl, targetEl){
        if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
            triggerEl.setAttribute('aria-expanded', 'true');
            targetEl.classList.remove('collapsed');
            targetEl.setAttribute('aria-hidden', 'false');
            triggerEl.dispatchEvent(this.eventOpen);
        }
    }
    close(triggerEl, targetEl){
        if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
            triggerEl.dispatchEvent(this.eventClose);
        }
    }
}

module.exports = RadioToggleGroup;
