/* ==============================================================================
Index
----------------------------------------
01 - Imports
02 - Exports
03 - Function calls
04 - 
05 -
06 -
07 -
08 -
09 -
============================================================================== */

/* 01 - imports */
// utils
import * as utilities from "./utils/utilities";

// elements
import { Switch, switchINIT } from "./elements/toggles/switch"; // Switch
import { ToggleSwitch, toggleINIT } from "./elements/toggles/toggleswitch"; // Toggle
import { RangeSlider, rangeSliderINIT } from "./elements/inputs/rangeslider"; // Input Rangeslider

// components
import { Dropdown , dropdownComponent} from './components/layout/dropdown'; // Dropdown
import { Tabs, tabsComponent } from "./components/layout/tabs"; //Tabs
import { Collapse, collapseComponent } from "./components/layout/accordion"; //Accordion / Collapse
import { Slideinpanel, slideinpanelINIT } from "./components/layout/slideinpanel";
import { Flyout, flyoutComponent } from "./components/layout/flyout"; //Flyout
import { Tooltip, tooltipFunc } from "./components/layout/tooltip"; //Tooltip
import { Popover, popoverFunc } from "./components/layout/popover"; //Popover
import { Carousel, carouselINIT } from "./components/layout/carousel"; //Carousel
import { Modal, modalComponent } from "./components/modals/modal"; //Modal
import { Adcarousel, adCarouselINIT } from "./components/layout/adcarousel"; //Carousel - 2
import { ComboboxAutocomplete, comboboxINIT } from "./components/layout/comboBox"; //Combobox
import { CyclicCarousel, cyclicCarouselINIT } from "./components/layout/cyclic-carousel";
import { Combomenu, initializeCombomenu } from "./components/layout/combomenu";
import { globalDropdownINIT, GlobalDropdown } from "./components/layout/global-dropdown"; // Dropdown
// import { workFlowCarouselINIT} from "./components/landing/workflow-carousel";

// Add app relevant element and component imports here
//elements

//components

/*02-Exports*/

export default {
    // utils
    utilities, // NOTE: to use a utility function - pf_fed.utilities.FUNCTION_NAME()

    //common elements
    Switch, switchINIT,
    ToggleSwitch, toggleINIT,
    RangeSlider, rangeSliderINIT,

    //common components
    Dropdown, dropdownComponent,
    Tabs, tabsComponent,
    Collapse, collapseComponent,
    Slideinpanel, slideinpanelINIT,
    Flyout, flyoutComponent,
    Tooltip, tooltipFunc,
    Popover, popoverFunc,
    Carousel, carouselINIT,
    Modal, modalComponent,
    Adcarousel, adCarouselINIT,
    ComboboxAutocomplete, comboboxINIT,
    CyclicCarousel, cyclicCarouselINIT,
    Combomenu, initializeCombomenu,
    GlobalDropdown,globalDropdownINIT,
    // workFlowCarouselINIT

    //app relevant elements

    //app relevant components
}
