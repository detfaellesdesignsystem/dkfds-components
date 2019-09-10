
const domready = require('domready');
const select = require('../utils/select');
//Import tippy.js (https://atomiks.github.io/tippyjs/)
//const tippy = require('../../vendor/tippyjs/tippy.js');

var initTippy = function (){
  let className = 'js-tooltip';
  var tooltips = document.getElementsByClassName('js-tooltip');


  //var trigger = element.getAttribute('data-tooltip-trigger') || 'hover';

  /*
  * Attaching one mouseover and one mouseout listener to the document
  * instead of listeners for each trigger
  */
  document.body.addEventListener('mouseover', function(e) {
    var element = e.target;

    if(!e.target.classList.contains(className)){
      if(e.target.parentNode.classList.contains(className)){
        element = e.target.parentNode;
      }
    }

    if (!element.classList.contains('js-tooltip') || element.getAttribute('data-tooltip-trigger') === 'click' || (element.classList.contains('js-tooltip') && element.getAttribute('aria-describedby') !== null)) return;
    e.preventDefault();

    var pos = element.getAttribute('data-tooltip-position') || 'top';

    var tooltip = createTooltip(element, pos);



    document.body.appendChild(tooltip);

    positionAt(element, tooltip, pos);

  });
  var elements = document.getElementsByClassName(className);
  for(var i = 0; i < elements.length; i++) {
    elements[ i ].addEventListener('mouseout', function (e) {
      if(this.getAttribute('data-tooltip-trigger') !== 'click') {
        this.removeAttribute('aria-describedby');
        document.body.removeChild(document.querySelector('.tooltip-popper'));
      }
    });
  }
  var popover = document.querySelectorAll('.'+className+'[data-tooltip-trigger="click"]');
  for(var p = 0; p < popover.length; p++) {
    popover[ p ].addEventListener('click', function (e) {
      var element = this;
      if(element.getAttribute('aria-describedby') === null){
        var pos = element.getAttribute('data-tooltip-position') || 'top';
        var tooltip = createTooltip(element, pos);
        document.body.appendChild(tooltip);
        positionAt(element, tooltip, pos);
      } else{
        var popper = element.getAttribute('aria-describedby');
        document.body.removeChild(document.getElementById(popper));
        element.removeAttribute('aria-describedby');
      }
    });
  }

  //Clicked outside dropdown -> close it
  document.getElementsByTagName('body')[ 0 ].addEventListener('click', function (event) {
    if (!event.target.classList.contains('js-tooltip')){
      closeAll();
    }
  });
};

var closeAll = function(){
  var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');
  for(var i = 0; i < elements.length; i++) {
    var popper = elements[ i ].getAttribute('aria-describedby');
    elements[ i ].removeAttribute('aria-describedby');
    document.body.removeChild(document.getElementById(popper));
  }
};

var createTooltip = function (element, pos) {

  var tooltip = document.createElement('div');
  tooltip.className = 'tooltip-popper';
  var poppers = document.getElementsByClassName('tooltip-popper');
  var id = 'tooltip-'+poppers.length+1;
  tooltip.setAttribute('id', id);
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('x-placement', pos);
  element.setAttribute('aria-describedby', id);

  var tooltipInner = document.createElement('div');
  tooltipInner.className = 'tooltip';

  var tooltipContent = document.createElement('div');
  tooltipContent.className = 'tooltip-content';
  tooltipContent.innerHTML = element.getAttribute('data-title');
  tooltipInner.appendChild(tooltipContent);
  tooltip.appendChild(tooltipInner);

  return tooltip;
};

/**
 * Positions the tooltip.
 *
 * @param {object} parent - The trigger of the tooltip.
 * @param {object} tooltip - The tooltip itself.
 * @param {string} posHorizontal - Desired horizontal position of the tooltip relatively to the trigger (left/center/right)
 * @param {string} posVertical - Desired vertical position of the tooltip relatively to the trigger (top/center/bottom)
 *
 */
var positionAt = function (parent, tooltip, pos) {
  var parentCoords = parent.getBoundingClientRect(), left, top;
  var tooltipWidth = tooltip.offsetWidth;

  var dist = 8;

  left = parseInt(parentCoords.left) + ((parent.offsetWidth - tooltip.offsetWidth) / 2);

  switch (pos) {
    case 'bottom':
      top = parseInt(parentCoords.bottom) + dist;
      break;

    default:
    case 'top':
      top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
  }

  if(left < 0) {
    left = parseInt(parentCoords.left);
  }

  if((top + tooltip.offsetHeight) >= window.innerHeight){
    top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
  }


  top  = (top < 0) ? parseInt(parentCoords.bottom) + dist : top;
  if(window.innerWidth < (left + tooltipWidth)){
    tooltip.style.right = dist + 'px';
  } else {
    tooltip.style.left = left + 'px';
  }
  tooltip.style.top  = top + pageYOffset + 'px';
};

domready(() => {
  initTippy();
});



