'use strict';
const behavior = require('../utils/behavior');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;
const LINK = `.${PREFIX}tabnav a`;

const setTabnavindex = function (event) {
  changeFocusTab(this);
};


const changeFocusTab = function (triggerEl) {
  // loop all elements in current tabnav and disable them
  let parentNode = triggerEl.parentNode.parentNode;
  let allNodes = triggerEl.parentNode.parentNode.childNodes;
  for(var i = 0; i < allNodes.length; i++){
    if(allNodes[ i ].nodeName === 'LI'){
      for(var a = 0; a < allNodes[ i ].childNodes.length; a++){
        if(allNodes[ i ].childNodes[ a ].nodeName === 'A') {
          allNodes[ i ].childNodes[ a ].setAttribute('aria-expanded', false);
          var nodeTarget = allNodes[ i ].childNodes[ a ].getAttribute('href').replace('#', '');
          document.getElementById(nodeTarget).setAttribute('aria-hidden', true);
        }
      }
    }
  }
  // enable selected tab
  let targetId = triggerEl.getAttribute('href').replace('#', '');
  triggerEl.setAttribute('aria-expanded', true);
  document.getElementById(targetId).setAttribute('aria-hidden', false);
  // set margin-bottom on tabnav so content below doesn't overlap
  var style = window.getComputedStyle(document.getElementById(targetId));
  var height = parseInt(document.getElementById(targetId).offsetHeight) + parseInt(style.getPropertyValue('margin-bottom'));
  parentNode.style.marginBottom = height + 'px';

};

module.exports = behavior({
  [ CLICK ]: {
    [ LINK ]: setTabnavindex,
  },
}, {
  init: root => {
    // initiate tabs if url contains hash
    var targetID = location.hash.replace('#', '');
    if(targetID != '') {
      var triggerEL = document.querySelector('.tabnav a[href="#'+targetID+'"]');
      changeFocusTab(triggerEL);
    }
  },
});
