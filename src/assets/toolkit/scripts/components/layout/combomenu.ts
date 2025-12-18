/* Dropdown */
import * as Popper from '@popperjs/core';
import {
  isElementDisabled,
} from '../../utils/utilities';
import Context from '../../utils/context';
import BaseClass from '../../utils/base-class';
import eventlistener from '../../utils/eventlistener';

const COMPONENT_KEY:string = 'combomenu';
const OPEN_CLASS:string = '-open';


export class Combomenu extends BaseClass {
    _parent:HTMLElement;
    _menu:HTMLElement;

    _isPlacementStatic = false;
    _isPlacementRight = false;
    _isPositionFixed = false;

    _popper:any;

    _optionClickEvHandler = this._optionClickHandler.bind(this);
    _watchClickOutsideHandler = this._watchClickOutside.bind(this);
    _keydownEvHandler = this._keydownHandler.bind(this);
    _keyupEvHandler = this._keyupHandler.bind(this);
    _toggleEvHandler:EventListener = this._toggle.bind(this);
    _resizeEvHandler:EventListener = this._resizeHandler.bind(this);
    _resetEvHandler:EventListener = this._resetHandler.bind(this);

    constructor(element:HTMLElement) {
        super(element);
        this._parent = this._element.closest('.c-combomenu__wrap');
        this._menu = this._parent.querySelector('.c-combomenu__menu');
        this._isPlacementRight = this._parent.getAttribute('data-horizontal-align') === 'right';
        this._isPlacementStatic = this._parent.getAttribute('data-static-placement') === 'true';
        this._isPositionFixed = this._parent.getAttribute('data-position') === 'fixed';

        this._declarations();
    }  

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 0.1 - declarations (Initialization of declared properties)
    _declarations() {
        if(this._element) { this._init(); }
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        this._element.addEventListener('click', this._toggleEvHandler);
        this._element.addEventListener('data.reset', this._resetEvHandler);
        eventlistener.on(this._menu, 'click', 'button, a, input', this._optionClickEvHandler);
        this._element.addEventListener('keydown', this._keydownEvHandler);
        this._menu.addEventListener('keydown', this._keydownEvHandler);
        this._element.addEventListener('keyup', this._keyupEvHandler);
        this._menu.addEventListener('keyup', this._keyupEvHandler);


        this._element.addEventListener('hide.combomenu', this._toggleEvHandler);
        this._parent.addEventListener('hide.combomenu', this._toggleEvHandler);
          
        window.addEventListener('resize', this._resizeEvHandler);
    }

    /** 1.2 - Dispose Object and Remove eventlisteners
     * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
     */
    _destroy(flag:boolean=true){
        this._element.removeEventListener('click', this._toggleEvHandler);
        this._element.removeEventListener('data.reset', this._resetEvHandler);
        this._menu.removeEventListener('click', this._optionClickEvHandler, true);
        this._element.removeEventListener('keydown', this._keydownEvHandler);
        this._menu.removeEventListener('keydown', this._keydownEvHandler);
        this._element.removeEventListener('keyup', this._keyupEvHandler);
        this._menu.removeEventListener('keyup', this._keyupEvHandler);

        this._element.removeEventListener('hide.combomenu', this._toggleEvHandler);
        this._parent.removeEventListener('hide.combomenu', this._toggleEvHandler);

        window.removeEventListener('resize', this._resizeEvHandler);

        flag && super.dispose();
    }

    /** 2.1 -  */
    _toggle() {
        if(this._isOpen()) {
            this._hide();
        }
        else {
            this._show();
        }
    }

