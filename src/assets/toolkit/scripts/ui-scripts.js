export const htmlCollectionToArray = (collection) => {
  let HtmlArray = [];
  for (let i = 0; i < collection.length; i++) {
    HtmlArray.push(collection[i]);
  }
  return HtmlArray;
};

/**
 *
 * @param {string} elementClass
 * @returns {HTMLElements}
 */
export const getHtmlElmentsByClass = (elementClass) => {
  const elements = document.getElementsByClassName(elementClass);
  return htmlCollectionToArray(elements);
};

/**
 *
 * @param {string} id
 * @param {HTMLElement} element
 */
export const getElementById = (id) => {
  return document.getElementById(id);
};

/**
 *
 * @param {string} tag
 * @returns {HTMLElements}
 */
export const getElementsByTagName = (tag) => {
  const elements = document.getElementsByTagName(tag);
  return htmlCollectionToArray(elements);
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {function} eventHandler
 */
export const addEventListener = (element, eventName, eventHandler) => {
  if (element && element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element && element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  }
};

/**
 *
 * @param {string} targetClass
 * @param {string} classToRemove
 */
export const removeClassFromElements = (targetClass, classToRemove) => {
  const elements = getHtmlElmentsByClass(targetClass);
  elements.map((element) => {
    element.classList.remove(classToRemove);
  });
};
/**
 *
 * @param {string} targetClass
 * @param {string} classToRemove
 */
export const removeClassFromSeletor = (selector, classToRemove) => {
  const elements = getQueryHtmlElements(selector);
  elements.map((element) => {
    element.classList.remove(classToRemove);
  });
};

/**
 *
 * @param {string} targetClass
 * @param {dtring} classToRemove
 */
export const addClassFromElements = (targetClass, classToRemove) => {
  const elements = getHtmlElmentsByClass(targetClass);
  elements.map((element) => {
    element.classList.add(classToRemove);
  });
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} className
 */
export const addClassToElement = (element, className) => {
  element.classList.add(className);
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} className
 */
export const removeClassFromElement = (element, className) => {
  element.classList.remove(className);
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} className
 */
export const toggleClassElement = (element, className) => {
  element.classList.toggle(className);
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {boolean}
 */
export const elementHasClass = (element, className) => {
  return element.classList.contains(className);
};

/**
 *
 * @param {*} element
 */
export const getChildElements = (element) => {
  return htmlCollectionToArray(element.children);
};

export const getQueryHtmlElements = (selector) => {
  const collection = document.querySelectorAll(selector);
  return htmlCollectionToArray(collection);
};
