/* Modal */

import {
  setFocusToFirstItem,
  getFocusableChildren
} from '../../utils/utilities';
import Context from '../../utils/context';
import BaseClass from '../../utils/base-class';

const COMPONENT_KEY:string = 'modal';

// Modals can open modals. Keep track of them with this array.
let openModalList:any[] | null = [];

export class Modal extends BaseClass {

  _isShown:boolean = false;
  _id:string;
  _previouslyFocused:HTMLElement | null;
  _listeners:any;
  _closers:any;
  _show:any;
  _hide:any;

  constructor(element:HTMLElement) {
    super(element);

    this._isShown = (this._element.getAttribute('aria-hidden') == 'true') ? false : true;
    this._id = this._element.id;
    this._previouslyFocused = null;
    this._listeners = {};
    this._closers = [];

    this._init();
  }

  // Getter
  static get COMPONENT_KEY() {
    return COMPONENT_KEY;
  }

  // Public
  show(event:Event | null=null) {
    this._isShown = (this._element.getAttribute('aria-hidden') == 'true') ? false : true;
    if (this._isShown) return this;

    // close modal if exists
    this._clearModal(this._element);

    const modalType = this._element.classList.contains('-static') ? 'alertdialog' : 'dialog';
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', 'true');
    this._element.setAttribute('role', modalType);

    // create overlay
    if (!this._element.querySelector('.c-modal__overlay')) {
      const modalOverlay:HTMLElement = document.createElement('div');
      modalOverlay.className = (modalType === 'alertdialog') ? 'c-modal__overlay' : 'c-modal__overlay -dismiss-modal';
      this._element.insertBefore(modalOverlay, this._element.firstChild);
    }

    this._previouslyFocused = document.activeElement as HTMLElement;
    this._isShown = true;

    // hide overflow from the <body> element
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';

    const modalBody:any = this._element.querySelector('.c-modal__body');
    if (modalBody) modalBody.scrollTop = 0;

    this._closers.forEach((closer:any) => {
      closer.removeEventListener('click', this._hide);
    });
    this._closers = [].slice.call(this._element.querySelectorAll('.-dismiss-modal')) || [];
    this._closers.forEach((closer:any) => {
      closer.addEventListener('click', this._hide);
    });

    // Set the focus to the first focusable child of the dialog element
    // if(this._element.focus) {
      // this._element.focus();
    // } else {
      // setFocusToFirstItem(this._element);
    // }

    (this._element.querySelector('.-dismiss-modal:not(.c-modal__overlay)')).focus({preventScroll: true}); //, focusVisible: true

    // Bind a focus event listener to the body element to make sure the focus
    // stays trapped inside the dialog while open, and start listening for some
    // specific key presses (TAB and ESC)
    document.body.addEventListener('focus', this._maintainFocus, true);
    document.addEventListener('keydown', this._bindKeypress);

    // Execute all callbacks registered for the `show` event
    event && this._fire('show', event);
    // Fire Initialize event
    this._element.dispatchEvent(new Event('data.myw.init',{bubbles: true}));

    return this;
  }