    /**2.2 */
    _show() {
        this._element.setAttribute('aria-expanded', 'true');
        this._parent.classList.add(OPEN_CLASS);
        this._element.focus({preventScroll:true, focusVisible:true});

        // fire showing event
        this._parent.dispatchEvent(new Event('data.combomenu.showing',{bubbles: true}));

        if (typeof Popper === 'undefined') {
            throw new TypeError('Dropmenu require Popper (https://popper.js.org)');
        }
        else {
            this._isPlacementRight = this._parent.getAttribute('data-horizontal-align') === 'right';
            this._isPlacementStatic = this._parent.getAttribute('data-static-placement') === 'true';
            this._isPositionFixed = this._parent.getAttribute('data-position') === 'fixed';

            this._popper = Popper.createPopper(this._element, this._menu, {
                placement: this._isPlacementRight ? 'bottom-end' : 'bottom-start',
                strategy: this._isPositionFixed ? 'fixed' : 'absolute',
                modifiers: [
                  { name: 'preventOverflow', options: { altAxis: true, boundary: 'clippingParents' } },
                  { name: 'flip', options: { fallbackPlacements: this._isPlacementRight ? ['top-end', 'bottom-end'] : ['top-start', 'bottom-start'] } },
                  { name: 'offset', options: { offset: [0, 0] } },
                  { name: 'applyStyles', enabled: !this._isPlacementStatic }
                ]
              });
        }

        if (this._isPlacementRight) this._popper.forceUpdate();

        // fire shown event
        this._parent.dispatchEvent(new Event('data.combomenu.shown',{bubbles: true}));

        document.addEventListener("click", this._watchClickOutsideHandler, true);
    }

   /**
   2.3 - Hide dropdown (Sets focus back to _element by default unless specified otherwise)
   * @param { Event } event
   */
    _hide(flag:boolean=true) {
        if (this._isOpen()) {
          this._element.setAttribute('aria-expanded', 'false');
          this._parent.classList.remove(OPEN_CLASS);
    
          // fire closing event
          this._parent.dispatchEvent(new Event('data.combomenu.closing',{bubbles: true}));
    
          // destroy popper instance
          if (this._popper) this._popper.destroy();
    
          flag && this._element.focus({preventScroll:true, focusVisible:true});
        }
    
        this._setActiveDescendent('');
        document.removeEventListener("click", this._watchClickOutsideHandler, true);
    
        // fire closed event
        this._parent.dispatchEvent(new Event('data.combomenu.closed',{bubbles: true}));
    }

    /**
     * 3.2.1 - Handle keydown actions on the dropdown
     * @param {KeyboardEvent} event 
     * -- In progress --
     */
    _keydownHandler(event:KeyboardEvent) {
        if (this._isControlDisabled()) return;

        const isActive = this._isOpen();

        // if( !(event.key==='Tab' || event.key==='Escape' || event.key==='Enter' || event.key==='ArrowUp' || event.key==='ArrowDown' || event.key === 'Space' || event.key === ' ') ) return;
        // if(isActive && (event.key === 'Space' || event.key === ' ')) return;
        // if (!isActive && event.key === 'Tab') return;

        /**Implement */
        // if(isActive && (event.ctrlKey || event.shiftKey || event.altKey)) {console.log('22'); this._element.focus(); return; }

        if (isActive && (event.key === 'Tab' || event.key === 'Escape')) {
            event.key === 'Tab' ? this._hide(false) : this._hide();
            return;
        }

        if(isActive && event.target===this._element && event.key === 'Enter') {
            this._hide();
            return;
        }

        if( (event.key === 'ArrowUp' || event.key === 'ArrowDown')){
            event.preventDefault(); event.stopPropagation();

            const menuitemsPreFilter = [].slice.call(this._menu.querySelectorAll('a, input, button')) || [];
            const menuitems = [].filter.call(menuitemsPreFilter, function(el:HTMLElement) {
                return( !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && !el.hasAttribute('disabled') && el.ariaDisabled !== 'true' && !el.classList.contains('.disabled') )
            });

            if(!isActive) { // && event.target === this._element
                this._show();
                if (!menuitems.length) return;
                (event.key === 'ArrowUp') ? menuitems[menuitems.length - 1].focus() : menuitems[0].focus();
                return;
            }

            else {
                if (!menuitems.length) return;
                const targetEl = event.target as HTMLElement;
                let menuitemIndex = menuitems.indexOf(targetEl);

                if (event.key === 'ArrowUp') menuitemIndex--;
                if (event.key === 'ArrowDown') menuitemIndex++;

                menuitemIndex = (event.key === 'ArrowUp' && menuitemIndex < 0) ? menuitems.length - 1 : menuitemIndex;
                menuitemIndex = (event.key === 'ArrowDown' && menuitemIndex > menuitems.length - 1) ? 0 : menuitemIndex;
            
                menuitems[menuitemIndex].focus();
                menuitems[menuitemIndex].id && this._setActiveDescendent(menuitems[menuitemIndex].id);
            }
            
            return;
        }

        if(event.key === 'Home') {
            console.log('Home');
            (this._element as HTMLInputElement).setSelectionRange(0, 0);
            event.preventDefault(); event.stopPropagation();
            return;
        }

        if(event.key === 'End') {
            console.log('End');
            const length = (this._element as HTMLInputElement).value.length;
            (this._element as HTMLInputElement).setSelectionRange(length, length);
            event.preventDefault(); event.stopPropagation();
            return;
        }
    }

