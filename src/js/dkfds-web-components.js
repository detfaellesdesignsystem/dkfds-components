'use strict';

// Web Components
import registerAccordion from './web-components/accordion/fds-accordion';
import registerAccordionGroup from './web-components/accordion/fds-accordion-group';
import registerInput from './web-components/input/fds-input';
import registerHelpText from './web-components/help-text/fds-help-text';
import registerCharacterLimit from './web-components/character-limit/fds-character-limit';
import registerErrorMessage from './web-components/error-message/fds-error-message';
import registerCheckbox from './web-components/checkbox/fds-checkbox';
import registerCheckboxGroup from './web-components/checkbox/fds-checkbox-group';
import registerRadioButton from './web-components/radio-button/fds-radio-button';
import registerRadioButtonGroup from './web-components/radio-button/fds-radio-button-group';
import registerDateInput from './web-components/date-input/fds-date-input';
import registerSelect from './web-components/select/fds-select';
import registerDatePicker from './web-components/date-picker/fds-date-picker';
import registerDatePickerGrid from './web-components/date-picker/fds-date-picker-grid';
import registerTextarea from './web-components/textarea/fds-textarea';
import registerErrorSummary from './web-components/error-summary/fds-error-summary';
import registerInputAffix from './web-components/input-affix/input-affix';
import registerPortalInfo from './web-components/header/fds-portal-info';
import registerSolutionInfo from './web-components/header/fds-solution-info';
import registerDropdownMenu from './web-components/dropdown-menu/fds-dropdown-menu';
import registerMainMenu from './web-components/header/fds-main-menu';
import registerTooltip from './web-components/tooltip/fds-tooltip';
import registerTooltipIcon from './web-components/tooltip/fds-tooltip-icon';
import registerToggleSwitch from './web-components/toggle-switch/fds-toggle-switch';
import registerModalOpener from './web-components/modal/fds-modal-opener';
import registerModalCloser from './web-components/modal/fds-modal-closer';
import registerModal from './web-components/modal/fds-modal';
import registerTab from './web-components/tabs/fds-tab';
import registerTabPanel from './web-components/tabs/fds-tab-panel';
import registerTabs from './web-components/tabs/fds-tabs';
import registerAlert from './web-components/alert/fds-alert';
import registerMultiselect from './web-components/multiselect/fds-multiselect';
import registerMultiselectOpener from './web-components/multiselect/fds-multiselect-opener';
import registerMultiselectSelectAll from './web-components/multiselect/fds-multiselect-select-all';
import registerMultiselectOptions from './web-components/multiselect/fds-multiselect-options';
import registerMultiselectOption from './web-components/multiselect/fds-multiselect-option';
import registerMultiselectDialog from './web-components/multiselect/fds-multiselect-dialog';

const registerCustomElements = () => {
    registerAccordion();
    registerAccordionGroup();
    registerInput();
    registerHelpText();
    registerCharacterLimit();
    registerErrorMessage();
    registerCheckbox();
    registerCheckboxGroup();
    registerRadioButton();
    registerRadioButtonGroup();
    registerDateInput();
    registerSelect();
    registerDatePicker();
    registerDatePickerGrid();
    registerTextarea();
    registerErrorSummary();
    registerInputAffix();
    registerPortalInfo();
    registerSolutionInfo();
    registerDropdownMenu();
    registerMainMenu();
    registerTooltip();
    registerTooltipIcon();
    registerToggleSwitch();
    registerModalOpener();
    registerModalCloser();
    registerModal();
    registerTab();
    registerTabPanel();
    registerTabs();
    registerAlert();
    registerMultiselectOption();
    registerMultiselectSelectAll();
    registerMultiselectOptions();
    registerMultiselectOpener();
    registerMultiselectDialog();
    registerMultiselect();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerCustomElements);
} 
else {
    registerCustomElements();
}

export { registerCustomElements, registerAccordion, registerAccordionGroup, registerInput, registerHelpText, registerCharacterLimit, registerErrorMessage, registerCheckbox, registerCheckboxGroup, registerRadioButton, registerRadioButtonGroup, registerDateInput, registerSelect, registerDatePicker, registerDatePickerGrid, registerTextarea, registerErrorSummary, registerInputAffix, registerPortalInfo, registerSolutionInfo, registerDropdownMenu, registerMainMenu, registerTooltip, registerTooltipIcon, registerToggleSwitch, registerModalOpener, registerModalCloser, registerModal, registerTab, registerTabPanel, registerTabs, registerAlert, registerMultiselect, registerMultiselectSelectAll, registerMultiselectOpener, registerMultiselectDialog, registerMultiselectOptions, registerMultiselectOption };