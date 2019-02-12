'use strict';
const behavior = require('../utils/behavior');
const select = require('../utils/select');
const closest = require('../utils/closest');

const jsDayInput = '.js-calendar-day-input';
const jsMonthInput = '.js-calendar-month-input';
const jsYearInput = '.js-calendar-year-input';

class datepickerGroup {
  constructor(el){

    this.dateGroup = el;
    this.formGroup = closest(el, '.form-group');
    this.dayInputElement = null;
    this.monthInputElement = null;
    this.yearInputElement = null;

    this.initDateInputs();
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

}

module.exports = datepickerGroup;
