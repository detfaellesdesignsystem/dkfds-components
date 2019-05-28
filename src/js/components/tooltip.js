
const domready = require('domready');
const select = require('../utils/select');
//Import tippy.js (https://atomiks.github.io/tippyjs/)
//const tippy = require('../../vendor/tippyjs/tippy.js');

var initTippy = function (){

  var tooltips = document.getElementsByClassName('js-tooltip');
  for (let tooltip of tooltips) {
    let trigger = tooltip.getAttribute('data-tippy-trigger');

    if(trigger === 'click') {
      tooltip.addEventListener('click', function (event) {

        var contentEl = document.createElement('div');
        contentEl.classList.add('tippy-content');
        contentEl.innerHTML = this.getAttribute('title');

        var arrowEl = document.createElement('div');
        arrowEl.classList.add('tippy-arrow');
        let arrowLeft = this.offsetWidth / 2 - 7;
        arrowEl.setAttribute('style', 'left: 10px;');

        var tippyTooltipEl = document.createElement('div');
        tippyTooltipEl.classList.add('tippy-tooltip');
        tippyTooltipEl.setAttribute('style', 'transition-duration: 0ms; top: 0px;');
        tippyTooltipEl.appendChild(arrowEl);
        tippyTooltipEl.appendChild(contentEl);

        var popperEl = document.createElement('div');
        popperEl.classList.add('tippy-popper');
        let noOfPoppers = document.getElementsByClassName('tooltip-popper').length + 1;
        popperEl.setAttribute('id', 'tooltip-' + noOfPoppers);
        popperEl.setAttribute('x-placement', 'top');

        popperEl.setAttribute('style', 'z-index: 9999; transition-duration: 0ms; visibility: visible; position: absolute; will-change: transform; top: '+this.offsetTop+'px; left: '+this.offsetLeft+'px; transform: translate3d(5px, 20px, 0px);');
        popperEl.appendChild(tippyTooltipEl);
        document.body.appendChild(popperEl);

        this.setAttribute('aria-describedby', 'tooltip-' + noOfPoppers);

      }, false);
    } else{
      tooltip.addEventListener('mouseleave', function( event ) {
        var popperID = this.getAttribute('aria-describedby');
        let popperEl = document.getElementById(popperID);
        popperEl.parentNode.removeChild(popperEl);

        this.setAttribute('aria-describedby', '');
      });
      tooltip.addEventListener('mouseenter', function (event) {

        console.log('mouseover', this);
        var contentEl = document.createElement('div');
        contentEl.classList.add('tippy-content');
        contentEl.innerHTML = this.getAttribute('title');

        var arrowEl = document.createElement('div');
        arrowEl.classList.add('tippy-arrow');
        arrowEl.setAttribute('style', 'left: 10px;');

        var tippyTooltipEl = document.createElement('div');
        tippyTooltipEl.classList.add('tippy-tooltip');
        tippyTooltipEl.setAttribute('style', 'transition-duration: 0ms; top: 0px;');
        tippyTooltipEl.appendChild(arrowEl);
        tippyTooltipEl.appendChild(contentEl);

        var popperEl = document.createElement('div');
        popperEl.classList.add('tippy-popper');
        let noOfPoppers = document.getElementsByClassName('tooltip-popper').length + 1;
        popperEl.setAttribute('id', 'tooltip-' + noOfPoppers);
        popperEl.setAttribute('x-placement', 'top');

        popperEl.setAttribute('style', 'z-index: 9999; transition-duration: 0ms; visibility: visible; position: absolute; will-change: transform; top: '+this.offsetTop+'px; left: '+this.offsetLeft+'px; transform: translate3d(5px, 20px, 0px);');
        popperEl.appendChild(tippyTooltipEl);
        document.body.appendChild(popperEl);

        this.setAttribute('aria-describedby', 'tooltip-' + noOfPoppers);

      }, false);
    }

  }

    //init tooltip on elements with the .js-tooltip class
/*    tippy('.js-tooltip', {
        duration: 0,
        arrow: true
    });
    */
};

domready(() => {
    initTippy();
});



