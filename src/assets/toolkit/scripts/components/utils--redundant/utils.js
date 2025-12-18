/** 
 * Utilities
 * */

export const COMPONENT_PREFIX = 'toolkit';
export const OPEN_CLASS = 'open';
export const SHOW_CLASS = 'show';
export const ACTIVE_CLASS = 'is-active';
export const TRANSITION_CLASS = 'is-transition';

export const Utils = {
  /**
   * Shoutout AngusCroll (https://goo.gl/pxwQGp)
   * 
   * @param {Object} obj 
   * @returns {Type}   
   */
  toType(obj) {
    if (obj === null || obj === undefined) {
      return `${obj}`
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
  },

  /**
   * Generate unique ID
   * 
   * @param {prefix} prefix for ID 
   * @returns {String}
   */
  getUID(prefix) {
    do {
      prefix += Math.random().toString(36).substr(2, 9);
    } while (document.getElementById(prefix))
  
    return prefix
  },

  /**
   * Check if element is disabled
   * 
   * @param {Element} element
   * @returns {Boolean}
   */
  isDisabled(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
    
    if (element.classList.contains('disabled')) return true;

    if (typeof element.disabled !== 'undefined') return element.disabled;

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  },

  /**
   * Set the focus to the first element with `autofocus` or the first focusable child of the given element
   * 
   * @param {Element} element
   */
  setFocusToFirstItem(element = document) {
    let focusableChildren = this.getFocusableChildren(element);
    let focused = element.querySelector('[autofocus]') || focusableChildren[0];
  
    if (focused) {
      focused.focus();
    }
  },

  /**
   * Get the focusable children of the given element
   * 
   * @param {Element} element
   * @returns {Array of Element(s)}
   */
  getFocusableChildren(element = document) {
    let focusableSelectors = this.getKeyboardFocusableElements(element);
    return focusableSelectors.filter(child => !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length));
  },

  /**
   * Gets keyboard-focusable elements within a specified element
   * 
   * @param {Element} element
   * @returns {Array of Element(s)}
   */
  getKeyboardFocusableElements(element = document) {
    let focusableElements = [].slice.call(element.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])', '[contenteditable="true"]')) || [];
    return focusableElements.filter(el => !el.hasAttribute('disabled')).filter(el => !el.classList.contains('disabled'));
  },

  /**
   * Gets scrollbar width
   * https://muffinman.io/blog/get-scrollbar-width-in-javascript/
   * 
   * @returns body scrollbar width. if scrollbar is not shown it will return zero
   */
  getScrollbarWidth() {
    return Math.abs(window.innerWidth - document.documentElement.clientWidth);
  },

  /**
   * Check whether body has scrollbar
   * 
   * @returns {Boolean}
   */
  isOverflowing() {
    return this.getScrollbarWidth() > 0
  },

  /**
   * Show/Hide body scrollbar
   * 
   * @param {Boolean} flag 
   */
  toggleBodyScrollbar(flag = true) {
    const bodyElement = document.getElementsByTagName('body')[0];
    if (flag) {
      bodyElement.setAttribute('overflow', bodyElement.style["overflow"]);
      bodyElement.setAttribute('paddingRight', bodyElement.style["paddingRight"]);
      bodyElement.style.paddingRight = `${this.getScrollbarWidth()}px`;
      bodyElement.style.overflow = 'hidden';
    } else {
      bodyElement.style.overflow = bodyElement.hasAttribute('overflow') ? bodyElement.getAttribute('overflow') : ''; 
      bodyElement.style.paddingRight = bodyElement.hasAttribute('paddingRight') ? bodyElement.getAttribute('paddingRight') : ''; 
      bodyElement.removeAttribute('overflow');
      bodyElement.removeAttribute('paddingRight');
    }
  },

  /**
   * Check whether an element is scrollable or not
   * 
   * @param {Element} element 
   * @returns {Boolean}
   */
  isScrollable(element) {
    return element && element.clientHeight < element.scrollHeight;
  },

  /**
   * Set given child element is within the parent's visible scroll area
   * 
   * @param {Element} element - element to make visible
   * @param {Element} scrollParent
   */
  setScrollVisibility(element, scrollParent) {
    const { offsetHeight, offsetTop } = element;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;
  
    const isAbove = offsetTop < scrollTop;
    const isBelow = (offsetTop + offsetHeight) > (scrollTop + parentOffsetHeight);
  
    if(isAbove) {
      scrollParent.scrollTo(0, offsetTop);
    } else if(isBelow) {
      scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  },
}



