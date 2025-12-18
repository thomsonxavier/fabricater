/* Tabs */

import {
  isElementDisabled
} from '../../utils/utilities';
import Context from '../../utils/context';
import BaseClass from '../../utils/base-class';
import Selectors from '../../utils/selectors';

const COMPONENT_KEY:string = 'tabs';
const OPEN_CLASS:string = '-show';

export class Tabs extends BaseClass {

  _clickEvHandler:MethodDecorator = this.show.bind(this);
  _tabkeyEvHandler:(event: KeyboardEvent) => void = this._tabKeyHandler.bind(this);

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

  // 0.2 - Initialize Object and add eventlisteners
  _init() {
    this._element.addEventListener('click', this._clickEvHandler);
    this._element.addEventListener('keydown', this._tabkeyEvHandler);
  }

  /** 0.3 - Dispose Object and Remove eventlisteners
    * @param flag - if set to true, destoys the instance, and removes it from the Map (refer context.ts)
  */
  _destroy(flag:boolean=true) {
    this._element.removeEventListener('click', this._clickEvHandler);
    this._element.removeEventListener('keydown', this._tabkeyEvHandler);

    flag && super.dispose();
  }

  // 1.1 - Show Tabs
  show() {
    if (
        // (
        //   this._element.parentNode &&
        //   this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
        //   this._element.hasAttribute('aria-controls')  &&
        //   (this._element.getAttribute('aria-selected') === 'true')
        // ) 
        // ||
        isElementDisabled(this._element)
      ) {
      return;
    }

    const parentElement = this._element.closest('[role="tablist"]');

    if (parentElement) {
      const tabElements:HTMLElement[] = Selectors.children(parentElement, '[role="tab"]');
      const currentIndex:number = tabElements.indexOf(this._element) || 0;

      //console.log(`parentElement: ${parentElement} | tabElements: ${tabElements} | currentIndex: ${currentIndex}`)

      tabElements.map((tab:HTMLElement, index:number) => {
        let tabPanelID:string | null = tab.hasAttribute('aria-controls') ? tab.getAttribute('aria-controls') : null;

        let tabPanel:HTMLElement | null = null;
        if(tabPanelID) tabPanel = document.getElementById(tabPanelID);

        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
        tabPanel!.classList.remove(OPEN_CLASS);

        if (tabPanel && currentIndex === index) {
          tabPanel.classList.add(OPEN_CLASS);

          // Fire Initialize event
          tabPanel.dispatchEvent(new Event('data.myw.init',{bubbles: true}));

          /* let manualTriggers = [].slice.call(tabPanel.querySelectorAll('.-prev-tab[data-id], .-next-tab[data-id]')) || [];
          manualTriggers.forEach((ele) => {
            let triggerId = ele.getAttribute('data-id') || null,
              targetedTab = document.querySelector(`[role="tab"][aria-controls="${triggerId}"]`);
            if (targetedTab) {
              ele.addEventListener('click', function (event) {
                let targetedTabContext = Context.get(targetedTab, COMPONENT_KEY) || new Tabs(targetedTab);
                targetedTabContext.show();
              }, { once: true });
            }
          }); */
        }
      });

      this._element.setAttribute('aria-selected', 'true');
      this._element.setAttribute('tabindex','0')
      this._element.focus();
    }

    this._element.dispatchEvent(new Event('tabs.open'));
  }

  // 1.2 - Handle keyboard actions on Tabs
  _tabKeyHandler(event:KeyboardEvent) {
    const parentElement:HTMLElement = this._element.closest('[role="tablist"]');

    if (parentElement) {
      const isVertical:boolean = parentElement.classList.contains('-vertical');
      const tabElements:HTMLElement[] = Selectors.children(parentElement, '[role="tab"]:not(:disabled):not(.-disabled)');

      let currentIndex:number = tabElements.indexOf(this._element) || 0,
      targetTab:Tabs;

      switch (event.key) {
        case 'End':
          event.preventDefault();
          targetTab = Context.get(tabElements[tabElements.length - 1], COMPONENT_KEY);
          if (targetTab) targetTab.show();
          break;
        case 'Home':
          event.preventDefault();
          targetTab = Context.get(tabElements[0], COMPONENT_KEY);
          if (targetTab) targetTab.show();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          if (
            event.key === 'ArrowLeft' && isVertical ||
            event.key === 'ArrowUp' && !isVertical
          ) break;
          // activate previous tab or last tab (if first tab was selected)
          currentIndex = (currentIndex === 0) ? (tabElements.length - 1) : (currentIndex - 1);
          targetTab = Context.get(tabElements[currentIndex], COMPONENT_KEY) || new Tabs(tabElements[currentIndex]);
          if (targetTab) targetTab.show();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          if (
            event.key === 'ArrowRight' && isVertical ||
            event.key === 'ArrowDown' && !isVertical
          ) break;
          // activate next tab or first tab (if last tab was selected)
          currentIndex = (currentIndex === (tabElements.length - 1)) ? 0 : (currentIndex + 1);
          targetTab = Context.get(tabElements[currentIndex], COMPONENT_KEY) || new Tabs(tabElements[currentIndex]);
          if (targetTab) targetTab.show();
          break;
        default:
          break;
      }
    }
  }

  /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
  static initInterface(element:HTMLElement) {
    const context = Context.get(element, COMPONENT_KEY);
    if(context) return context;
    return new Tabs(element);
}
}

export const tabsComponent = () => {
  const tabsComponents = [].slice.call(document.querySelectorAll('.c-tabs__wrap[role="tablist"] [role="tab"]') as NodeListOf<HTMLElement>) || [];
  const tabels:Tabs[] = tabsComponents.map((item:any) => Tabs.initInterface(item));
};
