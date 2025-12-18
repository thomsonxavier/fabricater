/* Imports */
import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

/* Unique Key */
const COMPONENT_KEY:string = 'switch_sw'; //unique key

/* Class */
export class Switch extends BaseClass {

    _switchs:any;
    _resizeEvHandler:any;
    _clickEvHandler:any;

    constructor(element:HTMLElement) {
        super(element);

        this._switchs = Array.from(element.querySelectorAll('.o-ias__switchGroup-btn')) || [];
        this._resizeEvHandler = this._resizeHandler.bind(this);
        this._clickEvHandler = this._clickHandler.bind(this);

        if(this._element) { this._init(); }
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        this._setOverlay();
        this._switchs.forEach((item:any) => item.addEventListener('click', this._clickEvHandler));
        this._element.addEventListener('data.update', this._resizeEvHandler);
        window.addEventListener('resize', this._resizeEvHandler);
    }

    // 1.2 - Dispose Object and Remove eventlisteners
    _destroy(){
        this._switchs.forEach((item:any) => item.removeEventListener('click', this._clickEvHandler));
        this._element.removeEventListener('data.update', this._resizeEvHandler);
        window.removeEventListener('resize', this._resizeEvHandler);

        super.dispose();
    }

    // 1.3 - Handle window resize
    _resizeHandler(){
        this._setOverlay();
    }

    // 1.4 click handler
    _clickHandler(event:Event){
        let item = event.currentTarget as HTMLElement;
        if(item.classList.contains('-active')) return;
        this._setOverlay(item);
    }

    //1.5 set overlay
    _setOverlay(activeEl:any=null){
        activeEl = ( activeEl === null ) ? ( this._element.querySelector('.o-ias__switchGroup-btn.-active') || this._switchs[0] || null) : activeEl;
        let overlay = this._element.querySelector('.o-ias__switchGroup-overlay');

        // If there's no active El return and set overlay to 0
        // NOTE: This code is for error handling, the actual switch in HTML should always have an active child
        if(activeEl === null){
            overlay.style.left = 0; overlay.style.width = 0 + 'px';
            return;
        }

        activeEl.classList.add('-active');
        // activeEl.setAttribute('tabindex','-1');
        activeEl.setAttribute('aria-current','true');
        this._switchs.forEach((el:any)=>{
            if(el !== activeEl){ 
                el.classList.remove('-active'); 
                // el.setAttribute('tabindex','0');  
                el.setAttribute('aria-current','false');
            }
        });

        //set overlay width and left position
        overlay.style.left = activeEl.offsetLeft + 'px';
        overlay.style.width = activeEl.getBoundingClientRect().width + 'px';
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static switchInterface(element:HTMLElement) {
        const context = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new Switch(element);
    }
}


// Function to create instances
export const switchINIT = () =>{

    // NOTE: CALL THIS ON ngAfterViewInit()
    let switchEls:any[] = [].slice.call(document.querySelectorAll('.o-ias__switchGroup') as NodeListOf<HTMLElement>) || [];
    let elements:any[] = switchEls.map((item:HTMLElement) => Switch.switchInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}