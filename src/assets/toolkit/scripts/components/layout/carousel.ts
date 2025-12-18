import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";
import {
    getFocusableChildren
  } from '../../utils/utilities';
  
const COMPONENT_KEY:string = 'carousel';
interface TimelineConfig {
    TimelineContainerWidth: number,
    TimelineDScrollerWidth: () => number, 
    TimelineScrollerLeft: number,
    TimelineHidden: () => number,
    TimelineIndicators: () => number
};  

export class Carousel extends BaseClass {
    _timelineContainer:HTMLElement;
    _timelineScroller:HTMLElement;
    _indicatorsContainer:HTMLElement;
    _cards:HTMLElement[];
    _lastCard:HTMLElement;
    _timelineConfig:TimelineConfig;
    _hasIndicators:boolean;
    _hasFocusableCards:boolean;
    _indicators:HTMLElement[];
    _prevBtn:HTMLElement[];
    _nextBtn:HTMLElement[];
    _hasArrows:boolean;
    _isReverse:boolean;
    _haschildren:boolean;
    _arrowsEvHandler:EventListener = this._arrowHandler.bind(this);
    _indicatorsEvHandler:EventListener = this._indicatorsHandler.bind(this);
    _resizeEvHandler:EventListener = this._resizeHandler.bind(this);
    _initializeEvHandler:EventListener = this._initHandler.bind(this);
    _resetEvHandler:EventListener = this._resetHandler.bind(this);
    _timeOut:number = 450;

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
        this._timelineContainer = this._element.querySelector('.c-carousel__scroller');
        this._timelineScroller = this._element.querySelector('.c-carousel__scroller .c-carousel__scroller-area');
        this._indicatorsContainer = this._element.querySelector('.c-carousel__indicators-container') || null;

        this._updateTimeline();

        this._hasIndicators = this._element.querySelector('.c-carousel__indicators-container') ? true : false;
        this._hasFocusableCards = this._checkForFocusableCards(); 

        this._indicators = [].slice.call(this._element.querySelectorAll('.c-carousel__indicator')) || [];
        this._prevBtn = Array.from(this._element.querySelectorAll('.c-carousel__scroll-block-prev')) || [];
        this._nextBtn = Array.from(this._element.querySelectorAll('.c-carousel__scroll-block-next')) || [];
        this._hasArrows = ( this._prevBtn.length > 0 || this._nextBtn.length > 0 ) ? true : false;

        this._isReverse = this._element.classList.contains('-reverse');
        this._haschildren = this._element.getAttribute('data-haschildren') == 'true' ? true : false;

