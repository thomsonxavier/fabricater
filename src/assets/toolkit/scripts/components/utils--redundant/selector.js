/** 
 * DOMSelector
 * */

import { COMPONENT_PREFIX } from '../utils/utils';

function normalizeData(val) {
  if (val === 'true') return true;

  if (val === 'false') return false;

  if (val === Number(val).toString()) return Number(val);

  if (val === '' || val === 'null') return null;

  return val;
}

export default {
  /**
   * Get element(s) that matches the selector
   * 
   * @param {String} selector 
   * @param {Element} element 
   * @returns {Array of Element(s)}
   */
  findElement(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },

  /**
   * Get parent element for the given element 
   * 
   * @param {Element} element
   * @param {String} selector The selector that should match the parent element. 
   * @returns {Element} parent element
   */
  getParent(element, selector) {
    while ((element = element.parentElement) && !element.classList.contains(selector));
    return element;
  },

  /**
   * Get children of the element
   *  
   * @param {Element} element 
   * @param {String} selector The selector that should match the children(s). 
   * @returns {Array of Element(s)}
   */
  getChildren(element, selector) {
    return [].concat(...element.children)
      .filter(child => child.matches(selector));
  },

  /**
   * Get next sibling of the element
   * 
   * @param {Element} element 
   * @param {String} selector The selector that should match the next sibling element(s)
   * @returns sibling element
   */
  next(element, selector) {
    let next = element.nextElementSibling;

    while (next) {
      if (next.matches(selector)) {
        return [next];
      }

      next = next.nextElementSibling;
    }

    return [];
  },

  /**
   * Get previous sibling of the element
   * 
   * @param {Element} element 
   * @param {String} selector The selector that should match the previous sibling element(s)
   * @returns sibling element
   */
  prev(element, selector) {
    let prev = element.previousElementSibling;

    while (prev) {
      if (prev.matches(selector)) {
        return [prev];
      }

      prev = next.previousElementSibling;
    }

    return [];
  },

  /**
   * Get data attributes of the given element
   * 
   * @param {Element} element
   * @return {Array of attribute(s) collection}
   */
  getDataAttributes(element) {
    if (!element) return {};

    const attributes = {}

    Object.keys(element.dataset)
      .filter(key => key.startsWith(`${COMPONENT_PREFIX}`))
      .forEach(key => {
        let pureKey = key.replace(/^toolkit/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      })

    return attributes
  },
}