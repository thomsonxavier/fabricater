/* Imports */
import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

/* Unique Key */
const COMPONENT_KEY = 'rangeSlider_key'; //unique key

/**
 * IMPORTANT: WRITE A MUTATION OBSERVER TO OBSERVE VALUE CHANGE 
 * 
 */

/* Class */
export class RangeSlider extends BaseClass {

    constructor(element) {
        super(element);

        this._inputEvHandler = this._inputHandler.bind(this);
        this._resetEvHandler = this._resetHandler.bind(this);
        if(this._element) { this._init(); }
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        this._inputHandler();
        
        this._element.addEventListener('data.reset', this._resetEvHandler );
        this._element.addEventListener('data.update', this._inputEvHandler );
        this._element.addEventListener('change', this._inputEvHandler );
        this._element.addEventListener('input', this._inputEvHandler );

        this._observeElement(this._element, "value", (oldValue, newValue) => {
            // console.log("Input value changed. Value changed from '%s' to '%s'", oldValue, newValue);
            this._inputHandler();
        });
    }

    // 1.2 - Dispose Object and Remove eventlisteners
    _destroy(){
        this._element.removeEventListener('data.reset', this._resetEvHandler );
        this._element.removeEventListener('data.update', this._inputEvHandler );
        this._element.removeEventListener('change', this._inputEvHandler );
        this._element.removeEventListener('input', this._inputEvHandler);
        super.dispose();
    }

    //2.1 Mutation observer
    _observeElement(element, property, callback, delay = 0) {
        let elementPrototype = Object.getPrototypeOf(element);
        if (elementPrototype.hasOwnProperty(property)) {
            let descriptor = Object.getOwnPropertyDescriptor(elementPrototype, property);
            Object.defineProperty(element, property, {
                get: function() {
                    return descriptor.get.apply(this, arguments);
                },
                set: function () {
                    let oldValue = this[property];
                    descriptor.set.apply(this, arguments);
                    let newValue = this[property];
                    if (typeof callback == "function") {
                        setTimeout(callback.bind(this, oldValue, newValue), delay);
                    }
                    return newValue;
                }
            });
        }
    }

    // 2.2 -- Akternate observer - redundant
    _mutationObserver(){
        const value = new MutationObserver(function(mutations) {
            mutations.forEach((mutationRecord)=>{
                console.log(mutationRecord)
            });
        });
        const currentValue = mutations[0].target.value;
        if (currentValue !== value) {
            console.log('value changed', currentValue, value)
        }
        value.observe(this._element, { attributes: true, attributeFilter: ['value'], });
    }


    // 3.1 - Handle input
    _inputHandler(){
        const min = this._element.getAttribute('min');
        const max = this._element.getAttribute('max');
        const value = this._element.value;
        let ans = value;
        if(min && max) {
            ans = (value / parseInt(max)) * 100;
        }
        ans = Math.round((ans + Number.EPSILON) * 100) / 100;

        ans = ans > 100 ? 100 : ans;
        ans = ans < 0 ? 0 : ans; 

        this._element.style.setProperty('--range-size',`${ans}%`);
    }

    // 3.2 - reset
    _resetHandler(){
        this._element.value = 0;
        this._inputHandler();
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static initInterface(element) {
        let context = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new RangeSlider(element);
    }
}


// Function to create instances
export const rangeSliderINIT = () =>{

    // NOTE: CALL THIS ON ngAfterViewInit()
    let rangeSliderEls = [].slice.call(document.querySelectorAll('.o-rangeslider')) || [];
    let elements = rangeSliderEls.map(item => RangeSlider.initInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}