        if(this._element) { this._init(); }
    }

    // 0.2
    _updateTimeline(){
        this._cards = Array.from(this._timelineScroller.querySelectorAll(':scope > *')) || []
        this._lastCard = this._timelineScroller.querySelector(':scope > :last-child') as HTMLElement;
        
        this._timelineConfig = {
            TimelineContainerWidth: Number.parseInt(`${this._timelineScroller.clientWidth}`, 10) || 0,
            TimelineDScrollerWidth: ()=>{
                if(Number.parseInt(`${this._timelineScroller.scrollWidth}`, 10) > Number.parseInt(`${this._timelineScroller.clientWidth}`, 10)){
                    return Number.parseInt(`${this._timelineScroller.scrollWidth}`, 10) + ( Number.parseInt(window.getComputedStyle(this._lastCard).marginRight) ?? 0 ) || 0 ;
                }
                else{
                    return Number.parseInt(`${this._timelineScroller.scrollWidth}`, 10);
                }
            }, 
            TimelineScrollerLeft: Number.parseInt(`${this._timelineScroller.offsetLeft}`, 10) || 0,
            TimelineHidden: function(){
                return (this.TimelineDScrollerWidth() + this.TimelineScrollerLeft) - this.TimelineContainerWidth;
            },
            TimelineIndicators: function(){
                return Math.ceil( (this.TimelineDScrollerWidth() - 20) / this.TimelineContainerWidth);
            }
        }; 
    }

    // 0.3
    _updateIndicators(){
        this._indicators = [].slice.call(this._element.querySelectorAll('.c-carousel__indicator')) || [];
    }

    // 0.4
    _checkForFocusableCards(){
        return true;
        // if([...this._timelineScroller.querySelectorAll( 'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])' )]
        //     .filter(el => !el.hasAttribute('disabled'))
        //     .filter(el => !el.classList.contains('-disabled')).length > 0){

        //     return true;
        // }
        // return false;
    }

    //0.5 - Scroll to the last page
    _scrollToLastPage() {
        const amountToScroll = Math.min(this._timelineConfig.TimelineContainerWidth * (this._indicators.length - 1), (this._timelineConfig.TimelineDScrollerWidth() - this._timelineConfig.TimelineContainerWidth) );
        this._timelineScroller.style.left = -amountToScroll+'px';
        this._haschildren && this._handlechildren(amountToScroll);
        console.log(amountToScroll);

        setTimeout(()=>{ this._setTimeline(); this._updateCards(); if(this._hasIndicators){this._setIndicators();} }, this._timeOut);
    }

    // 1.1 - Initialize Object and add eventlisteners
    _init(){
        if(this._hasIndicators){
            const staticIndicators:boolean = (this._indicatorsContainer.getAttribute('data-indicators') === 'hidden');
            this._createIndicators();
            !staticIndicators && this._indicators.forEach((item:any)=>{ item.addEventListener('click', this._indicatorsEvHandler); });
        }
        
        this._hasArrows && [ ...this._prevBtn, ...this._nextBtn ].forEach((item)=>{ item.addEventListener('click', this._arrowsEvHandler); });

        document.body.addEventListener('data.myw.init', this._initializeEvHandler);
        this._element.addEventListener('data.carousel.init', this._initializeEvHandler);
        this._element.addEventListener('data.carousel.reset', this._resetEvHandler);
        window.addEventListener('resize', this._resizeEvHandler);

        this._setTimeline(true);
        this._updateCards();

        if(this._isReverse) {
            this._scrollToLastPage();
        }
    }

    /** 1.2 - Dispose Object and Remove eventlisteners
     * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
     */
    _destroy(flag:boolean=true){
        this._indicators.forEach((item:any)=>{ item.removeEventListener('click', this._indicatorsEvHandler); });
        this._hasArrows && [ ...this._prevBtn, ...this._nextBtn ].forEach((item)=>{ item.removeEventListener('click', this._arrowsEvHandler); });
        document.body.removeEventListener('data.myw.init', this._initializeEvHandler);
        this._element.removeEventListener('data.carousel.init', this._initializeEvHandler);
        this._element.removeEventListener('data.carousel.reset', this._resetEvHandler);
        window.removeEventListener('resize', this._resizeEvHandler);

        flag && super.dispose();
    }

    // 1.3 - Initialize / Update the carousel status when required - (for example, when an accordion opens and has a carousel inside)
    _initHandler(event:any){
        if(event.target.contains(this._element) || event.target == this._element){
            this._resizeHandler();
        }
    }

    // 1.4 - Reset everything in the instance and force update the carousel - (NOT BEING USED)
    _resetHandler() {
        this._destroy(false);
        this._declarations();
    }

    // 2.1 - Create Indicators whenever required (on initialize or resize)
    _createIndicators(){
        // Remove present Indicators
        const element = this._indicatorsContainer.querySelector('.c-carousel__indicators-wrap') || null;
        element && this._indicatorsContainer.removeChild(element);

        const staticIndicators:boolean = (this._indicatorsContainer.getAttribute('data-indicators') === 'hidden'); //Should Indicators be clickable / static
        const carouselIndicator__wrap:HTMLDivElement = document.createElement('div');
        carouselIndicator__wrap.classList.add('c-carousel__indicators-wrap');

        for(let i=0; i < this._timelineConfig.TimelineIndicators(); i++){
            const indicator:HTMLElement = staticIndicators ? document.createElement('div') : document.createElement('a');
            indicator.classList.add('c-carousel__indicator');
            
            !staticIndicators && indicator.setAttribute('href','javascript:;');
            !staticIndicators && indicator.setAttribute('role','button');
            !staticIndicators && indicator.setAttribute('tabindex','0');
            !staticIndicators && indicator.setAttribute('title', `Go to Page ${i+1}`)

            if(i==0){
                indicator.classList.add('-active');
                !staticIndicators && indicator.setAttribute('tabindex','-1');
            }
            carouselIndicator__wrap.appendChild(indicator);            
        }
        this._indicatorsContainer.appendChild(carouselIndicator__wrap);

        this._updateIndicators();
    }

    // 2.2 - handle indicators click
    _indicatorsHandler(event:any){
        this._updateTimeline();

        const el:HTMLElement = event.currentTarget;
        const staticIndicators:boolean = (this._indicatorsContainer.getAttribute('data-indicators') === 'hidden');
        const activeIndicator = this._indicatorsContainer.querySelector('.c-carousel__indicator.-active') as HTMLElement;
        activeIndicator!.classList.remove('-active');
        !staticIndicators && activeIndicator!.setAttribute('tabindex', '0')
        el.classList.add('-active');
        !staticIndicators && el.setAttribute('tabindex', '-1')

        const index:number = this._indicators.indexOf(el);

        const amountToScroll:number = Math.min(this._timelineConfig.TimelineContainerWidth * index, (this._timelineConfig.TimelineDScrollerWidth() - this._timelineConfig.TimelineContainerWidth) );
        // console.log(this._timelineConfig.TimelineContainerWidth * index, (this._timelineConfig.TimelineDScrollerWidth() - this._timelineConfig.TimelineContainerWidth), this._timelineConfig.TimelineDScrollerWidth(), this._timelineConfig.TimelineContainerWidth  )
        // if(index == this._indicators.length - 1) { amountToScroll += 10; } 
        // if(index == 0) { amountToScroll = 0; }
        // let amountToScroll = this._timelineConfig.TimelineContainerWidth * index;
        
        this._timelineScroller.style.left = -amountToScroll+'px';
        this._haschildren && this._handlechildren(amountToScroll);

        setTimeout(()=>{ this._setTimeline(); this._updateCards(); }, this._timeOut);
    }

    // 2.3 - handle arrow click
    _arrowHandler(event:any){
        this._updateTimeline();

        const el:HTMLElement = event.currentTarget;
        const TimelineDirection:string = el.classList.contains('c-carousel__scroll-block-next')? 'right' : 'left';  
        const TimelinePositionLeft:number = this._timelineConfig.TimelineScrollerLeft;
        let amountToScroll:number;

        if (TimelineDirection==="right") {
            // console.log(this._timelineConfig.TimelineHidden(), this._timelineConfig.TimelineContainerWidth, this._timelineConfig.TimelineDScrollerWidth());
            amountToScroll = -(Math.abs(TimelinePositionLeft) + Math.min(this._timelineConfig.TimelineHidden(), this._timelineConfig.TimelineContainerWidth));
        } 
        else {
            amountToScroll = Math.min(0, (this._timelineConfig.TimelineContainerWidth + TimelinePositionLeft));
        }
        this._timelineScroller.style.left = amountToScroll+'px';
        this._haschildren && this._handlechildren(amountToScroll);
        setTimeout(()=>{ 
            this._setTimeline(); 
            this._updateCards();
            if(this._hasIndicators){this._setIndicators();}
        }, this._timeOut);
    }

    // 2.4 - update indicators on arrow key events
    _setIndicators(){
        const staticIndicators = (this._indicatorsContainer.getAttribute('data-indicators') === 'hidden'); //Should Indicators be clickable / static
        this._indicators.forEach( (el:HTMLElement) => { 
            el.classList.remove('-active');
            !staticIndicators && el.setAttribute('tabindex','0');
        });
        let index:number = Math.ceil(Math.abs(this._timelineConfig.TimelineScrollerLeft) / this._timelineConfig.TimelineContainerWidth);
        if(index < 0) index = 0;
        this._indicators[index].classList.add('-active');
        !staticIndicators && this._indicators[index].setAttribute('tabindex','-1');
    }

    // 2.5 - Function to update Arrows
    _setTimeline(init=false){
        this._updateTimeline();

        //enable/disable prev,next
        if(this._hasArrows){
            // this._nextBtn.forEach((item:any)=>{item.classList.toggle('disabled', (this._timelineConfig.TimelineHidden() <= 1));})
            // this._prevBtn.forEach((item:any)=>{item.classList.toggle('disabled', (this._timelineConfig.TimelineScrollerLeft >=-1));})
            
            if(this._timelineConfig.TimelineHidden() <= 1) { this._nextBtn.forEach((item:any)=>{item.disabled = true; item.setAttribute('tabindex','-1'); item.setAttribute('aria-disabled','true'); }) } 
            else { this._nextBtn.forEach((item:any)=>{item.disabled = false; item.setAttribute('tabindex','0'); item.setAttribute('aria-disabled','false'); }) }
            
            if(this._timelineConfig.TimelineScrollerLeft >=-1) { this._prevBtn.forEach((item:any)=>{item.disabled = true; item.setAttribute('tabindex','-1'); item.setAttribute('aria-disabled','true'); }) } 
            else { this._prevBtn.forEach((item:any)=>{item.disabled = false; item.setAttribute('tabindex','0'); item.setAttribute('aria-disabled','false'); }) }
        }

        if(init && this._indicators.length > 0){
            // Initialize Indicators
            this._indicators.forEach((el:any)=>{el.classList.remove('-active');}); 
            this._indicators[0].classList.add('-active');
        }
    }
 
    /**
     * 2.6 - Update the cards on the carousel (for accessibility)
     * @param setfocus:boolean 
     * If setfocus is set to true, focus will be applied to the first visible card after scroll
     */
    _updateCards(setfocus = false) {
        if(!this._timelineScroller.querySelector('.c-carousel__scroller-card')) return;

        const activePage = Math.ceil(Math.abs(this._timelineConfig.TimelineScrollerLeft) / this._timelineConfig.TimelineContainerWidth);
        const sampleEl = this._timelineScroller.querySelector('.c-carousel__scroller-card') as HTMLElement; 
        let widthOfCard:number;
        if(sampleEl) {
            widthOfCard = sampleEl.offsetWidth;
            const sampleStyle:CSSStyleDeclaration = window.getComputedStyle(sampleEl);
            widthOfCard = widthOfCard + parseFloat(sampleStyle.marginLeft) +  parseFloat(sampleStyle.marginRight);
        }
        else {
            return;
        }
        // let cardsPerPage = Math.ceil((this._timelineConfig.TimelineContainerWidth) / widthOfCard);
        let cardsPerPage:number = Math.floor((this._timelineConfig.TimelineContainerWidth) / widthOfCard);
        if(cardsPerPage < 1) { cardsPerPage = 1; }

        const targetArray:HTMLElement[] = Array.from(this._timelineScroller.querySelectorAll('.c-carousel__scroller-card')) || [];

        let lowerLimit:number = 0 + (activePage * cardsPerPage);
        let upperLimit:number = cardsPerPage + (activePage * cardsPerPage);
        let buffer:number = 0;

        if(upperLimit > (targetArray.length)) {
            buffer = upperLimit - targetArray.length;
        }

        lowerLimit -= buffer; upperLimit -= buffer;

        targetArray.forEach((el:any)=> {
            el.setAttribute('aria-hidden','true');

            const arr:HTMLElement[] = getFocusableChildren(el);
            arr.forEach((item)=>{
                item.setAttribute('aria-hidden','true');
                item.setAttribute('tabindex', '-1');            
            })
        });
        targetArray.slice(lowerLimit, upperLimit).forEach((el:any)=> {
            el.setAttribute('aria-hidden','false');

            const arr:HTMLElement[] = getFocusableChildren(el);
            arr.forEach((item)=>{
                item.setAttribute('aria-hidden','false');
                item.setAttribute('tabindex', '0');            
            })
        });
    }

    // 2.7 - If there are other carousels controlled by the same element, update them
    _handlechildren(amountToScroll:number) {
        const targetId:string = this._element.getAttribute('data-targetid') || 'null';
        const dependents:HTMLElement[] = Array.from(document.querySelectorAll(`[data-id="${targetId}"]`) as NodeListOf<HTMLElement> );
        dependents.forEach((item:HTMLElement)=>{
            item.style.left = `${amountToScroll}px`;
        });
    }

    // 3 - Handle window resize (Reset carousel position back to 0)
    _resizeHandler(){
        if(this._isReverse) {
            const amountToScroll = Math.min(this._timelineConfig.TimelineContainerWidth * (this._indicators.length - 1), (this._timelineConfig.TimelineDScrollerWidth() - this._timelineConfig.TimelineContainerWidth) );
            this._timelineScroller.style.left = -amountToScroll+'px'; 
            this._haschildren && this._handlechildren(amountToScroll);
        }
        else {
            this._timelineScroller.setAttribute('style',`left : 0px`);
            this._haschildren && this._handlechildren(0);
        }

        this._updateTimeline();

        if(this._hasIndicators){
            const staticIndicators:boolean = (this._indicatorsContainer.getAttribute('data-indicators') === 'hidden');
            this._indicators.forEach((item:any)=>{ item.removeEventListener('click', this._indicatorsEvHandler); });
            this._createIndicators();
            !staticIndicators && this._indicators.forEach((item:any)=>{ item.addEventListener('click', this._indicatorsEvHandler); });
        }

        setTimeout(()=>{ this._setTimeline(true); this._updateCards(); this._updateIndicators(); }, this._timeOut);
    }

    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with the parameter bound to _element
     */
    static carouselInterface(element:HTMLElement) {
        const context:Carousel = Context.get(element, COMPONENT_KEY);
        if(context) return context;
        return new Carousel(element);
    }
}

export const carouselINIT = () =>{
    if(!document.querySelector('.c-carousel__wrap')){
        return;
    }

    // NOTE: CALL THIS ON ngAfterViewInit()
    let carousels = [].slice.call(document.querySelectorAll('.c-carousel__wrap:not(.-ignore)') as NodeListOf<HTMLElement>) || [];
    let elements = carousels.map((item:any) => Carousel.carouselInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
    
    // console.log(carousels, elements);
    // setTimeout(() => {
    //     // elements.forEach((item)=> item._init());
    // }, 10000);
}
 