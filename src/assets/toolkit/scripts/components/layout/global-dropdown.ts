/* Dropdown */

import * as Popper from '@popperjs/core';

import {
    isElementDisabled,
} from '../../utils/utilities';
import Context from '../../utils/context';
import BaseClass from '../../utils/base-class';
import { Placement } from '../../utils/popper-definitions';

const COMPONENT_KEY: string = 'global-dropdown';
const OPEN_CLASS: string = '-open';

export class GlobalDropdown extends BaseClass {
    _parent: HTMLElement;
    _dropdown: any;
    _firstMenuitem: boolean;
    _lastMenuitem: boolean;
    _popper: any;
    _selectableOptions: HTMLElement[];
    _portal: string;
    _portalEl: HTMLElement
    _handleOutSideClick: boolean = true;
    _showOverlay: boolean = false;

    _watchClick_var: EventListener = this._watchClickOutside.bind(this);
    _itemClickEvHandler: EventListener = this._itemClickHandler.bind(this);
    _dropdownToggleEvHandler: EventListener = this._dropdownToggle.bind(this);
    _dropdownRefreshEv: EventListener = this._refreshDropdown.bind(this);
    _menuKeyHandlerEv = this._menuKeyHandler.bind(this);
    _updatePopperPosHandler: EventListener = this._updatePopperPos.bind(this);


