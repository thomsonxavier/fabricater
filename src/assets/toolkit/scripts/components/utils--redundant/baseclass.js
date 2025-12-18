/**
 * Base Class
 * */ 

import Context from '../utils/context';
import { COMPONENT_PREFIX } from '../utils/utils';


export default class BaseClass {
  constructor(element) {
    element = typeof element === 'string' ? document.querySelector(element) : element;

    if (!element) {
      return;
    }

    this._element = element;
    Context.set(this._element, `${COMPONENT_PREFIX}.${this.constructor.COMPONENT_NAME}`, this);
  }

  destroy() {
    Context.remove(this._element, `${COMPONENT_PREFIX}.${this.constructor.COMPONENT_NAME}`);

    Object.getOwnPropertyNames(this).forEach(propertyName => {
      this[propertyName] = null
    });
  }

  // Static
  static getContext(element, options = {}) {
    // console.log(`Context: ${COMPONENT_PREFIX}.${this.COMPONENT_NAME}`); // => toolkit.[component name] ex: toolkit.dropdown
    return Context.get(element, `${COMPONENT_PREFIX}.${this.COMPONENT_NAME}`) || new this(element, typeof options === 'object' ? options : null);
  }
}
