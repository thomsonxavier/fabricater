/* ==============================================================================
Index
----------------------------------------
01 - Imports
02 - 
03 - 
04 - 
05 -
06 -
07 -
08 -
09 -
============================================================================== */

/* 01 - Imports */
// global elements
import { Switch, switchINIT } from "./elements/toggles/switch"; // Switch
import { ToggleSwitch, toggleINIT } from "./elements/toggles/toggleswitch"; // Toggle
import { RangeSlider, rangeSliderINIT } from "./elements/inputs/rangeslider"; // Input Rangeslider

//toolkit elements
import { vtoggle__switch } from "./elements/toggles/verticalToggle";
import { searchfield__toggles, headerSearch } from "./elements/search/searchfield";

// global components
import { Dropdown, dropdownComponent } from "./components/layout/dropdown"; // Dropdown
import { Tabs, tabsComponent } from "./components/layout/tabs"; //Tabs
import { Collapse, collapseComponent } from "./components/layout/accordion"; //Accordion / Collapse
import {
    Slideinpanel,
    slideinpanelINIT,
} from "./components/layout/slideinpanel";
import { Flyout, flyoutComponent } from "./components/layout/flyout"; //Flyout
import { Tooltip, tooltipFunc } from "./components/layout/tooltip"; //Tooltip
import { Popover, popoverFunc } from "./components/layout/popover"; //Popover
import { Carousel, carouselINIT } from "./components/layout/carousel"; //Carousel
import { Modal, modalComponent } from "./components/modals/modal"; //Modal
import { Adcarousel, adCarouselINIT } from "./components/layout/adcarousel"; //Carousel - 2
import {
    ComboboxAutocomplete,
    comboboxINIT,
} from "./components/layout/comboBox"; //Combobox
import { Combomenu, initializeCombomenu } from "./components/layout/combomenu";
import { cyclicCarouselINIT } from "./components/layout/cyclic-carousel";

// toolkit components
import { myspValueProposition } from "./components/miscellaneous/tree-chart";
import { themeToggle, themeSwitch } from "./components/miscellaneous/themetoggle";
import { animateWhenInView } from "./components/miscellaneous/animation";
import { arcRmCarouselINIT } from "./components/miscellaneous/arc-rmcarousel";
import { arcTlCarouselINIT } from "./components/miscellaneous/arc-tlcarousel";
import { arcCarouselINIT } from "./components/miscellaneous/arc-carousel";
import { globalDropdownINIT, GlobalDropdown } from "./components/layout/global-dropdown"; // Dropdown
import { resizeFunc } from "./components/layout/resize";
import { privacyScroll } from "./components/privacy/privacy-scroll";
import { onLoadModal } from "./components/modals/onLoadModal";
import { TableFun } from "./components/layout/table";

//02- Function calls
// call global/common elements
toggleINIT();
rangeSliderINIT();
switchINIT();

// call toolkit/app relevant elements here
vtoggle__switch();
searchfield__toggles();

// call global/common components
dropdownComponent();
tooltipFunc();
tabsComponent();
carouselINIT();
slideinpanelINIT();
adCarouselINIT();
modalComponent();
collapseComponent();
popoverFunc();
flyoutComponent();
comboboxINIT();
initializeCombomenu();

// app relevant components
myspValueProposition();
//themeToggle();
themeSwitch();
// animateWhenInView();
// animateWhenInView();
arcCarouselINIT();
arcRmCarouselINIT();
arcTlCarouselINIT();
cyclicCarouselINIT();

globalDropdownINIT();
headerSearch();
resizeFunc();
privacyScroll();
onLoadModal();
TableFun();

export default {};