    /**
     * 3.2.2 - Handle keyup -- In progress
     */
    _keyupHandler(event:KeyboardEvent) {
        return;
        if(!this._isOpen()) return;

        const target = event.target as HTMLElement;
        let filter:string;
        let flag = false;

        if(target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') return;
        if(document.activeElement === this._element) return;

        if (this._isPrintableCharacter(event.key)) {
            this._element.focus();
        }

        switch (event.key) {
            case 'Home':
                this._element.setSelectionRange(0, 0);
                flag = true;
                break;
            case 'End':
                this._element.setSelectionRange(length, length);
                flag = true;
                break;
            default:
                if(this._isPrintableCharacter(event.key)) {
                    this._element.setSelectionRange(length, length);
                    break;
                }
        }
        
        this._setActiveDescendent('');

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * 3.2 - While dropdown is open, watch for clicks outside of it and close the dropdown. (Focus isn't set back to _element)
     * @param { Event } event
     */
    _watchClickOutside(event:Event) {
        if ((event.target != this._element) && (event.target != this._menu) && !this._menu.contains(event.target as HTMLElement)) {
            this._hide(false);
        }
    }

    /**
   * 3.3 - Close dropdown when an option is selected (checkbox, label, radio elements, input fields are exempt)
   * @param {Event} event
   */
    _optionClickHandler(event:any){
        // console.log(1, event.currentTarget, event.target, event.delegatedTarget)
        if((event.delegatedTarget.tagName == 'A' || event.delegatedTarget.tagName == 'BUTTON') && (!event.delegatedTarget.classList.contains('-donot-dismiss')) && this._isOpen() ){
            this._hide();
        }
    }

    // 4.1 - Handle window resize
    _resizeHandler(){

    }

    // 4.2 - Handle instance reset (reset and update all properties)
    _resetHandler(){
        this._destroy(false);
        this._declarations();
    }

    //5 - utilities
    // 5.1
    _isOpen():boolean {
        return this._element.getAttribute('aria-expanded') === 'true';
    }

    //5.2
    _setActiveDescendent(id:string):void {
        this._element.setAttribute('aria-activedescendant', `${id}`);
    }

    // 5.3
    _isControlDisabled() {
        return isElementDisabled(this._element) || false;
    }

    //5.4
    _isPrintableCharacter(str:string) {
        return str.length === 1 && str.match(/\S| /);
    }


    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with the parameter bound to _element
     */
    static initializationInterface(element:HTMLElement) {
        const context:Combomenu = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new Combomenu(element);
    }
}

// Function to create instances
export const initializeCombomenu = () =>{

    // NOTE: CALL THIS ON ngAfterViewInit()
    let combomenuEls:any[] = [].slice.call(document.querySelectorAll('.c-combomenu__control[aria-expanded][aria-controls]') as NodeListOf<HTMLElement>) || [];
    let elements:any[] = combomenuEls.map((item:any) => Combomenu.initializationInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}