    constructor(element: HTMLElement) {
        super(element);

        this._parent = this._element.closest('.c-global-dropdown');
        this._dropdown = this._getDropdownElement();
        this._firstMenuitem = false;
        this._lastMenuitem = false;
        this._popper = null;
        this._selectableOptions = [].slice.call(this._dropdown.querySelectorAll('.-dismiss-dropdown, a.c-global-dropdown-item:not(:disabled):not(.disabled), button.c-global-dropdown-item:not(:disabled):not(.disabled), .-selectable.c-global-dropdown-item:not(label):not(:disabled):not(.disabled)')) || [];
        this._portal = this._parent.getAttribute('[data-portal-target]') || 'body';
        this._portalEl = document.querySelector(this._portal);

        if (this._parent.getAttribute('data-handle-outsideclick') === "false")
            this._handleOutSideClick = false;

        if (this._parent.getAttribute('data-overlay') === "true")
            this._showOverlay = true;

        if (this._parent && this._dropdown) this._init();
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init() {
        this._dropdown = this._getDropdownElement();
        this._element.setAttribute('aria-haspopup', 'true');

        this._element.addEventListener('click', this._dropdownToggleEvHandler);
        this._selectableOptions.forEach((item: any) => {
            item.addEventListener('click', this._itemClickEvHandler);
        })
        this._element.addEventListener('keydown', this._menuKeyHandlerEv);
        this._dropdown.addEventListener('keydown', this._menuKeyHandlerEv);
        this._parent.addEventListener('hide.dropdown', this._dropdownToggleEvHandler);
        this._parent.addEventListener('data.refreshed', this._dropdownRefreshEv);

        this._portalEl.appendChild(this._dropdown);
    }

    // 1.2 - Destroy object instance and remove eventlisteners
    _dispose() {
        this._dropdown = null;

        if (this._popper) {
            this._popper.destroy();
            this._popper = null;
        }

        this._element.removeEventListener('click', this._dropdownToggleEvHandler);
        this._element.removeEventListener('keydown', this._menuKeyHandlerEv);
        this._dropdown.removeEventListener('keydown', this._menuKeyHandlerEv);
        this._selectableOptions.forEach((item: any) => {
            item.removeEventListener('click', this._itemClickEvHandler);
        })
        this._parent.removeEventListener('hide.dropdown', this._dropdownToggleEvHandler);
        this._parent.removeEventListener('data.refreshed', this._dropdownRefreshEv);

        super.dispose();
    }

    // 2.1 - Show dropdown
    _show() {
        if (this._isDisabled()) return;

        this._element.setAttribute('aria-expanded', 'true');
        this._parent.classList.add(OPEN_CLASS);
        this._element.focus({ preventScroll: true, focusVisible: true });

        this._dropdown.classList.add("-show");

        // fire showing event
        this._parent.dispatchEvent(new Event('data.dropdown.showing', { bubbles: true }));

        if (typeof Popper === 'undefined') {
            throw new TypeError('Dropmenu require Popper (https://popper.js.org)');
        }

        // positioning the dropmenu using popper utility
        // const isPlacementRight = this._parent.classList.contains('-right');
        const isPlacementStatic = this._parent.classList.contains('-static');
        const isPositionFixed = this._parent.classList.contains('-body');
        const placement: Placement = this._parent.getAttribute('data-placement') as Placement ?? 'bottom-start';

        this._popper = Popper.createPopper(this._element, this._dropdown, {
            placement: placement,
            strategy: isPositionFixed ? 'fixed' : 'absolute',
            modifiers: [
                { name: 'preventOverflow', options: { altAxis: true, boundary: 'clippingParents' } },
                { name: 'flip', options: { fallbackPlacements: this._returnFallBackPlacement(placement) } },
                { name: 'offset', options: { offset: [0, 0] } },
                { name: 'applyStyles', enabled: !isPlacementStatic }
            ]
        });

        if (placement !== 'bottom-start') this._popper.forceUpdate();

        // fire shown event
        this._parent.dispatchEvent(new Event('data.dropdown.shown', { bubbles: true }));

        this._refreshDropdown();

        if (!this._handleOutSideClick) {
            document.body.addEventListener("click", this._updatePopperPosHandler)
        }
        else if (this._showOverlay) this._dropdown.classList.add("-overlay")
        else document.addEventListener("click", this._watchClick_var, true);
    }

    /**
     * 2.2 - Hide dropdown (Sets focus back to _element by default unless specified otherwise)
     * @param flag : boolean
     */
    _hide(flag: boolean = true) {
        if (this._isDisabled()) return;

        this._dropdown.classList.remove("-show", "-overlay");

        if (this._isOpen()) {
            this._element.setAttribute('aria-expanded', 'false');
            this._parent.classList.remove(OPEN_CLASS);

            // fire closing event
            this._parent.dispatchEvent(new Event('data.dropdown.closing', { bubbles: true }));

            // destroy popper instance
            if (this._popper) this._popper.destroy();

            flag && this._element.focus({ preventScroll: true, focusVisible: true });
        }

        this._setActiveDescendent('');

        if (!this._handleOutSideClick) {
            document.body.removeEventListener("click", this._updatePopperPosHandler)
        }
        else if (this._showOverlay) this._dropdown.classList.remove("-overlay")
        else document.removeEventListener("click", this._watchClick_var, true);

        // fire closed event
        this._parent.dispatchEvent(new Event('data.dropdown.closed', { bubbles: true }));
    }

    // 2.3 - Toggle show and hide
    toggle() {
        if (this._isDisabled()) return;

        if (this._isOpen()) {
            this._hide();
        } else {
            this._show();
        }
    }

    /**
     * 3.1 - While dropdown is open, watch for clicks outside of it and close the dropdown. (Focus isn't set back to _element)
     * @param event : Event
     */
    _watchClickOutside(event: Event) {
        // console.log(event, event.target, this._dropdown, this)
        if ((event.target != this._element) && (event.target != this._dropdown) && !this._dropdown.contains(event.target)) {
            this._hide(false);
        }
    }

    /**
     * 3.2 - Handle keyboard actions on the dropdown
     * @param event 
     */
    _menuKeyHandler(event: KeyboardEvent) {
        const isActive: any = this._isOpen();

        if (!(event.key === 'Tab' || event.key === 'Escape' || event.key === 'Enter' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Space' || event.key === ' ')) return;
        if (isActive && (event.key === 'Space' || event.key === ' ')) return;

        const menuitemsPreFilter = [].slice.call(this._dropdown.querySelectorAll('a, input, button, .-selectable')) || [];
        const menuitems = [].filter.call(menuitemsPreFilter, function (el: HTMLElement) {
            return (!!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && !el.hasAttribute('disabled') && el.ariaDisabled !== 'true' && !el.classList.contains('.disabled'))
        });

        if (!isActive && event.key === 'Tab') return;

        if (isActive && event.key === 'Tab') {
            this._hide(false);
            return;
        }

        if ((event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (this._isDisabled()) {
            return;
        }

        if (event.key === 'Escape') {
            this._hide();
            return;
        }
        if (!isActive && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ')) { //event.key === 'Enter'
            this._show();
            if (!menuitems.length) return;
            (event.key === 'ArrowUp') ? menuitems[menuitems.length - 1].focus() : menuitems[0].focus();
            return;
        }

        if (event.key === 'Enter') {
            return;
        }

        // if (isActive && (event.key === 'Enter' && event.target === this._element) || (event.key === 'Tab')) {
        //   this._hide();
        //   return;
        // }

        if (isActive && (event.key === 'ArrowDown')) {
            menuitems[0].focus();
        }
        if (!menuitems.length) return;

        let targetEl: any = event.target;
        let menuitemIndex = menuitems.indexOf(targetEl);

        if (event.key === 'ArrowUp') menuitemIndex--;

        if (event.key === 'ArrowDown') menuitemIndex++;

        menuitemIndex = (event.key === 'ArrowUp' && menuitemIndex < 0) ? menuitems.length - 1 : menuitemIndex;

        menuitemIndex = (event.key === 'ArrowDown' && menuitemIndex > menuitems.length - 1) ? 0 : menuitemIndex;

        menuitems[menuitemIndex].focus();
        menuitems[menuitemIndex].id && this._setActiveDescendent(menuitems[menuitemIndex].id);
    }

    /**
    * 3.3 - Method to call toggle via js (bound to hide.dropdown event)
    * @param event : Event
    */
    _dropdownToggle(event: Event) {
        event.preventDefault();
        this.toggle();
    }

    // 3.4
    _refreshDropdown() {
        this._selectableOptions.forEach((item: any) => {
            item.removeEventListener('click', this._itemClickEvHandler);
        })

        this._selectableOptions = [].slice.call(this._dropdown.querySelectorAll('.-dismiss-dropdown, a.c-global-dropdown-item:not(:disabled):not(.disabled), button.c-global-dropdown-item:not(:disabled):not(.disabled), .-selectable.c-global-dropdown-item:not(label):not(:disabled):not(.disabled)')) || [];
        this._selectableOptions.forEach((item: any) => {
            item.addEventListener('click', this._itemClickEvHandler);
        })
    }

    /**
     * 3.5 - Close dropdown when an option is selected (checkbox, label, radio elements, input fields are exempt)
     * @param event : Event
     */
    _itemClickHandler(event: any) {
        if ((event.currentTarget.tagName == 'A' || event.currentTarget.tagName == 'BUTTON') && (!event.currentTarget.classList.contains('-donot-dismiss')) && this._isOpen()) {
            this._hide();
        }
    }

    // 4.1 - Set aria-activedescendant to the dropdown control when a child receives keyboard focus
    _setActiveDescendent(id: string) {
        this._element.setAttribute('aria-activedescendant', `${id}`);
    }

    // Utils
    _getDropdownElement() {
        //   if (!this._parent) return null;
        return document.querySelector('#global-dropdown') || null;
    }

    _returnFallBackPlacement(placement: Placement): Placement[] {
        let result: Placement[] = [];
        switch (placement) {
            case 'bottom-start':
                result = ['top-start', 'bottom-start'];
                break;
            case 'bottom-end':
                result = ['top-end', 'bottom-end'];
                break;
            case 'bottom':
                result = ['top'];
                break;
            case 'top-start':
                result = ['bottom-start', 'top-start'];
                break;
            case 'top-end':
                result = ['bottom-end', 'top-end'];
                break;
            case 'top':
                result = ['bottom'];
                break;
            case 'left-start':
                result = ['right-start', 'left-start'];
                break;
            case 'left-end':
                result = ['right-end', 'left-end'];
                break;
            case 'left':
                result = ['right'];
                break;
            case 'right-start':
                result = ['left-start', 'right-start'];
                break;
            case 'right-end':
                result = ['left-end', 'right-end'];
                break;
            case 'right':
                result = ['left'];
                break;
            default:
                result = [];
        }

        return result;
    }

    _updatePopperPos() {
        this._popper.forceUpdate()
    }

    _isOpen() {
        return this._element.getAttribute('aria-expanded') === 'true' && this._parent.classList.contains(OPEN_CLASS);
    }

    _isDisabled() {
        return isElementDisabled(this._element) || false;
    }

    _getMenuElement() {
        return document.querySelector('.c-global-dropdown-menu') || null;
    }


    /** Static Interface to check for an existing instance, create new if required and return the Instance
       * @param {*} element:HTMLElement - will be bound to _element property on the instance 
       * @returns class instance with parameter bound to _element
       */
    static dropdownInterface(element: HTMLElement) {
        const context: any = Context.get(element, COMPONENT_KEY);
        if (!context) {
            return new GlobalDropdown(element);
        }
        return context;
    }
}

export const globalDropdownINIT = () => {
    if (!(document.querySelector('.c-global-dropdown'))) return;

    const dropdownComponents: any = [].slice.call(document.querySelectorAll('.c-global-dropdown > [aria-expanded]') as NodeListOf<HTMLElement>) || [];
    const dropdowns: any = dropdownComponents.map((item: HTMLElement) => GlobalDropdown.dropdownInterface(item));
};

