'use strict';
const Pikaday = require("../../vendor/pikaday.js");
const behavior = require('../utils/behavior');
const select = require('../utils/select');
const closest = require('../utils/closest');

const jsDatepickerSelector = '.js-calendar-datepicker';
const jsDayInput = '.js-calendar-day-input';
const jsMonthInput = '.js-calendar-month-input';
const jsYearInput = '.js-calendar-year-input';

class datepickerGroup {
  constructor(el){
    
    this.pikadayInstance = null;
    this.datepickerElement = select(jsDatepickerSelector, el);
    this.dateGroup = el;
    this.formGroup = closest(el, '.form-group');
    this.dayInputElement = null;
    this.monthInputElement = null;
    this.yearInputElement = null;   

    this.initDateInputs();
    this.initDatepicker(this.datepickerElement[0]);
  }

  initDateInputs(){
    this.dayInputElement = select(jsDayInput, this.dateGroup)[0]
    this.monthInputElement = select(jsMonthInput, this.dateGroup)[0];
    this.yearInputElement = select(jsYearInput, this.dateGroup)[0];

    var that = this;
    
    this.dayInputElement.addEventListener("blur", function(){
      that.formatInputs();
      that.validateInputs();
    });

    this.monthInputElement.addEventListener("blur", function(){
      that.formatInputs();
      that.validateInputs();
    });

    this.yearInputElement.addEventListener("blur", function(){
      that.formatInputs();
      that.validateInputs();
    });
  }

  initDatepicker(el){
    if(el){
      //Note: el may not be a <svg>, IE11 does not add .blur() method to svg elements (--> esc and enter does not dismiss pikaday). 
      this.initDone = false;
      var that = this;

      this.pikadayInstance = new Pikaday({
        field: el,
        format: 'DD/MM/YYYY',
        firstDay: 1, //mandag
        i18n: {
          previousMonth : 'Forrige måned',
          nextMonth     : 'Næste måned',
          months        : ['Januar','Februar','Marth','April','Maj','Juni','July','August','September','Oktober','November','December'],
          weekdays      : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
          weekdaysShort : ['Søn','Man','Tir','Ons','Tor','Fre','Lør']
        },
        onSelect: function(date) {
          //selected new date in pikaday, update input fields. 
          if(that.initDone){
            that.updateDateInputs(date);
            that.validateInputs();
          }
        },
        onOpen: function(){
          //update pikaday with values from input fields
          var day = parseInt(that.dayInputElement.value);
          var month = parseInt(that.monthInputElement.value) -1;
          var year = parseInt(that.yearInputElement.value);
          var newDate = new Date(year, month, day);
          if(that.validateInputs()){
            that.updateDatepickerDate(newDate)
          }
        }
      });

      var initDate = new Date();
      this.pikadayInstance.setDate(initDate);
      //this.updateDateInputs(initDate);
      this.initDone = true;
    }
  }

  validateInputs(){
    var day = parseInt(this.dayInputElement.value)
    var month = parseInt(this.monthInputElement.value);
    var year = parseInt(this.yearInputElement.value);
    var maxDay = new Date(year, month, 0).getDate();

    var msg = "";
    var isValid = true; 
    if(day > maxDay){
      isValid = false;
      msg = "Hov, den dag findes ikke i den valgte måned."
      this.showError(msg);
    }else if(month > 12){
      isValid = false;
      msg = "Hov, den måned findes ikke."
      this.showError(msg);
    }

    if(isValid){
      this.removeError();
    }

    return isValid;
  }

  showError(msg){
    this.formGroup.classList.add("form-error");
    select(".form-error-message",  this.formGroup)[0].textContent = msg;
  }
  removeError(){
    this.formGroup.classList.remove("form-error");
    select(".form-error-message",  this.formGroup)[0].textContent = "";
  }

  updateDateInputs(date){
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    
    this.dayInputElement.value = this.dayFormat(day);
    this.monthInputElement.value = this.monthFormat(month);
    this.yearInputElement.value = year;
  }

  //adds 0 at the front of day number
  dayFormat(day){
    return ("0" + day).slice(-2);
  }
  monthFormat(month){
    return ("0" + month).slice(-2);
  }
  formatInputs(){
    var day = parseInt(this.dayInputElement.value)
    var month = parseInt(this.monthInputElement.value);
    if(!isNaN(day) ) {
      this.dayInputElement.value = this.dayFormat(day);
    } 
    if(!isNaN(month)){
      this.monthInputElement.value = this.monthFormat(month);
    }
  }

  updateDatepickerDate(newDate){
    this.pikadayInstance.setDate(newDate);
  }
}

module.exports = datepickerGroup;