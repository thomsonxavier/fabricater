/* Flyout */

import {
  setFocusToFirstItem,
  getFocusableChildren
} from '../../utils/utilities';
import Context from '../../utils/context';
import BaseClass from '../../utils/base-class';

const COMPONENT_KEY = 'flyout';
const OPEN_CLASS = '-open';

// Modals can open modals. Keep track of them with this array.
let openFlyoutList:any = [];

export class Flyout extends BaseClass {

  _isShown:boolean;
  _id:string;
  _previouslyFocused:any;
  _listeners:any;
  _closers:any;
  _overlay:any;
  _show:any;
  _hide:any;

  constructor(element:HTMLElement) {
    super(element);

    this._isShown = false;
    this._id = this._element.id;
    this._previouslyFocused = null;
    this._listeners = {};
    this._closers = [];
    this._overlay = null;

    this._init();
  }

  // Getter
  static get COMPONENT_KEY() {
    return COMPONENT_KEY;
  }

  // Public
  show(event:Event | null=null) {
    if (this._isShown) return this;

    // close modal if exists
    this._clearFlyout(this._element);

    this._previouslyFocused = document.activeElement;
    this._isShown = true;
    this._element.style.visibility = 'visible';

    this._element.classList.add(OPEN_CLASS);
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', 'true');
    this._element.setAttribute('role', 'dialog');

    // create overlay
    if (!this._element.classList.contains('-static') && !this._overlay) {
      this._overlay = document.createElement('div');
      this._overlay.className = 'c-flyout__overlay';
      this._element.insertAdjacentElement('afterend', this._overlay);
      this._overlay.addEventListener('click', this._hide);
    }

    // hide overflow from the <body> element
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';

    const flyoutBody = this._element.querySelector('.c-flyout__body');
    if (flyoutBody) flyoutBody.scrollTop = 0;

    if (!this._closers.length) {
      this._closers = [].slice.call(this._element.querySelectorAll('.-dismiss-flyout')) || [];
      this._closers.forEach((closer:any) => {
        closer.addEventListener('click', this._hide);
      });
    }

    // Set the focus to the first focusable child of the dialog element
    if(this._element.focus) {
      this._element.focus();
    } else {
      setFocusToFirstItem(this._element);
    }

    // Bind a focus event listener to the body element to make sure the focus
    // stays trapped inside the dialog while open, and start listening for some
    // specific key presses (TAB and ESC)
    document.body.addEventListener('focus', this._maintainFocus, true);
    document.addEventListener('keydown', this._bindKeypress);

    // Execute all callbacks registered for the `show` event
    if(event) this._fire('show', event);

    // Fire Initialize event
    this._element.dispatchEvent(new Event('data.myw.init',{bubbles: true}));

    return this;
  }

  hide(event:Event | null = null) {
    if (!this._isShown) return this;
    
    this._isShown = false;
    this._element.classList.remove(OPEN_CLASS);

    const complete = () => {    
      this._element.setAttribute('aria-hidden', 'true');
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      this._element.style.visibility = 'hidden';

      if (this._overlay) { 
        this._overlay.removeEventListener('click', this._hide);
        this._overlay.remove();
        this._overlay = null;
      }
  
      // remove from the list
      openFlyoutList.pop();
  
      // unhide overflow from the <body> element
      document.getElementsByTagName('body')[0].style.overflow = '';
  
      if (this._previouslyFocused && this._previouslyFocused.focus) {
        this._previouslyFocused.focus();
        this._previouslyFocused = null;
      }
  
      // Remove the focus event listener to the body element and stop listening
      // for specific key presses
      document.body.removeEventListener('focus', this._maintainFocus, true);
      document.removeEventListener('keydown', this._bindKeypress);
  
      // Execute all callbacks registered for the `hide` event
      if(event) this._fire('hide', event);
  
      return this;
    }

    setTimeout(complete, this._getTransitionDuration());
  }

  on(type:any, handler:any) {
    if (typeof this._listeners[type] === 'undefined') {
      this._listeners[type] = [];
    }

    this._listeners[type].push(handler);

    return this;
  }

  off(type:any, handler:any) {
    let index = (this._listeners[type] || []).indexOf(handler)

    if (index > -1) {
      this._listeners[type].splice(index, 1);
    }

    return this;
  }

