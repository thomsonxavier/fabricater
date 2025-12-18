import BaseClass from "../../utils/base-class";
import Context from "../../utils/context";

const COMPONENT_KEY:string = 'ad_carousel';

interface Options {
  dots: boolean;
  slide?: string | null;
}

export class Adcarousel extends BaseClass {
  _container:HTMLElement | null = null;
  _previousButton:HTMLButtonElement | null = null;
  _nextButton:HTMLButtonElement |  null = null;
  _activeElement:HTMLElement | null = null;
  _listitems: HTMLElement[] = [];
  _dots:HTMLElement | null = null;
  _totalPages:number = 0;
  _currentItem:number = 0;
  _isAnimating:boolean = false;
  _options:Options = {dots: false, slide: 'page'};

  _prevarrowEvHandler:EventListener = this._prevarrowHandler.bind(this);
  _nextarrowEvHandler:EventListener = this._nextarrowHandler.bind(this)
  _resizeEvHandler:EventListener = this._resizeHandler.bind(this);
  _scrollendEvHandler:EventListener = this._scrollendHandler.bind(this);
  _indicatorsEvHandler:EventListener = this._indicatorsHandler.bind(this);
  _resetEvHandler:EventListener = this._resetHandler.bind(this);

  constructor(element:HTMLElement) {
    super(element);
    this._declarations();
  }

  // 0.1 - declarations (Initialization of declared properties)
  _declarations() {
    this._container = this._element.querySelector('.c-adcarousel__list');
    this._previousButton = this._element.querySelector('.c-adcarousel__left');
    this._nextButton = this._element.querySelector('.c-adcarousel__right');
    this._activeElement = this._element.querySelector('.c-adcarousel__item.-active') || null;

    this._listitems = Array.from(this._element.querySelectorAll('.c-adcarousel__item') as NodeListOf<HTMLElement>) || [];
    this._dots = null;
    this._totalPages = 0;
    this._currentItem = 0;
    this._isAnimating = false;
    this._options = Object.assign({}, 
      { 
        dots: this._element.getAttribute('data-hasdots') === "true", 
        slide: this._element.getAttribute('data-slide') === "page" ? "page" : null
      }  
    ); //{dots: true | false, slide: 'page' | null}

    if (this._container && this._previousButton && this._nextButton && this._listitems.length > 0) {
      this._init();
    }
  }

  // Getter
  static get COMPONENT_KEY() {
    return COMPONENT_KEY;
  }

  // 
  // _getOptions() {
  //   let dotsval = this._element.getAttribute('data-hasdots') == "true" ? true : false;
  //   let slideval : string | null = this.

  //   return {dots: dotsval, slide: null as null}
  // }

  // 1.1 - Initialize Object and add eventlisteners
  _init() {
    this._previousButton?.addEventListener("click", this._prevarrowEvHandler);
    this._nextButton?.addEventListener("click", this._nextarrowEvHandler);
    this._container?.addEventListener("scrollend", this._scrollendEvHandler);
    window.addEventListener('resize', this._resizeEvHandler);
    this._element.addEventListener('data.reset', this._resetEvHandler);

    this._slide();
  }

  /** 1.2 - Dispose Object and Remove eventlisteners
   * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
   */
  _destroy(flag:boolean=true) {
    this._previousButton?.removeEventListener("click", this._prevarrowEvHandler);
    this._nextButton?.removeEventListener("click", this._nextarrowEvHandler);
    this._container?.removeEventListener("scrollend", this._scrollendEvHandler);
    window.removeEventListener('resize', this._resizeEvHandler);
    this._element.removeEventListener('data.reset', this._resetEvHandler);

    flag && super.dispose();
  }

  // 1.3 - Handle instance reset (reset and update all properties)
  _resetHandler() {
    this._destroy(false);
    this._declarations();
  }

