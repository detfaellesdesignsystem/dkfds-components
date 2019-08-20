
const domready = require('domready');

/**
 * Import modal lib.
 * https://micromodal.now.sh
 */
const microModal = require("../../vendor/micromodal.js");
domready(() => {
	microModal.init({
    onShow: function(){
      document.getElementsByTagName('body')[0].classList.add('modal-active');
    },
    onClose: function(){
      document.getElementsByTagName('body')[0].classList.remove('modal-active');
    }
  }); //init all modals
});
