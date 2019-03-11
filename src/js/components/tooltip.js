
const domready = require('domready');
const select = require('../utils/select');
//Import tippy.js (https://atomiks.github.io/tippyjs/)
const tippy = require('../../vendor/tippyjs/tippy.js');

var initTippy = function (){
    //init tooltip on elements with the .js-tooltip class
    tippy('.js-tooltip', { 
        duration: 0,
        arrow: true
    });
};

domready(() => {
    initTippy();
});



