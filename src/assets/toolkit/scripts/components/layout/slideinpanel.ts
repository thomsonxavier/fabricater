import {
    getFocusableChildren
} from '../../utils/utilities';
import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

const COMPONENT_KEY:string = 'slideinpanel';

export class Slideinpanel extends BaseClass {

    _openClass:string = "-open";

    _id:string;
    _toggleControls:HTMLElement[];
    _openControls:HTMLElement[];
    _closeControls:HTMLElement[];
    _activeControl:HTMLElement | null;

    _toggleEvHandler:EventListener;
    _openEvHandler:EventListener;
    _closeEvHandler:EventListener;
    _keypressEvHandler;

    constructor(element:HTMLElement) {
        super(element);

        this._id = this._element.getAttribute('id');
        this._toggleControls = Array.from(document.querySelectorAll(`.-toggle-panel[data-target="${this._id}"]`)) || [];
        this._openControls = Array.from(document.querySelectorAll(`.-open-panel[data-target="${this._id}"]`)) || [];
        this._closeControls = Array.from(this._element.querySelectorAll('.-close-panel')) || [];
        
        this._activeControl = null;
        this._toggleEvHandler = this._toggleHandler.bind(this);
        this._openEvHandler = this._open.bind(this);
        this._closeEvHandler = this._close.bind(this);
        this._keypressEvHandler = this._bindKeypress.bind(this);

        this._init();
    }

    // 0.1 - Initialize Object and add eventlisteners
    _init(){
        this._toggleControls.forEach((element:any) => { element.addEventListener('click', this._toggleEvHandler); });
        this._openControls.forEach((element:any) => { element.addEventListener('click', this._openEvHandler); });
        this._closeControls.forEach((element:any) => { element.addEventListener('click', this._closeEvHandler); });
        this._element.addEventListener('data.myw.close', this._closeEvHandler);
    }

    /** 0.2 - Dispose Object and Remove eventlisteners
     * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
     */
    _destroy(flag:boolean=true){
        this._toggleControls.forEach((element:any) => { element.removeEventListener('click', this._toggleEvHandler); });
        this._openControls.forEach((element:any) => { element.removeEventListener('click', this._openEvHandler); }); 
        this._closeControls.forEach((element:any) => { element.removeEventListener('click', this._closeEvHandler); });   
        this._element.removeEventListener('data.myw.close', this._closeEvHandler);
        document.removeEventListener('keydown', this._keypressEvHandler); 

        flag && super.dispose();
    }

    // 0.3 - Update instance
    _update(){
        this._toggleControls.forEach((element:any) => { element.removeEventListener('click', this._toggleEvHandler); });
        this._openControls.forEach((element:any) => { element.removeEventListener('click', this._openEvHandler); }); 
        this._closeControls.forEach((element:any) => { element.removeEventListener('click', this._closeEvHandler); });  
        
        this._toggleControls = Array.from(document.querySelectorAll(`.-toggle-panel[data-target="${this._id}"]`)) || [];
        this._openControls = Array.from(document.querySelectorAll(`.-open-panel[data-target="${this._id}"]`)) || [];
        this._closeControls = Array.from(this._element.querySelectorAll('.-close-panel')) || [];

        this._toggleControls.forEach((element:any) => { element.addEventListener('click', this._toggleEvHandler); });
        this._openControls.forEach((element:any) => { element.addEventListener('click', this._openEvHandler); });
        this._closeControls.forEach((element:any) => { element.addEventListener('click', this._closeEvHandler); });
    }

    // 1 - Toggle between open/closed state
    _toggleHandler(event:Event){
        if(this._isOpen()){ this._close(); }
        else{ this._open(event); }
    }

    // 1.1 - Open 
    _open(event:Event | null=null){
        this._activeControl = (event?.currentTarget as HTMLElement) || null;

        this._element.classList.add(this._openClass);
        // this._element.setAttribute('tabindex','0');
        // this._activeControl?.setAttribute('aria-expanded','true');
        // setTimeout(() => {
            this._closeControls[0]?.focus({preventScroll: true});
        // }, 200);

        // Fire Initialize event for carousel / any element required
        // this._element.dispatchEvent(new Event('data.myw.init',{bubbles: true}));

        document.addEventListener('keydown', this._keypressEvHandler);
    }

    // 1.2 - Close
    _close(){
        this._element.classList.remove(this._openClass);
        // this._element.setAttribute('tabindex','-1');
        // this._activeControl.setAttribute('aria-expanded','false');
        // if(this._closeControls.includes(event?.currentTarget)) { this._activeControl?.focus(); }
        this._activeControl?.focus();
        this._activeControl = null;
        document.removeEventListener('keydown', this._keypressEvHandler);
    }

    // 2.1 keyboard events handler
    _bindKeypress(event:KeyboardEvent) {
        if (!this._element.contains(document.activeElement)) return;
    
        // If the dialog is shown and the ESCAPE key is being pressed, hide the dialog, unless its role is 'alertdialog', which should be modal
        if (this._isOpen() && event.key === 'Escape') {
          event.preventDefault();
          this._close();
        }
    
        // If the dialog is shown and the TAB / SHIFT + TAB key is being pressed, make sure the focus stays trapped within the dialog element
        if (this._isOpen() && (event.key === 'Tab')) {
          this._trapTabKey(this._element, event);
        }
    }

    // utilites
    _isOpen() {
        return this._element.classList.contains(this._openClass);
    }

    _trapTabKey(node:any, event:any) {
        let focusableChildren = getFocusableChildren(node);
        let focusedItemIndex = focusableChildren.indexOf(document.activeElement);
    
        // If the SHIFT key is being pressed while tabbing (moving backwards) and
        // the currently focused item is the first one, move the focus to the last
        // focusable item from the dialog element
        if ((event.shiftKey) && focusedItemIndex === 0) {
          focusableChildren[focusableChildren.length - 1].focus();
          event.preventDefault();
          // If the SHIFT key is not being pressed (moving forwards) and the currently
          // focused item is the last one, move the focus to the first focusable item
          // from the dialog element
        } else if ( (!event.shiftKey) && (focusedItemIndex === focusableChildren.length - 1)) {
          focusableChildren[0].focus();
          event.preventDefault();
        }
      }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static interface(element:HTMLElement) {
        const context:any = Context.get(element, COMPONENT_KEY);
        if (!context) {
            return new Slideinpanel(element);
        }
        else{
            return context;
        }
    }
}

export const slideinpanelINIT = () =>{
    if(!document.querySelector('.c-slpanel__wrap')){
        return;
    }

    // NOTE: CALL THIS ON ngAfterViewInit()
    const targets:any = [].slice.call(document.querySelectorAll('.c-slpanel__wrap') as NodeListOf<HTMLElement>) || [];
    const elements:any = targets.map((item:HTMLElement) => Slideinpanel.interface(item));
}