/* Imports */
import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

/* Unique Key */
const COMPONENT_KEY:string = 'sample_key'; //unique key

/* Class */
export class sampleElement extends BaseClass {
    _resizeEvHandler:EventListener = this._resizeHandler.bind(this);
    _resetEvHandler:EventListener = this._resetHandler.bind(this);

    constructor(element:HTMLElement) {
        super(element);

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
        this._element.addEventListener('data.reset', this._resetEvHandler);
        window.addEventListener('resize', this._resizeEvHandler);
    }

    /** 1.2 - Dispose Object and Remove eventlisteners
     * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
     */
    _destroy(flag:boolean=true){
        this._element.removeEventListener('data.reset', this._resetEvHandler);
        window.removeEventListener('resize', this._resizeEvHandler);

        flag && super.dispose();
    }

    // 1.3 - Handle window resize
    _resizeHandler(){

    }

    // 1.4 - Handle instance reset (reset and update all properties)
    _resetHandler(){
        this._destroy(false);
        this._declarations();
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with the parameter bound to _element
     */
    static initInterface(element:HTMLElement) {
        const context:sampleElement = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new sampleElement(element);
    }
}


// Function to create instances
export const sampleINIT = () =>{

    // NOTE: CALL THIS ON ngAfterViewInit()
    let sampleEls:any[] = [].slice.call(document.querySelectorAll('sampleSelector') as NodeListOf<HTMLElement>) || [];
    let elements:any[] = sampleEls.map((item:any) => sampleElement.initInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}