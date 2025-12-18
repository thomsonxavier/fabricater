/* selectors */

const Selectors = {
    find(selector:any, element = document.documentElement) {
      return Array.from(Element.prototype.querySelectorAll.call(element, selector) as NodeListOf<HTMLElement>) || [];
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },
  
    findOne(selector:any, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },
  
    children(element:any, selector:any) {
      return [].concat(...element.children)
        .filter((child:any) => child.matches(selector));
    },
  
    parents(element:any, selector:any) {
      const parents = [];
  
      let ancestor = element.parentNode;
  
      // while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== Node.TEXT_NODE) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
        }
  
        ancestor = ancestor.parentNode;
      }
  
      return parents;
    },
  
    prev(element:any, selector:any) {
      let previous = element.previousElementSibling;
  
      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }
  
        previous = previous.previousElementSibling;
      }
  
      return [];
    },
  
    next(element:any, selector:any) {
      let next = element.nextElementSibling;
  
      while (next) {
        if (next.matches(selector)) {
          return [next];
        }
  
        next = next.nextElementSibling;
      }
  
      return [];
    },

    parent(element:any, selector:any) {
        while ((element = element.parentElement) && !element.classList.contains(selector));
        return element;
    }
  }
  
  export default Selectors;