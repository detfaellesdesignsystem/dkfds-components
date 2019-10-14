'use strict';
class Tabnav {
  constructor (tabnav){
    this.tabnav = tabnav;
    let tabMenuItems = this.tabnav.querySelectorAll('a');
    let that = this;
    for(let i = 0; i < tabMenuItems.length; i++) {
      tabMenuItems[ i ].addEventListener('click', function (event){
        event.preventDefault();
        that.changeFocusTab(this);
      });
    }
    this.setTab();
  }

  setTab (){
    var targetID = location.hash.replace('#', '');
    if(targetID != '') {
      var triggerEL = this.tabnav.querySelector('a[href="#'+targetID+'"]');
      this.changeFocusTab(triggerEL);
    } else{
      // set margin-bottom on tabnav so content below doesn't overlap

      var targetId = this.tabnav.querySelector('li.active .tabnav-item').getAttribute('href').replace('#', '');
      var style = window.getComputedStyle(document.getElementById(targetId));
      var height = parseInt(document.getElementById(targetId).offsetHeight) + parseInt(style.getPropertyValue('margin-bottom'));
      this.tabnav.style.marginBottom = height + 'px';

    }

  }

  changeFocusTab (triggerEl) {

    let changeTabEvent = new Event('fds.tabnav.changed');
    let tabOpenEvent = new Event('fds.tabnav.open');
    let tabCloseEvent = new Event('fds.tabnav.close');
    // loop all elements in current tabnav and disable them
    let parentNode = triggerEl.parentNode.parentNode;
    let allNodes = triggerEl.parentNode.parentNode.childNodes;
    for (var i = 0; i < allNodes.length; i++) {
      if (allNodes[i].nodeName === 'LI') {
        for (var a = 0; a < allNodes[i].childNodes.length; a++) {
          if (allNodes[i].childNodes[a].nodeName === 'A') {
            if(allNodes[i].childNodes[a].classList.contains('tabnav-item')) {
              if (allNodes[i].childNodes[a].getAttribute('aria-expanded') === true) {
                allNodes[i].childNodes[a].dispatchEvent(tabCloseEvent);
              }

              allNodes[i].childNodes[a].parentNode.classList.remove('active');
              allNodes[i].childNodes[a].setAttribute('aria-expanded', false);
              var nodeTarget = allNodes[i].childNodes[a].getAttribute('href').replace('#', '');
              document.getElementById(nodeTarget).setAttribute('aria-hidden', true);
            }
          }
        }
      }
    }
    // enable selected tab
    let targetId = triggerEl.getAttribute('href').replace('#', '');
    if(history.pushState) {
      history.pushState(null, null, '#'+targetId);
    }
    else {
      location.hash = '#'+targetId;
    }
    triggerEl.setAttribute('aria-expanded', true);
    triggerEl.parentNode.classList.add('active');
    document.getElementById(targetId).setAttribute('aria-hidden', false);
    triggerEl.dispatchEvent(tabOpenEvent);
    // set margin-bottom on tabnav so content below doesn't overlap
    var style = window.getComputedStyle(document.getElementById(targetId));
    var height = parseInt(document.getElementById(targetId).offsetHeight) + parseInt(style.getPropertyValue('margin-bottom'));
    parentNode.style.marginBottom = height + 'px';

    parentNode.dispatchEvent(changeTabEvent);

  }
}

module.exports = Tabnav;
