/* Imports */
import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

/* Unique Key */
const COMPONENT_KEY:string = 'Toggle_sw'; //unique key

/* Class */
export class ToggleSwitch extends BaseClass {

    _toggles:any;
    
    _resizeEvHandler:EventListener = this._resizeHandler.bind(this);
    _openEvHandler:EventListener = this._openHandler.bind(this);
    _initializeEvHandler:EventListener =  this._initHandler.bind(this);
    _resetEvHandler:EventListener = this._resetHandler.bind(this);

    constructor(element:HTMLElement) {
        super(element);

        this._declarations();
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 0.1
    _declarations(){
        this._toggles = Array.from(this._element.querySelectorAll('.c-toggleswitch__btn[role="tab"]')) || [];

        if(this._element) { this._init(); }
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        this._setOverlay();
        this._toggles.forEach((item:any) => item.addEventListener('tabs.open', this._openEvHandler));
        this._element.addEventListener('data.update', this._resetEvHandler);
        this._element.addEventListener('data.reset', this._resetEvHandler);
        document.body.addEventListener('data.myw.init', this._initializeEvHandler);
        window.addEventListener('resize', this._resizeEvHandler);
    }

    // 1.2 - Dispose Object and Remove eventlisteners
    _destroy(flag:boolean=true){
        this._toggles.forEach((item:any) => item.removeEventListener('tabs.open', this._openEvHandler));
        this._element.removeEventListener('data.update', this._resetEvHandler);
        this._element.removeEventListener('data.reset', this._resetEvHandler);
        document.body.removeEventListener('data.myw.init', this._initializeEvHandler);
        window.removeEventListener('resize', this._resizeEvHandler);

        flag && super.dispose();
    }

    // 1.3 - Initialize when required - (for example, when an accordion opens and has a carousel inside)
    _initHandler(event:Event){
        if((event.target as HTMLElement)?.contains(this._element) || event.target == this._element){
            this._setOverlay();
        }
    }

    // 1.4 - Handle window resize
    _resizeHandler(){
        this._setOverlay();
    }

    // 1.5 - Hanlde reset
    _resetHandler(){
        this._destroy(false);
        this._declarations();
    }

    // 2.1 open handler
    _openHandler(event:Event){
        let item = event.currentTarget as HTMLElement;
        this._setOverlay(item);
    }

    // 3.1 set overlay
    _setOverlay(activeEl:any=null){
        activeEl = ( activeEl === null ) ? ( this._element.querySelector('.c-toggleswitch__btn[role="tab"][aria-selected="true"]') || this._toggles[0] || null) : activeEl;
        const overlay = this._element.querySelector('.c-toggleswitch__overlay') as HTMLElement;

        if(!overlay) return;

        // If there's no active El return and set overlay to 0
        // NOTE: This code is for error handling, the actual toggle in HTML should always have an active child
        if(activeEl === null){
            overlay.style.left = 0 + 'px'; overlay.style.width = 0 + 'px';
            return;
        }

        //set overlay width and left position
        overlay.style.left = activeEl.offsetLeft + 'px';
        overlay.style.width = activeEl.getBoundingClientRect().width + 'px';
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static ToggleInterface(element:HTMLElement) {
        let context = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new ToggleSwitch(element);
    }
}


// Function to create instances
export const toggleINIT = () =>{

    // NOTE: CALL THIS ON ngAfterViewInit()
    let ToggleEls:any[] = [].slice.call(document.querySelectorAll('.c-toggleswitch__wrap[role="tablist"]') as NodeListOf<HTMLElement>) || [];
    let elements:any[] = ToggleEls.map((item:HTMLElement) => ToggleSwitch.ToggleInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}