import * as Popper from '@popperjs/core';

import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

import { Placement } from '../../utils/popper-definitions';

const COMPONENT_KEY: string = 'tooltip';

export class Tooltip extends BaseClass {
    _content: string;
    _placement: Placement;
    _custClass: string;
    _tooltip: HTMLElement = document.createElement('div');;
    _tooltip__arrow: HTMLElement | null = null;
    _tooltip__inner: HTMLElement | null = null;
    _popper: any = null;
    _mode: 'hover' | 'click' = 'hover';
    _showHandler: EventListener = this._show.bind(this);
    _hideHandler: EventListener = this._hide.bind(this);
    _clickHandler: EventListener = this._handleClick.bind(this);

    constructor(element: HTMLElement) {
        super(element);
        this._content = this._element.getAttribute('data-tooltip-title') || 'Test';
        this._placement = this._element.getAttribute('data-tooltip-placement') || 'top';
        this._custClass = this._element.getAttribute('data-tooltip-custclass') || null;
        this._mode = this._element.getAttribute('data-tooltip-mode');

        if (this._element && this._content) { this._init(); }
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init() {
        this._tooltip = document.createElement('div');
        this._tooltip.classList.add('c-tooltip');
        this._tooltip.setAttribute('role', 'tooltip');
        this._tooltip__arrow = document.createElement('div');
        this._tooltip__arrow.classList.add('-arrow');
        this._tooltip__inner = document.createElement('div');
        this._tooltip__inner.classList.add('c-tooltip__inner');
        this._tooltip.append(this._tooltip__arrow);
        this._tooltip.append(this._tooltip__inner);

        if (this._mode === 'click') {
            this._element.addEventListener('click', this._clickHandler);
        }
        else {
            this._element.addEventListener('mouseenter', this._showHandler);
            this._element.addEventListener('focusin', this._showHandler);

            this._element.addEventListener('mouseleave', this._hideHandler);
            this._element.addEventListener('focusout', this._hideHandler);
        }
    }

    /** 1.2 - Dispose Object and Remove eventlisteners
     * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
     */
    _destroy(flag: boolean = true) {
        document.body.contains(this._tooltip) && document.body.removeChild(this._tooltip);

        this._element.removeEventListener('mouseenter', this._showHandler);
        this._element.removeEventListener('focusin', this._showHandler);

        this._element.removeEventListener('mouseleave', this._hideHandler);
        this._element.removeEventListener('focusout', this._hideHandler);

        this._element.removeEventListener('click', this._clickHandler);

        flag && super.dispose();
    }

    // 2.1 - Show Tooltip
    _show() {
        if (this._element.hasAttribute('aria-describedby')) return;

        // let id = Math.floor(Math.random() * (9999 - 1000) + 1000) //-- generate random no bw 1000 - 9999
        var id: any = crypto.getRandomValues(new Uint16Array(1));
        this._element.setAttribute('aria-describedby', `tooltip${id}`);

        this._addtooltip(this._custClass, `tooltip${id}`);
    }

    /**
     *  2.2 - Add Tooltip to DOM
     * @param custClass : string - custom class to be added as required
     * @param id :string - unique id for the popover
     */
    _addtooltip(custClass: any = null, id: string = "tooltip1234") {
        document.body.append(this._tooltip);
        this._content = this._element.getAttribute('data-tooltip-title') || 'Test';
        this._tooltip__inner!.innerHTML = this._content;
        this._tooltip.setAttribute('id', `tooltip${id}`);
        this._tooltip.classList.add('-show');
        custClass && this._tooltip.setAttribute('data-custClass', custClass);

        this._createPopper()
    }

    // 2.3 - Create Popper instance
    _createPopper() {
        this._placement = this._element.getAttribute('data-tooltip-placement') || 'top';
        this._popper = Popper.createPopper(this._element, this._tooltip, {
            placement: this._placement,
            strategy: 'fixed',
            modifiers: [
                { name: 'preventOverflow', options: { altAxis: true, boundary: 'clippingParents' } },
                { name: 'flip', options: { fallbackPlacements: ['left', 'right'] } },
                { name: 'offset', options: { offset: [0, 8] } }, //offset 8 for the arrow
                { name: 'applyStyles', }
            ]
        });

        this._popper.forceUpdate();
    }

    // 3.1 - Hide tooltip
    _hide() {
        // if(event.type == 'mouseleave'){
        //     const triggerRect = this._element.getBoundingClientRect();
        //     const falsePositive = this._isWithingARect(event.clientX, event.clientY, triggerRect);

        //     if (falsePositive) { return; }
        // }
        if (!this._element.hasAttribute('aria-describedby')) return;

        this._element.removeAttribute('aria-describedby');
        this._removetooltip();
    }

    // 3.2 Remove tooltip from DOM
    _removetooltip() {
        this._tooltip.classList.remove('-show');
        this._tooltip.removeAttribute('data-custClass');
        if (this._popper) this._popper.destroy();
        document.body.contains(this._tooltip) && document.body.removeChild(this._tooltip);
    }

    //3.3 Toggle tooltip on click
    _handleClick() {
        if (this._element.hasAttribute('aria-describedby')) this._hide();
        else this._show()
    }

    // _adjusttooltip(rect, placement,custClass, id){
    //     let tooltip__rect = this._tooltip.getBoundingClientRect();
    //     if(tooltip__rect.right >= window.innerWidth || tooltip__rect.bottom >= window.innerHeight || tooltip__rect.top < 0 || tooltip__rect.left < 0){       
    //         switch(placement){
    //             case "top":
    //                 this._addtooltip( rect, "left", custClass, id)
    //                 break;
    //             case "bottom":
    //                 this._addtooltip( rect, "right", custClass, id)
    //                 break;
    //             case "left":
    //                 this._addtooltip( rect, "bottom", custClass, id)
    //                 break;
    //             case "right":
    //                 this._addtooltip( rect, "top", custClass, id)
    //                 break;
    //             case "bottom-left":
    //                 this._addtooltip( rect, "bottom-left", custClass, id)
    //                 break;
    //             default:
    //                 this._addtooltip( rect, "top", custClass, id)
    //                 break;
    //         }
    //     }
    // }

    // utility methods
    // Redundant
    // _isWithingARect(x:any, y:any, rect:any) {
    //     const xIsWithin:any = x > rect.left && x < rect.right;
    //     const yIsWithin:any = y > rect.top && y < rect.bottom;
    //     return xIsWithin && yIsWithin;
    // }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static tooltipInterface(element: HTMLElement) {
        const context: any = Context.get(element, COMPONENT_KEY);
        if (!context) {
            return (new Tooltip(element));
        }
        return context;
    }
}

export default Tooltip;

export const tooltipFunc = () => {
    if (!document.querySelector('[data-tooltip-toggle="tooltip"]')) {
        return;
    }

    // NOTE: CALL THIS ON ngAfterViewInit()
    let tooltips = [].slice.call(document.querySelectorAll('[data-tooltip-toggle="tooltip"]') as NodeListOf<HTMLElement>) || [];
    let elements = tooltips.map((item: any) => Tooltip.tooltipInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}


