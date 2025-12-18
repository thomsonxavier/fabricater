export const getElementsByClass = (elementClass : any) => {
  const elements = document.getElementsByClassName(elementClass);
  return elementsListToArray(elements);
}

export const elementsListToArray = (collection: any) => {
  return Array.prototype.slice.call(collection) || [];
}

export const isScrollable = (element : any) => {
  return element && element.clientHeight < element.scrollHeight;
}

export const maintainScrollVisibility = (activeElement : any, scrollParent: any) => {
  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = (offsetTop + offsetHeight) > (scrollTop + parentOffsetHeight);

  if(isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  } else if(isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
}

export const filterOptions = (options : any = [], filter: any, exclude : any = []) => {
  return options.filter((option: any) => {
    const matches  = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
}

export const getIndexByLetter = (options : any, filter : any) => {
  const firstMatch = filterOptions(options, filter)[0];
  const allSameLetter = (array : any) => array.every((letter: any) => letter === array[0]);

  if (firstMatch) {
    return options.indexOf(firstMatch);
  }

  else if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(options, filter[0]);
    const matchIndex = (filter.length - 1) % matches.length;
    return options.indexOf(matches[matchIndex]);
  }

  else {
    return -1;
  }
}

export const setFocusToFirstItem = (element = document) => {
  const focusableChildren = getFocusableChildren(element);
  const focused = element.querySelector('[autofocus]') || focusableChildren[0];

  if(focused) {
    focused.focus();
  }
}

export const getKeyboardFocusableElements = (element = document) => {
  return [...(element as any).querySelectorAll(
    'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
  )]
    .filter(el => !el.hasAttribute('disabled'))
    .filter(el => !el.classList.contains('disabled'))
    .filter(el => !el.classList.contains('-disabled'));
}

export const getFocusableChildren = (element = document) => {
  const focusableSelectors = getKeyboardFocusableElements(element);
  return focusableSelectors.filter(child => !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length));
}

export const isElementDisabled = (element : any) => {
  if (!element) return true;

  if (element.classList.contains('-disabled')) return true;

  if (typeof element.disabled !== 'undefined') return element.disabled;

  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
}


export function isDataNotEmpty<T>(value: T): value is NonNullable<T> {
  if (value == null) {
    return false;
  } else if (typeof value !== 'number' && typeof value === 'string' && value?.trim() === '') {
    return false;
  } else if (value === undefined) {
    return false;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return false;
  } else if (value !== null && Array.isArray(value) && !value.length) {
    return false;
  }
  return true;
}

// export const generateRandomID = (prefix: any) => {
//   do {
//     prefix += Math.floor(Math.random() * 1000000);
//   } while (document.getElementById(prefix));
//   return prefix
// }