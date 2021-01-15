class Tooltip{
  constructor(element){
    this.element = element;
    if(this.element.getAttribute('data-tooltip') === null){
      throw new Error(`Tooltip text is missing. Add attribute data-tooltip and the content of the tooltip as value.`);
    }
    this.setEvents();
  }

  setEvents (){
    let that = this;
    if(this.element.getAttribute('data-tooltip-trigger') !== 'click') {
      this.element.addEventListener('mouseover', function (e) {
        var element = e.target;

        if (element.getAttribute('aria-describedby') !== null) return;
        e.preventDefault();

        var pos = element.getAttribute('data-tooltip-position') || 'top';

        var tooltip = that.createTooltip(element, pos);

        document.body.appendChild(tooltip);

        that.positionAt(element, tooltip, pos);

      });
      this.element.addEventListener('focus', function (e) {
        var element = e.target;

        if (element.getAttribute('aria-describedby') !== null) return;
        e.preventDefault();

        var pos = element.getAttribute('data-tooltip-position') || 'top';

        var tooltip = that.createTooltip(element, pos);

        document.body.appendChild(tooltip);

        that.positionAt(element, tooltip, pos);

      });

      this.element.addEventListener('blur', function (e) {
        var tooltip = this.getAttribute('aria-describedby');
        if(tooltip !== null && document.getElementById(tooltip) !== null){
          document.body.removeChild(document.getElementById(tooltip));
        }
        this.removeAttribute('aria-describedby');
      });
      this.element.addEventListener('mouseout', function (e) {
        var tooltip = this.getAttribute('aria-describedby');
        if(tooltip !== null && document.getElementById(tooltip) !== null){
          document.body.removeChild(document.getElementById(tooltip));
        }
        this.removeAttribute('aria-describedby');
      });
    } else {
      this.element.addEventListener('click', function (e) {
        var element = this;
        if (element.getAttribute('aria-describedby') === null) {
          var pos = element.getAttribute('data-tooltip-position') || 'top';
          var tooltip = that.createTooltip(element, pos);
          document.body.appendChild(tooltip);
          that.positionAt(element, tooltip, pos);
        } else {
          var popper = element.getAttribute('aria-describedby');
          document.body.removeChild(document.getElementById(popper));
          element.removeAttribute('aria-describedby');
        }
      });
    }

    document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
      if (!event.target.classList.contains('js-tooltip')) {
        that.closeAll();
      }
    });

  }

  closeAll (){
    var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');
    for(var i = 0; i < elements.length; i++) {
      var popper = elements[ i ].getAttribute('aria-describedby');
      elements[ i ].removeAttribute('aria-describedby');
      document.body.removeChild(document.getElementById(popper));
    }
  }
  createTooltip (element, pos) {
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
    tooltipContent.innerHTML = element.getAttribute('data-tooltip');
    tooltipInner.appendChild(tooltipContent);
    tooltip.appendChild(tooltipInner);

    return tooltip;
  }

  /**
   * Positions the tooltip.
   *
   * @param {object} parent - The trigger of the tooltip.
   * @param {object} tooltip - The tooltip itself.
   * @param {string} posHorizontal - Desired horizontal position of the tooltip relatively to the trigger (left/center/right)
   * @param {string} posVertical - Desired vertical position of the tooltip relatively to the trigger (top/center/bottom)
   *
   */
  positionAt (parent, tooltip, pos) {
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
  }
}

module.exports = Tooltip;
