/* Imports */
import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";
import { getFocusableChildren } from "../../utils/utilities";

/* Unique Key */
const COMPONENT_KEY = 'arcRmCarousel_key'; //unique key

/* Class */
export class arcRmCarouselElement extends BaseClass {

    constructor(element) {
        super(element);

        this._wrapper = this._element.querySelector('.c-rmslider__container');
        this._prevbtn = this._element.querySelector('.c-rmslider__prevbtn');
        this._nextbtn = this._element.querySelector('.c-rmslider__nextbtn');
        this._container = this._element.querySelector('.c-rmslider__list');
        this._cards = Array.from(this._container.querySelectorAll('.c-rmslider__item')) || [];

        this._currentIndex = 0;
        this._prevIndex = (this._cards.length - 1) || null;
        this._nextIndex = 1;

        this._updateHandler = this._updateValues.bind(this);
        this._resizeEvHandler = this._resizeHandler.bind(this);
        this._arrowsEvHandler = this._arrowHandler.bind(this);

        if(this._element) { this._init(); }
    }

    // Getter
    static get COMPONENT_KEY() {
        return COMPONENT_KEY;
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        this._updateValues();
        [ this._prevbtn, this._nextbtn ].forEach((item)=>{ item.addEventListener('click', this._arrowsEvHandler); });
        this._element.addEventListener('data.carousel.reset', this._updateHandler);
        window.addEventListener('resize', this._resizeEvHandler);
    }

    // 1.2 - Dispose Object and Remove eventlisteners
    _destroy(){
        [ this._prevbtn, this._nextbtn ].forEach((item)=>{ item.removeEventListener('click', this._arrowsEvHandler); });
        this._element.removeEventListener('data.carousel.reset', this._updateHandler);
        window.removeEventListener('resize', this._resizeEvHandler);

        super.dispose();
    }

    // 1.3 - Handle window resize
    _resizeHandler(){
        this._updateCards(0);
    }

    // 1.4 - Update values
    _updateValues(){
        // reset values
        this._cards = Array.from(this._container.querySelectorAll('.c-rmslider__item')) || [];
        if(! this._cards.length > 0) return;

        this._currentIndex = 0;
        this._prevIndex = (this._currentIndex- 1) >= 0 ? this._currentIndex - 1 : this._cards.length - 1;
        this._nextIndex = (this._currentIndex + 1) <= (this._cards.length - 1) ? this._currentIndex + 1 : 0;

        this._updateCards(this._currentIndex);
    }
    
    // 1.5 - set base indices and update card attributes
    _updateCards(index){
        if (index < 0) index = this._cards.length - 1;
        if (index > this._cards.length - 1) index = 0;

        this._currentIndex = index;
        this._prevIndex = (index - 1) >= 0 ? index - 1 : this._cards.length - 1;
        this._nextIndex = (index + 1) <= (this._cards.length - 1) ? index + 1 : 0;

        // reset cards
        this._cards.forEach((item)=>{
            item.classList.remove('-active', '-prev', '-next');
            item.setAttribute('aria-hidden', 'true');
            let arr = getFocusableChildren(item);
            arr.forEach((item)=>{
                item.setAttribute('aria-hidden','true');
                item.setAttribute('tabindex', '-1');            
            })
        });

        // update previous and next in line cards
        this._cards[this._prevIndex].classList.add('-prev');
        this._cards[this._nextIndex].classList.add('-next');

        // update active card
        this._cards[this._currentIndex].classList.add('-active');
        this._cards[this._currentIndex].setAttribute('aria-hidden', 'false');
        let arr = getFocusableChildren(this._cards[this._currentIndex]);
        arr.forEach((item)=>{
            item.setAttribute('aria-hidden','false');
            item.setAttribute('tabindex', '0');            
        });


        // call set position method
        this._setPosition(this._currentIndex);
    }

    // 2.1 - calculate and update card positions -- NOTE: (IMPORTANT) indexing is wrong if currentIndex is the last element, chek back
    _setPosition(index){
        var upperlimit = 2; //hardcoded - make it dynamic if required
        var lowerlimit = Math.ceil(this._cards.length / 2);
        var buffer = 1;

        let replicaArr = [];
        for(let i = index; i < this._cards.length; i++) {
            replicaArr.push(this._cards[i]);
        }
        for(let i = 0; i < index; i++) {
            replicaArr.push(this._cards[i]);
        }
        index = 0;
        replicaArr.forEach((item, loopindex)=>{
            if(loopindex < index) { index = loopindex - index; } //if currentIndex is something other than 0, assign negative positioning for the relevant cards

            item.setAttribute("data-position", index);
            this._moveToTarget(index, item);
            index = index + 1;
            
            if(index > upperlimit) {                //Assign negative positioning for the relevant cards after the middle card
                index = - (lowerlimit);
                index = index + buffer;
                buffer += 1;
            }
        });
    }

    // 2.2 - set card positions
    _moveToTarget(pos, item){
        var sliderRect = parseInt(this._container.getAttribute('data-inactivewidth')) || this._wrapper.getBoundingClientRect().width;
        var sliderGap = parseInt(window.getComputedStyle(this._container).getPropertyValue('column-gap')) || 24;
        var buffer = (sliderRect + sliderGap)
        var leftVal = pos == 0 ? 0 : buffer;

        leftVal = leftVal * -pos;
        if(item.classList.contains('-prev')) leftVal = + buffer;
        if(item.classList.contains('-next')) leftVal = - buffer;

        item.style.transform = `translate3d(${leftVal}px, 0, 0)`;
    }

    // 3.1 - click handler
    _arrowHandler(event){
        if(event.currentTarget == this._prevbtn) {
            this._updateCards(--this._currentIndex);
        }
        else {
            this._updateCards(++this._currentIndex);
        }
    }

    // Static Interface to create Instances
    static initInterface(element) {
        let context = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new arcRmCarouselElement(element);
    }
}


// Function to create instances
export const arcRmCarouselINIT = () =>{
    // NOTE: CALL THIS ON ngAfterViewInit()
    let arcRmCarouselEls = [].slice.call(document.querySelectorAll('.c-rmslider__wrap')) || [];
    let elements = arcRmCarouselEls.map(item => arcRmCarouselElement.initInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}