  dispose() {
    this.hide();

    this._closers.map((closer:any) => {
      closer.removeEventListener('click', this._hide);
    });

    this._isShown = false;
    this._previouslyFocused = null;
    this._listeners = null;
    this._closers = null;

    super.dispose();
  }

  // Private
  _init() {
    // prebind the functions that will be bound in addEventListener and removeEventListener to avoid losing references
    this._show = this.show.bind(this);
    this._hide = this.hide.bind(this);
    this._maintainFocus = this._maintainFocus.bind(this);
    this._bindKeypress = this._bindKeypress.bind(this);
  }

  _fire(type:any, event:Event) {
    let listeners = this._listeners[type] || [];

    // listeners.forEach(function (listener:any) {
    //   listener(this._element, event)
    // }.bind(this));

    listeners.forEach( (listener:any) => {
      listener(this._element, event)
    });
  }

  _bindKeypress(event:KeyboardEvent) {
    if (!this._element.contains(document.activeElement)) return;

    // If the dialog is shown and the ESCAPE key is being pressed, hide the dialog, unless its role is 'alertdialog', which should be modal
    if (this._isShown && event.key === 'Escape') {
      event.preventDefault();
      this.hide(event);
    }

    // If the dialog is shown and the TAB key is being pressed, make sure the focus stays trapped within the dialog element
    if (this._isShown && event.key === 'Tab') {
      this._trapTabKey(this._element, event);
    }
  }

  _maintainFocus(event:Event) {
    // If the dialog is shown and the focus is not within the dialog element,
    // move it back to its first focusable child, unless another dialog is going to be opened
    var dialogTarget = (event.target as HTMLElement).getAttribute('data-flyoutid');

    if (this._isShown && !this._element.contains(event.target) && dialogTarget === this._id) {
      setFocusToFirstItem(this._element);
    }
  }

  _trapTabKey(node:any, event:KeyboardEvent) {
    let focusableChildren = getFocusableChildren(node);
    let focusedItemIndex = focusableChildren.indexOf(document.activeElement);

    // If the SHIFT key is being pressed while tabbing (moving backwards) and
    // the currently focused item is the first one, move the focus to the last
    // focusable item from the dialog element
    if ((event.key === 'ShiftLeft' || event.key === 'ShiftRight') && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
      // If the SHIFT key is not being pressed (moving forwards) and the currently
      // focused item is the last one, move the focus to the first focusable item
      // from the dialog element
    } else if (!(event.key === 'ShiftLeft' || event.key === 'ShiftRight') && focusedItemIndex === focusableChildren.length - 1) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }

  _getTransitionDuration() {
    let { transitionDuration, transitionDelay } = window.getComputedStyle(this._element);

    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    if (!floatTransitionDuration && !floatTransitionDelay) return 0;

    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];

    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * 1000;
  }

  _getCurrentFlyout() {
    if (openFlyoutList && openFlyoutList.length) {
      return openFlyoutList[openFlyoutList.length - 1];
    }
  }

  _closeCurrentFlyout() {
    const currentFlyout = this._getCurrentFlyout();
    if (currentFlyout) {
      let currentFlyoutContext = Context.get(currentFlyout, COMPONENT_KEY);
      if (currentFlyoutContext) {
        currentFlyoutContext.hide();
      }
      openFlyoutList.pop();
    }
  }

  _clearFlyout(flyout:any) {
    if (openFlyoutList.length > 0) {
      this._closeCurrentFlyout();
    }
    openFlyoutList.push(flyout);
  }

  /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
  static flyoutInterface(element:HTMLElement) {
    const context:any = Context.get(element, COMPONENT_KEY);
    if(context) return context;
    return new Flyout(element);
  }
}

export const flyoutComponent = () => {
  const flyoutComponents = [].slice.call(document.querySelectorAll('[data-flyoutid]')  as NodeListOf<HTMLElement>) || [];

  flyoutComponents.forEach((element:HTMLElement) => {
    element.addEventListener('click', function (event:any) {
      if (this.tagName === 'A') event.preventDefault();

      let selector:any = this.getAttribute('data-flyoutid');
      let target:any = selector ? document.getElementById(selector) : null;
      let context:any = null;
      if(target) context = Context.get(target, COMPONENT_KEY) || new Flyout(target);
      context?.show(target);
    });
  });

};