  hide(event:Event | null=null) {
    if (!this._isShown) return this;

    this._element.setAttribute('aria-hidden', 'true');
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');

    // remove from the list
    openModalList && openModalList.pop();

    // unhide overflow from the <body> element
    document.getElementsByTagName('body')[0].style.overflow = '';

    if (this._previouslyFocused && this._previouslyFocused.focus) {
      this._previouslyFocused.focus();
    }
    this._isShown = false;

    // Remove the focus event listener to the body element and stop listening
    // for specific key presses
    document.body.removeEventListener('focus', this._maintainFocus, true);
    document.removeEventListener('keydown', this._bindKeypress);

    // Execute all callbacks registered for the `hide` event
    this._fire('hide', event);

    return this;
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

  
  destroy() {
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

    this._closers = [].slice.call(this._element.querySelectorAll('.-dismiss-modal')) || [];
    this._closers.forEach((closer:any) => {
      closer.addEventListener('click', this._hide);
    });
  }
  

  _fire(type:any, event:any) {
    let listeners = this._listeners[type] || [];

    listeners.forEach((listener:any)=>{
      listener(this._element, event)
    }
    // .bind(this)
    );
  }

  _bindKeypress(event:any) {
    if (!this._element.contains(document.activeElement)) return;

    // If the dialog is shown and the ESCAPE key is being pressed, hide the dialog, unless its role is 'alertdialog', which should be modal
    if (this._isShown && event.key === 'Escape' && this._element.getAttribute('role') !== 'alertdialog') {
      event.preventDefault();
      this.hide(event);
    }

    // If the dialog is shown and the TAB key is being pressed, make sure the focus stays trapped within the dialog element
    if (this._isShown && event.key === 'Tab') {
      this._trapTabKey(this._element, event);
    }
  }

  _maintainFocus(event:any) {
    // If the dialog is shown and the focus is not within the dialog element,
    // move it back to its first focusable child, unless another dialog is going to be opened
    var dialogTarget = event.target.getAttribute('data-modalid');

    if (this._isShown && !this._element.contains(event.target) && dialogTarget === this._id) {
      setFocusToFirstItem(this._element);
    }
  }

  _trapTabKey(node:any, event:any) {
    let focusableChildren = getFocusableChildren(node);
    let focusedItemIndex = focusableChildren.indexOf(document.activeElement);

    
    // If the SHIFT key is being pressed while tabbing (moving backwards) and
    // the currently focused item is the first one, move the focus to the last
    // focusable item from the dialog element
    if ((event.shiftKey) && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
      // If the SHIFT key is not being pressed (moving forwards) and the currently
      // focused item is the last one, move the focus to the first focusable item
      // from the dialog element
    } else if ( (!event.shiftKey) && (focusedItemIndex === focusableChildren.length - 1)) {
      focusableChildren[0].focus();
      event.preventDefault();
    }

    // // If the SHIFT key is being pressed while tabbing (moving backwards) and
    // // the currently focused item is the first one, move the focus to the last
    // // focusable item from the dialog element
    // if ((event.key === 'ShiftLeft' || event.key === 'ShiftRight') && focusedItemIndex === 0) {
    //   focusableChildren[focusableChildren.length - 1].focus();
    //   event.preventDefault();
    //   // If the SHIFT key is not being pressed (moving forwards) and the currently
    //   // focused item is the last one, move the focus to the first focusable item
    //   // from the dialog element
    // } else if (!(event.key === 'ShiftLeft' || event.key === 'ShiftRight') && focusedItemIndex === focusableChildren.length - 1) {
    //   focusableChildren[0].focus();
    //   event.preventDefault();
    // }
  }

  _getCurrentModal() {
    if (openModalList && openModalList && openModalList.length) {
      return openModalList[openModalList && openModalList.length - 1];
    }
  }

  _closeCurrentModal() {
    const currentModal = this._getCurrentModal();
    if (currentModal) {
      let currentModalContext = Context.get(currentModal, COMPONENT_KEY);
      if (currentModalContext) {
        currentModalContext.hide();
      }
      openModalList && openModalList.pop();
    }
  }

  _clearModal(modal:any) {
    if (openModalList && openModalList.length > 0) {
      this._closeCurrentModal();
    }
    openModalList && openModalList.push(modal);
  }

  /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
  static modalInterface(element:HTMLElement) {
    const context:any = Context.get(element, COMPONENT_KEY);
    if(context) return context;
    return new Modal(element);
  }
}

const modalInit = () => {
  const modals:HTMLElement[] = Array.from(document.querySelectorAll('.c-modal') as NodeListOf<HTMLElement> ) || [];

  modals.forEach((item:HTMLElement)=>{
    if(!Context.get(item, COMPONENT_KEY)) new Modal(item);
  });
}

export const modalComponent = () => {
  const modalComponents:HTMLElement[] = [].slice.call(document.querySelectorAll('[data-modalid]') as NodeListOf<HTMLElement> ) || [];

  modalComponents.forEach((element:any) => {
    element.addEventListener('click', (event:any) => {
      if (element.tagName === 'A') event.preventDefault();
      const selector = element.getAttribute('data-modalid'),
          target = selector ? document.getElementById(selector) : null;

      let context = null;
      if(target) context = Context.get(target, COMPONENT_KEY) || new Modal(target);
      context && context.show(target);
    });
  });
};