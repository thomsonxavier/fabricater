/* Imports */
import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

/* Unique Key */
const COMPONENT_KEY:string = 'scrollto'; //unique key

/* Class */
export class scrolltoanywhere extends BaseClass {

    _clickEvHandler:Function;
    constructor(element:HTMLElement) {
        super(element);

        this._clickEvHandler = this._clickHandler.bind(this);
        if(this._element) { this._init(); }
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        this._element.addEventListener('click', this._clickEvHandler);
    }

    // 1.2 - Dispose Object and Remove eventlisteners
    _destroy(){
        this._element.removeEventListener('click', this._clickEvHandler);
        super.dispose();
    }

    // 1.3 - Handle click
    _clickHandler(){
        let targetId:any = this._element.getAttribute('data-scrolltotarget');
        let targetEl:any = document.querySelector(`[data-scrolltotargetid='${targetId}']`) || null;
        if(targetEl != null){
            // let targetElOffsetTop = targetEl.offsetTop;
            // let headerEl = document.querySelector('.c-app__header');
            // let headerHeight = headerEl.getBoundingClientRect().height;
            // let scrollValue = targetElOffsetTop - headerHeight + (window.innerHeight/2);

            const elementRect:any = targetEl.getBoundingClientRect();
            const absoluteElementTop:any = elementRect.top + window.pageYOffset;
            const scrollValue:any = absoluteElementTop - (window.innerHeight / 2);
            
            document.body.scrollTo(0, scrollValue); //for Safari
            document.scrollingElement!.scrollTo(0, scrollValue); //for other browsers
            // targetEl.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
            targetEl.setAttribute('tabindex','0');
            targetEl.focus();

            setTimeout(()=>{
                targetEl.setAttribute('tabindex','-1');
            },1000)
        }
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static initInterface(element:HTMLElement) {
        const context:scrolltoanywhere = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new scrolltoanywhere(element);
    }
}

export default scrolltoanywhere;

// Function to create instances
export const scrolltoINIT = () =>{

    // NOTE: CALL THIS ON ngAfterViewInit()
    let scrolltoEls = [].slice.call(document.querySelectorAll('[data-scrolltotarget]') as NodeListOf<HTMLElement> ) || [];
    let elements = scrolltoEls.map((item:HTMLElement) => scrolltoanywhere.initInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}