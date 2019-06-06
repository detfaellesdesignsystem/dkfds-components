
const domready = require('domready');
const select = require('../utils/select');
//Import tippy.js (https://atomiks.github.io/tippyjs/)
//const tippy = require('../../vendor/tippyjs/tippy.js');

var initTippy = function (){
  let className = 'js-tooltip';
  var tooltips = document.getElementsByClassName('js-tooltip');

  /*
  * Attaching one mouseover and one mouseout listener to the document
  * instead of listeners for each trigger
  */
  document.body.addEventListener('mouseover', function(e) {
    if (!e.target.classList.contains('js-tooltip')) return;


    var pos = e.target.getAttribute('data-tooltip-position') || 'top',
      posHorizontal = 'center',
      posVertical = pos;

    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popper';
    tooltip.setAttribute('id', 'tooltip-1');
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('x-placement', pos);
    e.target.setAttribute('aria-describedby', 'tooltip-1');

    var tooltipInner = document.createElement('div');
    tooltipInner.className = 'tooltip';

    var tooltipArrow = document.createElement('div');
    tooltipArrow.className = 'tooltip-arrow';
    tooltipInner.appendChild(tooltipArrow);

    var tooltipContent = document.createElement('div');
    tooltipContent.className = 'tooltip-content';
    tooltipContent.innerHTML = e.target.getAttribute('title');
    tooltipInner.appendChild(tooltipContent);
    tooltip.appendChild(tooltipInner);

    document.body.appendChild(tooltip);

    positionAt(e.target, tooltip, posHorizontal, posVertical);
  });

  document.body.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('js-tooltip')){
        e.target.removeAttribute('aria-describedby');
        document.body.removeChild(document.querySelector('.tooltip-popper'));
    }
  });


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
var positionAt = function (parent, tooltip, posHorizontal, posVertical) {
  var parentCoords = parent.getBoundingClientRect(), left, top;
  var dist = 10;
  console.log(posVertical);
  console.log(posHorizontal);

  switch (posHorizontal) {
    case 'left':
      left = parseInt(parentCoords.left) - dist - tooltip.offsetWidth;
      if (parseInt(parentCoords.left) - tooltip.offsetWidth < 0) {
        left = dist;
      }
      break;

    case 'right':
      left = parentCoords.right + dist;
      if (parseInt(parentCoords.right) + tooltip.offsetWidth > document.documentElement.clientWidth) {
        left = document.documentElement.clientWidth - tooltip.offsetWidth - dist;
      }
      break;

    default:
    case 'center':
      left = parseInt(parentCoords.left) + ((parent.offsetWidth - tooltip.offsetWidth) / 2);
  }

  switch (posVertical) {
    case 'center':
      top = (parseInt(parentCoords.top) + parseInt(parentCoords.bottom)) / 2 - tooltip.offsetHeight / 2;
      break;

    case 'bottom':
      top = parseInt(parentCoords.bottom) + dist;
      break;

    default:
    case 'top':
      top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
  }

  left = (left < 0) ? parseInt(parentCoords.left) : left;
  top  = (top < 0) ? parseInt(parentCoords.bottom) + dist : top;

  tooltip.style.left = left + 'px';
  tooltip.style.top  = top + pageYOffset + 'px';
};

domready(() => {
  initTippy();
});



