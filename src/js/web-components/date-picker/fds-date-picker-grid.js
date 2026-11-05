import * as Util from './fds-date-picker-utils';
import * as CE from '../custom-element-utils';
import { styles } from './fds-date-picker-grid-styling.js';

const CHEVRON_DOWN_PATH = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
const CHEVRON_LEFT_PATH = 'M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z';
const CHEVRON_RIGHT_PATH = 'M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSDatePickerGrid extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['min-date', 'max-date', 'selected-date', 'default-date', 'text-months', 'text-days', 'text-prevbutton', 'text-nextbutton', 'text-date-announcement', 'text-mindate', 'text-maxdate'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    #previousMinDate;
    #previousMaxDate;
    #correctedMinDate;
    #correctedMaxDate;

    #MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
    #DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
    #GRID_ROWS = 6; // To avoid potential height changes when changing month, the calendar grid has a fixed set of rows
    #TOTAL_GRIDCELLS;
    #CELL_DATE_FORMAT = 'DAY. MONTH YEAR';

    #DEFAULT_MIN_DATE;
    #DEFAULT_MAX_DATE;

    #textMinDate;
    #textMaxDate;

    #hasDatePickerConnection;
    #linkedGrid = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleKeydown = (event) => {
        if (event.target.hasAttribute('data-date')) {

            const focusedDay = Util.stringToDate(event.target.getAttribute('data-date'));
            const minDate = this.#correctedMinDate;
            const maxDate = this.#correctedMaxDate;

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    let yesterday = Util.getYesterday(focusedDay);
                    if (yesterday < minDate) { yesterday = minDate; }
                    this.#redraw(yesterday, true);
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    let tomorrow = Util.getTomorrow(focusedDay);
                    if (maxDate < tomorrow) { tomorrow = maxDate; }
                    this.#redraw(tomorrow, true);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    let prevWeek = Util.getPrevWeek(focusedDay);
                    if (prevWeek < minDate) { prevWeek = minDate; }
                    this.#redraw(prevWeek, true);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    let nextWeek = Util.getNextWeek(focusedDay);
                    if (maxDate < nextWeek) { nextWeek = maxDate; }
                    this.#redraw(nextWeek, true);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    this.setAttribute('selected-date', event.target.getAttribute('data-date'));
                    this.dispatchEvent(new Event('date-clicked'));
                    break;
                case 'PageDown':
                    event.preventDefault();
                    if (event.shiftKey) {
                        let nextYear = Util.getNextYear(focusedDay);
                        if (maxDate < nextYear) { nextYear = maxDate; }
                        this.#redraw(nextYear, true);
                    }
                    else {
                        let nextMonth = Util.getNextMonth(focusedDay);
                        if (maxDate < nextMonth) { nextMonth = maxDate; }
                        this.#redraw(nextMonth, true);
                    }
                    break;
                case 'PageUp':
                    event.preventDefault();
                    if (event.shiftKey) {
                        let prevYear = Util.getPrevYear(focusedDay);
                        if (prevYear < minDate) { prevYear = minDate; }
                        this.#redraw(prevYear, true);
                    }
                    else {
                        let prevMonth = Util.getPrevMonth(focusedDay);
                        if (prevMonth < minDate) { prevMonth = minDate; }
                        this.#redraw(prevMonth, true);
                    }
                    break;
                case 'Home':
                    event.preventDefault();
                    // Go to first day of the month
                    if (event.ctrlKey) {
                        const month = parseInt(this.shadowRoot.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);
                        let firstDay = Util.dateFromIntegers(year, month, 1);
                        if (firstDay < minDate) { firstDay = minDate; }
                        this.#redraw(firstDay, true);
                    }
                    // Go to first day of the week (Monday)
                    else {
                        const weekDay = Util.getWeekday(focusedDay);
                        if (weekDay !== 0) {
                            let monday = new Date(focusedDay);
                            monday.setDate(focusedDay.getDate() - weekDay);
                            if (monday < minDate) { monday = minDate; }
                            this.#redraw(monday, true);
                        }
                    }
                    break;
                case 'End':
                    event.preventDefault();
                    // Go to last day of the month
                    if (event.ctrlKey) {
                        const month = parseInt(this.shadowRoot.querySelector('.selected-month').value, 10);
                        const year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);
                        const day = Util.totalDaysInMonth(Util.dateFromIntegers(year, month, 1));
                        let lastDay = Util.dateFromIntegers(year, month, day);
                        if (maxDate < lastDay) { lastDay = maxDate; }
                        this.#redraw(lastDay, true);
                    }
                    // Go to last day of the week (Sunday)
                    else {
                        const weekDay = Util.getWeekday(focusedDay);
                        if (weekDay !== 6) {
                            let sunday = new Date(focusedDay);
                            sunday.setDate(focusedDay.getDate() + (6 - weekDay));
                            if (maxDate < sunday) { sunday = maxDate; }
                            this.#redraw(sunday, true);
                        }
                    }
                    break;
            }
        }
    };

    #handleChangeMonth = (event) => {
        this.#selectChange(event);
    };

    #handleChangeYear = (event) => {
        this.#selectChange(event);
    };

    #handlePrevMonth = (event) => {
        this.#monthButtonClicked(event);
    };

    #handleNextMonth = (event) => {
        this.#monthButtonClicked(event);
    };

    #handleDateClick = (event) => {
        this.#dateClicked(event);
    };

    #handleRedrawLinkedGrid = () => {
        const focusableDate = this.#linkedGrid?.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
        this.#linkedGrid?.forceCompleteRedraw(Util.stringToDate(focusableDate));
    };

    #handleRedrawSelf = () => {
        const focusableDate = this.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
        this.forceCompleteRedraw(Util.stringToDate(focusableDate));
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #init() {
        if (this.#initialized) return;

        this.#create();

        // Determine which date to place the focus on in the grid
        let dateToFocus = new Date();
        if (this.getAttribute('selected-date')) {
            dateToFocus = Util.stringToDate(this.getAttribute('selected-date'));
        }
        else if (this.getAttribute('default-date')) {
            dateToFocus = Util.stringToDate(this.getAttribute('default-date'));
        }
        this.#redraw(dateToFocus, false);

        this.#addEventListeners();

        this.#initialized = true;
    }

    #setDayHeader(th, day) {
        const visible = document.createElement('span');
        visible.setAttribute('aria-hidden', 'true');
        visible.textContent = day.slice(0, 2);

        const srOnly = document.createElement('span');
        srOnly.classList.add('sr-only');
        srOnly.textContent = day;

        th.replaceChildren(visible, srOnly);
    }

    #create() {
        if (this.shadowRoot.querySelector('.grid-container')) return;

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');
        gridContainer.setAttribute('tabindex', '-1'); // Used to prevent focus from escaping when non-clickable items are clicked
        this.shadowRoot.appendChild(gridContainer);

        /* Create the date picker header with previous button, next button, year selection, and month selection */

        const datePickerHeader = document.createElement('div');
        datePickerHeader.classList.add('date-picker-header');

        // sr messages
        const srMessage = document.createElement('span');
        srMessage.classList.add('sr-only');
        srMessage.setAttribute('aria-live', 'polite');
        datePickerHeader.appendChild(srMessage);

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.classList.add('previous-month');
        prevButton.setAttribute('type', 'button');
        const svgPrev = CE.createSvgIcon(CHEVRON_LEFT_PATH);
        const prevButtonSR = document.createElement('span');
        prevButtonSR.textContent = 'Forrige';
        prevButtonSR.classList.add('sr-only');
        prevButton.appendChild(svgPrev);
        prevButton.appendChild(prevButtonSR);
        datePickerHeader.appendChild(prevButton);

        // Wrapper for month and year
        const monthYearWrapper = document.createElement('div');
        monthYearWrapper.classList.add('month-year-wrapper');

        // Select month
        const monthWrapper = document.createElement('div');
        monthWrapper.classList.add('month-wrapper');

        const monthSelect = document.createElement('select');
        monthSelect.setAttribute('name', 'month');
        monthSelect.setAttribute('aria-label', 'Måned');
        monthSelect.classList.add('selected-month');
        for (let i = 0; i < this.#MONTHS.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = this.#MONTHS[i].charAt(0).toUpperCase() + this.#MONTHS[i].slice(1);
            monthSelect.appendChild(option);
        }
        monthWrapper.appendChild(monthSelect);

        const svgArrow = CE.createSvgIcon(CHEVRON_DOWN_PATH);
        svgArrow.classList.add('select-arrow');
        monthWrapper.appendChild(svgArrow);

        monthYearWrapper.appendChild(monthWrapper);

        // Select year
        const yearWrapper = document.createElement('div');
        yearWrapper.classList.add('year-wrapper');

        const yearSelect = document.createElement('select');
        yearSelect.setAttribute('name', 'year');
        yearSelect.setAttribute('aria-label', 'År');
        yearSelect.classList.add('selected-year');
        yearWrapper.appendChild(yearSelect);

        const svgYearArrow = CE.createSvgIcon(CHEVRON_DOWN_PATH);
        svgYearArrow.classList.add('select-arrow');
        yearWrapper.appendChild(svgYearArrow);

        monthYearWrapper.appendChild(yearWrapper);

        datePickerHeader.appendChild(monthYearWrapper);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.classList.add('next-month');
        nextButton.setAttribute('type', 'button');
        const svgNext = CE.createSvgIcon(CHEVRON_RIGHT_PATH);
        const nextButtonSR = document.createElement('span');
        nextButtonSR.textContent = 'Næste';
        nextButtonSR.classList.add('sr-only');
        nextButton.appendChild(svgNext);
        nextButton.appendChild(nextButtonSR);
        datePickerHeader.appendChild(nextButton);

        gridContainer.appendChild(datePickerHeader);

        /* The grid with dates */

        if (this.hasAttribute('text-mindate')) { this.#textMinDate = this.getAttribute('text-mindate'); }
        if (this.hasAttribute('text-maxdate')) { this.#textMaxDate = this.getAttribute('text-maxdate'); }

        const grid = document.createElement('table');
        grid.setAttribute('role', 'grid');
        grid.classList.add('date-picker-grid');

        const gridHead = document.createElement('thead');
        const gridHeadRow = document.createElement('tr');
        for (let i = 0; i < this.#DAYS.length; i++) {
            const gridHeader = document.createElement('th');
            gridHeader.setAttribute('scope', 'col');
            this.#setDayHeader(gridHeader, this.#DAYS[i]);
            gridHeadRow.appendChild(gridHeader);
        }
        gridHead.appendChild(gridHeadRow);
        grid.appendChild(gridHead);

        const gridBody = document.createElement('tbody');
        for (let i = 0; i < this.#GRID_ROWS; i++) {
            const gridBodyRow = document.createElement('tr');
            for (let j = 0; j < this.#DAYS.length; j++) {
                const gridCell = document.createElement('td');
                gridBodyRow.appendChild(gridCell);
            }
            gridBody.appendChild(gridBodyRow);
        }
        grid.appendChild(gridBody);

        gridContainer.appendChild(grid);
    }

    #redraw(date, setFocus = false) {
        const gridContainer = this.shadowRoot.querySelector('.grid-container');
        const TODAY = new Date();
        TODAY.setHours(0, 0, 0, 0);

        if (!gridContainer) return;

        if (!Util.isValidDate(date)) {
            date = TODAY;
        }

        /* Check if any changes were made to minimum date or maximum date */

        let updatedMinMaxDates = false;

        if (this.#previousMinDate !== this.getAttribute('min-date') ||
            this.#previousMaxDate !== this.getAttribute('max-date') ||
            !Util.isValidDate(this.#correctedMinDate) ||
            !Util.isValidDate(this.#correctedMaxDate) ||
            this.#correctedMinDate > this.#correctedMaxDate) {

            this.#previousMinDate = this.getAttribute('min-date');
            this.#previousMaxDate = this.getAttribute('max-date');
            this.#correctedMinDate = Util.stringToDate(this.getAttribute('min-date'));
            this.#correctedMaxDate = Util.stringToDate(this.getAttribute('max-date'));

            if (!Util.isValidDate(this.#correctedMinDate)) { this.#correctedMinDate = this.#DEFAULT_MIN_DATE; }
            if (!Util.isValidDate(this.#correctedMaxDate)) { this.#correctedMaxDate = this.#DEFAULT_MAX_DATE; }

            // If the grid has another connected date picker grid, the min-date or max-date might need adjustment
            if (this.hasAttribute('start-date-id')) {
                const endDateGrid = document.querySelector(`[end-date-id="${this.getAttribute('start-date-id')}"]`);
                if (endDateGrid && endDateGrid.hasAttribute('selected-date')) {
                    const potentialMaxDate = Util.stringToDate(endDateGrid.getAttribute('selected-date'));
                    if (Util.isValidDate(potentialMaxDate) && potentialMaxDate < this.#correctedMaxDate) {
                        this.#correctedMaxDate = potentialMaxDate;
                    }
                }
            }
            else if (this.hasAttribute('end-date-id')) {
                const startDateGrid = document.querySelector(`[start-date-id="${this.getAttribute('end-date-id')}"]`);
                if (startDateGrid && startDateGrid.hasAttribute('selected-date')) {
                    const potentialMinDate = Util.stringToDate(startDateGrid.getAttribute('selected-date'));
                    if (Util.isValidDate(potentialMinDate) && this.#correctedMinDate < potentialMinDate) {
                        this.#correctedMinDate = potentialMinDate;
                    }
                }
            }

            if (this.#correctedMinDate > this.#correctedMaxDate) {
                this.#correctedMinDate = this.#correctedMaxDate;
            }

            updatedMinMaxDates = true;
        }

        /* Constrain the date to always be between the minimum date and maximum date */
        date = Util.constrainDate(this.#correctedMinDate, date, this.#correctedMaxDate);

        /* Changes to minimum date or maximum date can affect the selectable years
           and requires the select to be updated */

        if (updatedMinMaxDates) {
            let minYear = this.#correctedMinDate.getFullYear();
            let maxYear = this.#correctedMaxDate.getFullYear();
            const yearSelect = this.shadowRoot.querySelector('.selected-year');
            yearSelect.innerHTML = '';
            for (let i = minYear; i <= maxYear; i++) {
                yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
            }
        }
        const year = date.getFullYear();
        gridContainer.querySelector('.selected-year').value = date.getFullYear();

        /* Disable unselectable months */

        const monthSelect = this.shadowRoot.querySelector('.selected-month');
        const monthOptions = monthSelect.querySelectorAll('option');
        const chosenYear = this.shadowRoot.querySelector('.selected-year').value;

        for (let i = 0; i < monthOptions.length; i++) {
            monthOptions[i].removeAttribute('disabled'); // Reset disabled status on all options
        }
        if (this.#correctedMinDate.getFullYear() === parseInt(chosenYear, 10)) {
            const minMonth = this.#correctedMinDate.getMonth();
            for (let i = 0; i < monthOptions.length; i++) {
                if (i < minMonth) {
                    monthOptions[i].setAttribute('disabled', '');
                }
            }
        }
        if (this.#correctedMaxDate.getFullYear() === parseInt(chosenYear, 10)) {
            const maxMonth = this.#correctedMaxDate.getMonth();
            for (let i = 0; i < monthOptions.length; i++) {
                if (i > maxMonth) {
                    monthOptions[i].setAttribute('disabled', '');
                }
            }
        }
        const month = date.getMonth();
        gridContainer.querySelector('.selected-month').value = month;
        this.resizeMonth();

        /* Remove existing dates in the grid */

        // Prevent focusout event to trigger in fds-date-picker when tabindex is updated
        const activeElement = document.activeElement;
        const isDateCellFocused = activeElement && activeElement.tagName === 'TD' && activeElement.hasAttribute('data-date') && gridContainer.contains(activeElement);
        if (isDateCellFocused) {
            gridContainer.focus();
        }

        const gridcells = gridContainer.querySelectorAll('td');

        for (let i = 0; i < this.#TOTAL_GRIDCELLS; i++) {
            gridcells[i].setAttribute('tabindex', '-1');
            gridcells[i].removeAttribute('data-date');
            gridcells[i].removeAttribute('aria-label');
            gridcells[i].removeAttribute('aria-selected');
            gridcells[i].removeAttribute('aria-disabled');
            gridcells[i].removeAttribute('aria-current');
            gridcells[i].setAttribute('aria-hidden', 'true');
            gridcells[i].innerHTML = '';
        }

        /* Add new dates */

        const totalDays = Util.totalDaysInMonth(date);
        const offset = Util.getWeekday(Util.dateFromIntegers(year, month, 1));
        for (let i = 1; i <= totalDays; i++) {
            const gridcellDate = Util.dateFromIntegers(year, month, i);

            // Set the data-date attribute for each date cell
            gridcells[i + offset - 1].setAttribute('data-date', `${Util.ISOFormatFromDate(gridcellDate)}`);
            gridcells[i + offset - 1].removeAttribute('aria-hidden'); // Remove aria-hidden when the cell actually contains a date

            // Set the aria-label for each cell
            const ariaLabel = this.#CELL_DATE_FORMAT
                .replace('DAY', i)
                .replace('MONTH', this.#MONTHS[month])
                .replace('YEAR', year);
            gridcells[i + offset - 1].setAttribute('aria-label', ariaLabel);

            // If the cell is the minimum or maximum date, add additional info in the aria-label
            if (Util.datesAreEqual(gridcellDate, this.#correctedMinDate)) {
                const minAriaLabel = `${ariaLabel}, ${this.#textMinDate}`;
                gridcells[i + offset - 1].setAttribute('aria-label', minAriaLabel);
            }
            else if (Util.datesAreEqual(gridcellDate, this.#correctedMaxDate)) {
                const maxAriaLabel = `${ariaLabel}, ${this.#textMaxDate}`;
                gridcells[i + offset - 1].setAttribute('aria-label', maxAriaLabel);
            }

            if (Util.datesAreEqual(gridcellDate, TODAY)) {
                gridcells[i + offset - 1].setAttribute('aria-current', 'date');
            }

            // Set the content of each cell (a number from 1-31)
            gridcells[i + offset - 1].innerHTML = `${i}`;

            const dateIsBetweenMinAndMax = Util.isValidDate(this.#correctedMinDate) && Util.isValidDate(this.#correctedMaxDate) && this.#correctedMinDate <= gridcellDate && gridcellDate <= this.#correctedMaxDate;
            const dateIsGreaterThanMinNoMax = Util.isValidDate(this.#correctedMinDate) && !Util.isValidDate(this.#correctedMaxDate) && this.#correctedMinDate <= gridcellDate;
            const dateIsSmallerThanMaxNoMin = !Util.isValidDate(this.#correctedMinDate) && Util.isValidDate(this.#correctedMaxDate) && gridcellDate <= this.#correctedMaxDate;
            const noMinNoMax = !Util.isValidDate(this.#correctedMinDate) && !Util.isValidDate(this.#correctedMaxDate);

            if (dateIsBetweenMinAndMax || dateIsGreaterThanMinNoMax || dateIsSmallerThanMaxNoMin || noMinNoMax) {
                gridcells[i + offset - 1].setAttribute('aria-selected', `false`);
            }
            else {
                gridcells[i + offset - 1].setAttribute('aria-disabled', `true`);
            }
        }

        // If a date is selected and visible in the grid, ensure it is properly marked
        const selectedDate = this.getAttribute('selected-date');
        if (this.hasAttribute('selected-date') && Util.isValidDateStr(selectedDate)) {
            const selectedDateCell = gridContainer.querySelector(`[data-date="${selectedDate}"]`);
            // Disabled dates can not be selected
            if (selectedDateCell && !selectedDateCell.hasAttribute('aria-disabled')) {
                selectedDateCell?.setAttribute('aria-selected', 'true');
            }
        }

        // Ensure it is possible to tab to the date which caused the grid to be redrawn
        gridContainer.querySelector(`[data-date="${Util.ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');

        // Ensure previous and next month buttons have the proper disabled state
        const prevMonthButton = this.shadowRoot.querySelector('.previous-month');
        const nextMonthButton = this.shadowRoot.querySelector('.next-month');

        const visibleMinDate = this.shadowRoot.querySelector(`[data-date="${Util.ISOFormatFromDate(this.#correctedMinDate)}"]`);
        const visibleMaxDate = this.shadowRoot.querySelector(`[data-date="${Util.ISOFormatFromDate(this.#correctedMaxDate)}"]`);

        const focusedElement = this.shadowRoot?.activeElement ?? document.activeElement;

        if (visibleMinDate) {
            if (focusedElement.classList.contains('previous-month')) { this.focusFocusableDate(); }
            prevMonthButton.setAttribute('disabled', '');
        }
        else {
            prevMonthButton.removeAttribute('disabled');
        }

        if (visibleMaxDate) {
            if (focusedElement.classList.contains('next-month')) { this.focusFocusableDate(); }
            nextMonthButton.setAttribute('disabled', '');
        }
        else {
            nextMonthButton.removeAttribute('disabled');
        }

        // If wanted, set focus on the date causing the redraw unless the grid is hidden or the focus is on the date input field
        const isDisplayed = this.offsetParent;
        if (setFocus && isDisplayed && document.activeElement.tagName !== 'INPUT') {
            this.focusFocusableDate();
        }
    }

    #selectChange(event) {
        const focusedDay = this.shadowRoot.querySelector('td[data-date][tabindex="0"]');
        const focusedDayAsDate = Util.stringToDate(focusedDay.getAttribute('data-date'));

        let day = focusedDayAsDate.getDate();
        let month = parseInt(this.shadowRoot.querySelector('.selected-month').value, 10);
        let year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);

        if (event.target === this.shadowRoot.querySelector('.selected-month')) {
            month = parseInt(event.target.value, 10);
        }
        else if (event.target === this.shadowRoot.querySelector('.selected-year')) {
            year = parseInt(event.target.value, 10);
        }

        const daysInNewMonth = Util.totalDaysInMonth(Util.dateFromIntegers(year, month, 1));
        if (daysInNewMonth < day) {
            day = daysInNewMonth;
        }

        const newDate = Util.dateFromIntegers(year, month, day);
        this.#redraw(newDate, false);
        event.target.focus();
    }

    #monthButtonClicked(event) {
        const focusedDay = this.shadowRoot.querySelector('td[data-date][tabindex="0"]');
        const focusedDayAsDate = Util.stringToDate(focusedDay.getAttribute('data-date'));
        let prevMonth = Util.getPrevMonth(focusedDayAsDate);
        let nextMonth = Util.getNextMonth(focusedDayAsDate);

        if (event.target === this.shadowRoot.querySelector('.previous-month')) {
            this.#redraw(prevMonth, false);
            if (event.target.getAttribute('disabled') !== null) {
                this.shadowRoot.querySelector('.sr-only').textContent = '';
                // Focus the earliest selectable date for proper sr announcement
                this.shadowRoot.querySelector('td[tabindex="0"]')?.setAttribute('tabindex', '-1');
                this.shadowRoot.querySelector('td[aria-selected]')?.setAttribute('tabindex', '0');
                this.focusFocusableDate();
            }
        }
        else if (event.target === this.shadowRoot.querySelector('.next-month')) {
            this.#redraw(nextMonth, false);
            if (event.target.getAttribute('disabled') !== null) {
                this.shadowRoot.querySelector('.sr-only').textContent = '';
                // Focus the last selectable date for proper sr announcement
                this.shadowRoot.querySelector('td[tabindex="0"]')?.setAttribute('tabindex', '-1');
                const tds = this.shadowRoot.querySelectorAll('td[aria-selected]');
                tds[tds.length - 1]?.setAttribute('tabindex', '0');
                this.focusFocusableDate();
            }
        }

        if (event.target.getAttribute('disabled') === null) {
            // Update screen reader message so the new month (and year) is announced
            const month = this.#MONTHS[parseInt(this.shadowRoot.querySelector('.selected-month').value, 10)];
            const year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);
            this.shadowRoot.querySelector('.sr-only').textContent = `${month} ${year}`;
        }
    }

    #dateClicked(event) {
        if (event.currentTarget.hasAttribute('data-date') && !event.currentTarget.hasAttribute('aria-disabled')) {
            this.setAttribute('selected-date', event.currentTarget.getAttribute('data-date'));
            this.dispatchEvent(new Event('date-clicked'));
        }
    }

    #updateTextDays(str) {
        const newDays = str.split(" ");
        if (newDays.length === 7) {
            this.#DAYS = newDays;
            const tableHeaders = this.shadowRoot.querySelectorAll('th');
            for (let i = 0; i < tableHeaders.length; i++) {
                this.#setDayHeader(tableHeaders[i], this.#DAYS[i]);
            }
        }
    }

    #updateTextMonths(str) {
        const newMonths = str.split(" ");
        if (newMonths.length === 12) {
            this.#MONTHS = newMonths;

            const header = this.shadowRoot.querySelector('.date-picker-header');
            if (header && header.querySelector('.sr-only')) {
                header.querySelector('.sr-only').textContent = '';
            }

            const monthOptions = this.shadowRoot.querySelectorAll('.selected-month option');
            for (let i = 0; i < monthOptions.length; i++) {
                monthOptions[i].textContent = this.#MONTHS[i].charAt(0).toUpperCase() + this.#MONTHS[i].slice(1);
            }

            this.resizeMonth();
        }
    }

    #updateTextPrevButton(str) {
        if (this.shadowRoot.querySelector('.previous-month')) {
            this.shadowRoot.querySelector('.previous-month .sr-only').textContent = str;
        }
    }

    #updateTextNextButton(str) {
        if (this.shadowRoot.querySelector('.next-month')) {
            this.shadowRoot.querySelector('.next-month .sr-only').textContent = str;
        }
    }

    #updateTextDateAnnouncement(str) {
        // Check that string contains exactly one "DAY", one "MONTH", and one "YEAR" substring
        const dayCount = (str.match(/DAY/g) || []).length;
        const monthCount = (str.match(/MONTH/g) || []).length;
        const yearCount = (str.match(/YEAR/g) || []).length;

        if (dayCount === 1 && monthCount === 1 && yearCount === 1) {
            this.#CELL_DATE_FORMAT = str;
        }
    }

    #addEventListeners() {
        this.shadowRoot.querySelector('.grid-container').addEventListener('keydown', this.#handleKeydown, false);
        this.shadowRoot.querySelector('.selected-month').addEventListener('change', this.#handleChangeMonth, false);
        this.shadowRoot.querySelector('.selected-year').addEventListener('change', this.#handleChangeYear, false);
        this.shadowRoot.querySelector('.previous-month').addEventListener('click', this.#handlePrevMonth, false);
        this.shadowRoot.querySelector('.next-month').addEventListener('click', this.#handleNextMonth, false);

        // Event listener added to each cell for proper iOS VoiceOver support
        this.shadowRoot.querySelectorAll('td').forEach(td => td.addEventListener('click', this.#handleDateClick, false));
    }

    #removeEventListeners() {
        this.shadowRoot.querySelector('.grid-container').removeEventListener('keydown', this.#handleKeydown, false);
        this.shadowRoot.querySelector('.selected-month').removeEventListener('change', this.#handleChangeMonth, false);
        this.shadowRoot.querySelector('.selected-year').removeEventListener('change', this.#handleChangeYear, false);
        this.shadowRoot.querySelector('.previous-month').removeEventListener('click', this.#handlePrevMonth, false);
        this.shadowRoot.querySelector('.next-month').removeEventListener('click', this.#handleNextMonth, false);
        this.shadowRoot.querySelectorAll('td').forEach(td => td.removeEventListener('click', this.#handleDateClick, false));
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.#TOTAL_GRIDCELLS = this.#GRID_ROWS * this.#DAYS.length;
        this.#CELL_DATE_FORMAT = 'DAY. MONTH YEAR';
        this.#textMinDate = 'tidligste valgbare dato';
        this.#textMaxDate = 'seneste valgbare dato';

        this.#DEFAULT_MIN_DATE = new Date();
        this.#DEFAULT_MIN_DATE.setHours(0, 0, 0, 0);
        this.#DEFAULT_MAX_DATE = new Date(this.#DEFAULT_MIN_DATE);
        this.#DEFAULT_MAX_DATE.setFullYear(this.#DEFAULT_MIN_DATE.getFullYear() + 10);

        this.#previousMinDate = 0;
        this.#previousMaxDate = 0;
        this.#correctedMinDate = null;
        this.#correctedMaxDate = null;

        this.#hasDatePickerConnection = false;
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    forceCompleteRedraw(date, setFocus = false) {
        this.#previousMaxDate = 0; // Force update of select element with possible years
        this.#redraw(date, setFocus);
    }

    setHasDatePickerConnection(val) {
        this.#hasDatePickerConnection = val;
    }

    getHasDatePickerConnection() {
        return this.#hasDatePickerConnection;
    }

    focusFocusableDate() {
        this.shadowRoot.querySelector('td[tabindex="0"]')?.focus();
    }

    resizeMonth() {
        const monthSelect = this.shadowRoot.querySelector('.selected-month');
        if (!monthSelect) return;

        const ROOT_FONT_SIZE = 10;   // px, result of the 62.5% trick
        const ARROW_OFFSET_PX = 24;  // px, is converted to rem
        const PADDING_PX = 8;        // px, kept as pixels

        const selectedOption = monthSelect.options?.[monthSelect.selectedIndex];
        if (!selectedOption) return;

        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.fontFamily = '"IBM Plex Sans", "system-ui", system, sans-serif';
        tempSpan.style.fontSize = '16px';
        tempSpan.style.lineHeight = '1.5';
        tempSpan.style.fontWeight = '600';
        tempSpan.textContent = selectedOption.text;

        this.shadowRoot.appendChild(tempSpan);
        if (tempSpan.offsetWidth > 0) {
            const remWidth = tempSpan.offsetWidth / ROOT_FONT_SIZE;
            monthSelect.style.width = `calc(${remWidth}rem + ${PADDING_PX + ARROW_OFFSET_PX}px)`;
        }
        this.shadowRoot.removeChild(tempSpan);
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (this.#initialized) return;

        if (this.hasAttribute('text-days')) { this.#updateTextDays(this.getAttribute('text-days')); }
        if (this.hasAttribute('text-months')) { this.#updateTextMonths(this.getAttribute('text-months')); }
        if (this.hasAttribute('text-date-announcement')) { this.#updateTextDateAnnouncement(this.getAttribute('text-date-announcement')) }

        this.#init();

        if (this.hasAttribute('text-prevbutton')) { this.#updateTextPrevButton(this.getAttribute('text-prevbutton')); }
        if (this.hasAttribute('text-nextbutton')) { this.#updateTextNextButton(this.getAttribute('text-nextbutton')); }

        // If the date picker is part of a "duo" defining start date and end date, add event listeners when both grids exist
        const isStartDate = this.hasAttribute('start-date-id');
        const isEndDate = this.hasAttribute('end-date-id');

        const startDateGrid = document.querySelector(`[start-date-id="${this.getAttribute('end-date-id')}"]`);
        const endDateGrid = document.querySelector(`[end-date-id="${this.getAttribute('start-date-id')}"]`);

        if (isStartDate && endDateGrid) {
            customElements.whenDefined('fds-date-picker-grid').then(() => {
                if (!this.getHasDatePickerConnection() && !endDateGrid?.getHasDatePickerConnection()) {
                    this.#linkedGrid = endDateGrid;

                    this.addEventListener('date-selected', this.#handleRedrawLinkedGrid);
                    endDateGrid.addEventListener('date-selected', this.#handleRedrawSelf);

                    this.setHasDatePickerConnection(true);
                    endDateGrid.setHasDatePickerConnection(true);
                }
            });
        }
        else if (isEndDate && startDateGrid) {
            customElements.whenDefined('fds-date-picker-grid').then(() => {
                if (!this.getHasDatePickerConnection() && !startDateGrid?.getHasDatePickerConnection()) {
                    this.#linkedGrid = startDateGrid;

                    startDateGrid.addEventListener('date-selected', this.#handleRedrawSelf);
                    this.addEventListener('date-selected', this.#handleRedrawLinkedGrid);

                    startDateGrid.setHasDatePickerConnection(true);
                    this.setHasDatePickerConnection(true);
                }
            });
        }

        // Resize again on load - the font may initially be missing, when the width of the month <select> is calculated
        const onLoad = () => {
            this.resizeMonth();
            window.removeEventListener('load', onLoad);
        };
        window.addEventListener('load', onLoad);
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();

        this.removeEventListener('date-selected', this.#handleRedrawLinkedGrid);
        this.#linkedGrid?.removeEventListener('date-selected', this.#handleRedrawSelf);
        this.#linkedGrid = null;

        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        let redrawNeeded = false;

        switch (attribute) {
            case 'selected-date': {
                const date = Util.stringToDate(newValue);
                const setFocusOnDate = true;
                if (Util.isValidDate(date)) {
                    this.#redraw(date, setFocusOnDate);
                }
                else {
                    // An invalid date might be temporary while the user enters a date in the fds-date-picker's input field
                    // Keep displaying the previous dates to give a more "steady" experience with no rapid updates
                    const dateWithCurrentFocus = this.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
                    this.#redraw(Util.stringToDate(dateWithCurrentFocus), setFocusOnDate);
                }
                this.dispatchEvent(new Event('date-selected'));
                break;
            }
            case 'min-date':
            case 'max-date':
                redrawNeeded = true;
                break;

            case 'text-days':
                this.#updateTextDays(newValue);
                break;

            case 'text-months':
                this.#updateTextMonths(newValue);
                break;

            case 'text-prevbutton':
                this.#updateTextPrevButton(newValue);
                break;

            case 'text-nextbutton':
                this.#updateTextNextButton(newValue);
                break;

            case 'text-date-announcement':
                this.#updateTextDateAnnouncement(newValue);
                break;

            case 'text-mindate':
                this.#textMinDate = newValue;
                redrawNeeded = true;
                break;

            case 'text-maxdate':
                this.#textMaxDate = newValue;
                redrawNeeded = true;
                break;
        }

        if (redrawNeeded) {
            const dateWithCurrentFocus = this.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
            let placeFocusOnDate = Util.stringToDate(dateWithCurrentFocus);
            if (!Util.isValidDate(placeFocusOnDate)) {
                placeFocusOnDate = new Date();
            }
            this.#redraw(placeFocusOnDate, true);
        }
    }

    // #endregion
}

function registerDatePickerGrid() {
    if (customElements.get('fds-date-picker-grid') === undefined) {
        window.customElements.define('fds-date-picker-grid', FDSDatePickerGrid);
    }
}

export default registerDatePickerGrid;
