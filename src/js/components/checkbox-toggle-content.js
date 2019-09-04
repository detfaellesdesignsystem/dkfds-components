'use strict';
class CheckboxToggleContent{
    constructor(el){
        this.jsToggleTrigger = '.js-checkbox-toggle-content';
        this.jsToggleTarget = 'data-js-target';
        this.eventOpen = new Event('expanded');
        this.eventClose = new Event('collapsed');
        this.targetEl = null;
        this.checkboxEl = null;

        this.init(el);
    }

    init(el){
        this.checkboxEl = el;
        var that = this;
        this.checkboxEl.addEventListener('change',function(event){
            that.toggle(that.checkboxEl);
        });
        this.toggle(this.checkboxEl);
    }

    toggle(triggerEl){
        var targetAttr = triggerEl.getAttribute(this.jsToggleTarget)
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

module.exports = CheckboxToggleContent;
