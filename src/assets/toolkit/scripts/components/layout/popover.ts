import * as Popper from '@popperjs/core';

import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

import { Placement } from '../../utils/popper-definitions';

const COMPONENT_KEY:string = 'popover';


export class Popover extends BaseClass{

    _contentCont:HTMLElement | null;
    _content:string;
    _placement:Placement;
    _custClass:string;

    _popover:HTMLElement = document.createElement('div');
    _popover__arrow:HTMLElement | null = null;
    _popover__inner:HTMLElement | null= null;
    _popper:any;

    _showHandler:EventListener = this._show.bind(this); 
    _hideHandler:EventListener = this._hide.bind(this);
    
    constructor(element:HTMLElement) {
        super(element);
        this._contentCont = this._element.querySelector('.c-popover-content') || null;
        this._content = this._contentCont ? this._contentCont.innerHTML : 'Test';
        this._placement = this._element.getAttribute('data-tooltip-placement') || 'top';
        this._custClass = this._element.getAttribute('data-tooltip-custclass') || null;

        if(this._element && this._content) { this._init(); }
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        this._popover = document.createElement('div');
        this._popover.classList.add('c-popover');
        this._popover.setAttribute('role','tooltip');
        this._popover__arrow = document.createElement('div');
        this._popover__arrow.classList.add('-arrow');
        this._popover__inner = document.createElement('div');
        this._popover__inner.classList.add('c-popover__inner');
        this._popover.append(this._popover__arrow);
        this._popover.append(this._popover__inner);

        this._element.addEventListener('mouseenter', this._showHandler);
        this._element.addEventListener('focusin', this._showHandler);

        this._element.addEventListener('mouseleave',this._hideHandler);
        this._element.addEventListener('focusout', this._hideHandler);

    }

    /** 1.2 - Dispose Object and Remove eventlisteners
     * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
     */
    _destroy(flag:boolean = true){        
        if(this._popover && document.body.contains(this._popover)) document.body.removeChild(this._popover);

        this._element.removeEventListener('mouseenter', this._showHandler);
        this._element.removeEventListener('focusin', this._showHandler);

        this._element.removeEventListener('mouseleave',this._hideHandler);
        this._element.removeEventListener('focusout', this._hideHandler);

        flag && super.dispose();
    }

    // 2.1 - Show Popover
    _show(){
        let item = this._element;   
        if( item.hasAttribute('aria-describedby') ) return;

        // let id = Math.floor(Math.random() * (9999 - 1000) + 1000) //-- generate random no bw 1000 - 9999
        var id = crypto.getRandomValues(new Uint16Array(1));
        item.setAttribute('aria-describedby',`popover${id}`);


        this._addPopover(this._custClass, `popover${id}`);

    }

    /**
     *  2.2 - Add Popover to DOM
     * @param custClass : string - custom class to be added as required
     * @param id :string - unique id for the popover
     */
    _addPopover(custClass:any=null, id:string="popover1234"){
        document.body.append(this._popover);
        this._content = this._contentCont ? this._contentCont.innerHTML : 'Test';
        this._popover__inner!.innerHTML = this._content;
        this._popover.setAttribute('id',`popover${id}`);
        this._popover.classList.add('-show');
        custClass && this._popover.setAttribute('data-custClass',custClass);

        this._createPopper()
    }

    // 2.3 - Create Popper instance
    _createPopper() {
        let pop_placement = this._element.getAttribute('data-tooltip-placement') || 'top';
        this._popper = Popper.createPopper(this._element, this._popover, {
            placement: pop_placement,
            strategy: 'fixed',
            modifiers: [
              { name: 'preventOverflow', options: { altAxis: true, boundary: 'clippingParents' } },
              { name: 'flip', options: { fallbackPlacements: ['left', 'right']} },
              { name: 'offset', options: { offset: [0, 8] } }, //offset 8 for the arrow
              { name: 'applyStyles', }
            ]
        });

        this._popper.forceUpdate();
    }

    // 3.1 - Hide Popover
    _hide(){
        if(! this._element.hasAttribute('aria-describedby') ) return;

        this._element.removeAttribute('aria-describedby');
        this._removePopover();
    }

    // 3.2 - Remove Popover from DOM
    _removePopover(){
        this._popover.classList.remove('-show');
        this._popover.removeAttribute('data-custClass');
        if (this._popper) this._popper.destroy();
        document.body.contains(this._popover) && document.body.removeChild(this._popover);
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static popoverInterface(element:HTMLElement) {
        const context:any = Context.get(element, COMPONENT_KEY);
        if (!context) {
            return new Popover(element);
        }
        return context;
    }
}

export default Popover;

export const popoverFunc = () =>{
    if(!document.querySelector('[data-tooltip-toggle="popover"]')){
        return;
    }

    // NOTE: CALL THIS ON ngAfterViewInit()
    let popovers = [].slice.call(document.querySelectorAll('[data-tooltip-toggle="popover"]') as NodeListOf<HTMLElement>) || [];
    let elements = popovers.map((item:HTMLElement) => Popover.popoverInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}