  // 2.1 - Slide / Scroll to
  _slide(dir:any=undefined) {
    if (this._isAnimating) return;

    let containerWidth = this._container?.clientWidth || 0,
      scrollerWidth = this._container?.scrollWidth || 0,
      scrollerLeft = this._container?.scrollLeft || 0,
      scrollValue = 0,
      activePage = -1;

    this._totalPages = Math.ceil(scrollerWidth-20 / containerWidth) || 0;

    if (dir !== undefined) {

      if(dir === "left" || dir === "right") {
        dir === "left" ? this._currentItem-- : this._currentItem++;
      } else {
        this._currentItem = dir;
      }

      //check for < 0, > maxlen

      if (this._options.slide || Number(dir) >= 0) {
        if (this._currentItem === 0) {
          scrollValue = 0;
          activePage = 0;
        } else if (this._currentItem === (this._totalPages - 1)) {
          scrollValue = scrollerWidth - containerWidth;
          activePage = this._totalPages - 1;
        } else {     
          scrollValue = this._currentItem * containerWidth;
          activePage = this._currentItem;
        }

        if (!this._options.slide) {
          for(let i = 0; i < this._listitems.length; i++) {
            const { offsetLeft } = this._listitems[i];
            if (offsetLeft >= scrollValue) { 
              this._currentItem = i;
              break;
            }
          }
        }
      } else {
        const { offsetLeft } = this._listitems[this._currentItem];
        scrollValue = this._currentItem == 0 ? 0 : offsetLeft || 0; // scrollValue = offsetLeft || 0;
      }

    } else {
      scrollValue = this._activeElement ? this._activeElement.offsetLeft : 0 || 0;

      this._currentItem = 0;

      if (this._activeElement)
        this._currentItem = [].slice.call(this._listitems).indexOf(this._activeElement as never) || 0;
    }

    if(this._previousButton) this._previousButton.disabled = (scrollValue <= 0);
    if(this._nextButton) this._nextButton.disabled = (scrollValue >= scrollerWidth - (this._container?.clientWidth ?? 0) - 5);

    if (this._options.dots) {
      if (activePage < 0) activePage = (scrollValue <= 0) ? 0 : Math.floor((scrollValue + containerWidth - 5) / containerWidth);
      this._setDots(activePage);
    }            

    if(this._container) this._container.scrollLeft = scrollValue;
    
    /* console.log(`scrollerWidth: ${scrollerWidth} | containerWidth: ${containerWidth} | scrollValue: ${scrollValue} | dir: ${dir} | total: ${this._totalPages} | items: ${this._listitems.length} | currentPage: ${activePage + 1} | currentItem: ${this._currentItem}`); */
  }
  
  // 2.2 - Create indicators
  _setDots(page:any) {
    if (this._options.dots && !this._dots) {
      this._element.classList.add('has-dots');
      this._dots = document.createElement('div');
      this._dots.className = 'c-adcarousel__dots';
      this._element.appendChild(this._dots);

      for(let i = 0; i < this._totalPages; i++) {
        let indicatorButton = document.createElement('button');
        indicatorButton.setAttribute('aria-label', `Go to slide ${i + 1} of ${this._totalPages}`);
        if (page === i) { 
          indicatorButton.classList.add('active');
          indicatorButton.setAttribute('aria-current', 'true');
        }
        this._dots.appendChild(indicatorButton);
        indicatorButton.addEventListener("click", ()=>{
          this._slide(i);
        });
      }
    } else {
      const carouselIndicators = [].slice.call(this._element.querySelectorAll(`.c-adcarousel__dots button`)) || [];
      carouselIndicators.forEach((element:any, idx:any) => {
        if (page === idx) {
          element.classList.add('active');
          element.setAttribute('aria-current', 'true');
        } else {
          element.classList.remove('active');
          element.removeAttribute('aria-current');
        }
      });
    }
  }

  // 3.1 - Handle Window resize (refresh carousel and reset back to starting position)
  _resizeHandler() {
    if (this._options.dots) {
      this._dots?.remove();
      this._dots = null;
    }
    this._slide();
  }

  // 3.2.1 - Handle previous arrow click
  _prevarrowHandler() {
    this._slide('left');
    this._isAnimating = true;
  }

  // 3.2.2 - Handle next arrow click
  _nextarrowHandler() {
    this._slide('right');
    this._isAnimating = true;
  }

  // 3.3 - 
  _scrollendHandler() {
    this._isAnimating = false;
  }

  // 3.4 
  _indicatorsHandler() {
    
  }

  /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
  static adcarouselInterface(element:HTMLElement) {
    const context:Adcarousel = Context.get(element, COMPONENT_KEY);
    if(context) return context;
    return new Adcarousel(element);
  }
}

export const adCarouselINIT = ()=> {

  if(!document.querySelector('.c-adcarousel__wrap')){
    return;
  }

  // NOTE: CALL THIS ON ngAfterViewInit()
  let carousels = [].slice.call(document.querySelectorAll('.c-adcarousel__wrap:not(.-ignore)') as NodeListOf<HTMLElement>) || [];
  let elements = carousels.map((item:any) => Adcarousel.adcarouselInterface(item));
}