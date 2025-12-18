'use strict';

import Context from '../../utils/context';
import BaseClass from '../../utils/base-class';

const COMPONENT_KEY:string = 'Combobox-noAutoComp';

export class ComboboxAutocomplete extends BaseClass {
    
    comboboxNode:HTMLInputElement;
    buttonNode:HTMLButtonElement;
    listboxNode:HTMLElement;

    comboboxHasVisualFocus:boolean;
    listboxHasVisualFocus:boolean;
    hasHover:boolean;

    isNone:boolean;
    isList:boolean;
    isBoth:boolean;

    allOptions:any;
    option:any;
    firstOption:any;
    lastOption:any;

    filteredOptions:any = [];
    filter:any = '';


    constructor(element:HTMLElement) {
      super(element);

      this.comboboxNode = this._element.querySelector('input');
      this.buttonNode = this._element.querySelector('button');
      this.listboxNode = this._element.querySelector('[role="listbox"]');
  
      this.comboboxHasVisualFocus = false;
      this.listboxHasVisualFocus = false;
  
      this.hasHover = false;
  
      this.isNone = false;
      this.isList = false;
      this.isBoth = false;
  
      this.allOptions = [];
  
      this.option = null;
      this.firstOption = null;
      this.lastOption = null;
  
      this.filteredOptions = [];
      this.filter = '';
  
      var autocomplete:any = this.comboboxNode.getAttribute('aria-autocomplete');
  
      if (typeof autocomplete === 'string') {
        autocomplete = autocomplete.toLowerCase();
        this.isNone = autocomplete === 'none';
        this.isList = autocomplete === 'list';
        this.isBoth = autocomplete === 'both';
      } else {
        // default value of autocomplete
        this.isNone = true;
      }
  
      this.comboboxNode.addEventListener(
        'keydown',
        this.onComboboxKeyDown.bind(this)
      );
      this.comboboxNode.addEventListener(
        'keyup',
        this.onComboboxKeyUp.bind(this)
      );
      this.comboboxNode.addEventListener(
        'click',
        this.onComboboxClick.bind(this)
      );
      this.comboboxNode.addEventListener(
        'focus',
        this.onComboboxFocus.bind(this)
      );
      this.comboboxNode.addEventListener('blur', this.onComboboxBlur.bind(this));
  
      document.body.addEventListener(
        'pointerup',
        this.onBackgroundPointerUp.bind(this),
        true
      );
  
      // initialize pop up menu
  
      this.listboxNode.addEventListener(
        'pointerover',
        this.onListboxPointerover.bind(this)
      );
      this.listboxNode.addEventListener(
        'pointerout',
        this.onListboxPointerout.bind(this)
      );
  
      // Traverse the element children of domNode: configure each with
      // option role behavior and store reference in.options array.
      var nodes = this.listboxNode.getElementsByTagName('LI');
  
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        this.allOptions.push(node);
  
        node.addEventListener('click', this.onOptionClick.bind(this));
        node.addEventListener('pointerover', this.onOptionPointerover.bind(this));
        node.addEventListener('pointerout', this.onOptionPointerout.bind(this));
      }
  
      this.filterOptions();
  
      // Open Button
  
      var button = this.comboboxNode.nextElementSibling;
  
      if (button && button.tagName === 'BUTTON') {
        button.addEventListener('click', this.onButtonClick.bind(this));
      }
    }
  
    getLowercaseContent(node:any) {
      return node.textContent.toLowerCase();
    }
  
    isOptionInView(option:any) {
      var bounding = option.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  
    setActiveDescendant(option:any) {
      if (option && this.listboxHasVisualFocus) {
        this.comboboxNode.setAttribute('aria-activedescendant', option.id);
        if (!this.isOptionInView(option)) {
          option.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        this.comboboxNode.setAttribute('aria-activedescendant', '');
      }
    }
  
    setValue(value:any) {
      this.filter = value;
      this.comboboxNode.value = this.filter;
      this.comboboxNode.setSelectionRange(this.filter.length, this.filter.length);
      this.filterOptions();
    }
  
    setOption(option:any, flag:any=false) {
      if (typeof flag !== 'boolean') {
        flag = false;
      }
  
      if (option) {
        this.option = option;
        this.setCurrentOptionStyle(this.option);
        this.setActiveDescendant(this.option);
  
        if (this.isBoth) {
          this.comboboxNode.value = this.option.textContent;
          if (flag) {
            this.comboboxNode.setSelectionRange(
              this.option.textContent.length,
              this.option.textContent.length
            );
          } else {
            this.comboboxNode.setSelectionRange(
              this.filter.length,
              this.option.textContent.length
            );
          }
        }
      }
    }
  
    setVisualFocusCombobox() {
      this.listboxNode.classList.remove('focus');
      (this.comboboxNode.parentNode as HTMLElement).classList.add('focus'); // set the focus class to the parent for easier styling
      this.comboboxHasVisualFocus = true;
      this.listboxHasVisualFocus = false;
      this.setActiveDescendant(false);
    }
  
    setVisualFocusListbox() {
    (this.comboboxNode.parentNode as HTMLElement).classList.remove('focus');
      this.comboboxHasVisualFocus = false;
      this.listboxHasVisualFocus = true;
      this.listboxNode.classList.add('focus');
      this.setActiveDescendant(this.option);
    }
  
    removeVisualFocusAll() {
      (this.comboboxNode.parentNode as HTMLElement).classList.remove('focus');
      this.comboboxHasVisualFocus = false;
      this.listboxHasVisualFocus = false;
      this.listboxNode.classList.remove('focus');
      this.option = null;
      this.setActiveDescendant(false);
    }
  
    // ComboboxAutocomplete Events
  
    filterOptions() {
      // do not filter any options if autocomplete is none
      if (this.isNone) {
        this.filter = '';
      }
  
      var option = null;
      var currentOption = this.option;
      var filter = this.filter.toLowerCase();
  
      this.filteredOptions = [];
      this.listboxNode.innerHTML = '';
  
      for (var i = 0; i < this.allOptions.length; i++) {
        option = this.allOptions[i];
        if (
          filter.length === 0 ||
          this.getLowercaseContent(option).indexOf(filter) === 0
        ) {
          this.filteredOptions.push(option);
          this.listboxNode.appendChild(option);
        }
      }
  
      // Use populated options array to initialize firstOption and lastOption.
      var numItems = this.filteredOptions.length;
      if (numItems > 0) {
        this.firstOption = this.filteredOptions[0];
        this.lastOption = this.filteredOptions[numItems - 1];
  
        if (currentOption && this.filteredOptions.indexOf(currentOption) >= 0) {
          option = currentOption;
        } else {
          option = this.firstOption;
        }
      } else {
        this.firstOption = null;
        option = null;
        this.lastOption = null;
      }
  
      return option;
    }
  
    setCurrentOptionStyle(option:any) {
      for (var i = 0; i < this.filteredOptions.length; i++) {
        var opt = this.filteredOptions[i];
        if (opt === option) {
          opt.setAttribute('aria-selected', 'true');
          if (
            this.listboxNode.scrollTop + this.listboxNode.offsetHeight <
            opt.offsetTop + opt.offsetHeight
          ) {
            this.listboxNode.scrollTop =
              opt.offsetTop + opt.offsetHeight - this.listboxNode.offsetHeight;
          } else if (this.listboxNode.scrollTop > opt.offsetTop + 2) {
            this.listboxNode.scrollTop = opt.offsetTop;
          }
        } else {
          opt.removeAttribute('aria-selected');
        }
      }
    }
  
    getPreviousOption(currentOption:any) {
      if (currentOption !== this.firstOption) {
        var index = this.filteredOptions.indexOf(currentOption);
        return this.filteredOptions[index - 1];
      }
      return this.lastOption;
    }
  
    getNextOption(currentOption:any) {
      if (currentOption !== this.lastOption) {
        var index = this.filteredOptions.indexOf(currentOption);
        return this.filteredOptions[index + 1];
      }
      return this.firstOption;
    }
  
    /* MENU DISPLAY METHODS */
  
    doesOptionHaveFocus() {
      return this.comboboxNode.getAttribute('aria-activedescendant') !== '';
    }
  
    isOpen() {
      return this.listboxNode.style.display === 'block';
    }
  
    isClosed() {
      return this.listboxNode.style.display !== 'block';
    }
  
    hasOptions() {
      return this.filteredOptions.length;
    }
  
    open() {
      this.listboxNode.style.display = 'block';
      this.comboboxNode.setAttribute('aria-expanded', 'true');
      this.comboboxNode.focus();
      // this.buttonNode.setAttribute('aria-expanded', 'true');
    }
  
    close(force:boolean = false) {
      if (typeof force !== 'boolean') {
        force = false;
      }
  
      if (
        force ||
        (!this.comboboxHasVisualFocus &&
          !this.listboxHasVisualFocus &&
          !this.hasHover)
      ) {
        this.setCurrentOptionStyle(false);
        this.listboxNode.style.display = 'none';
        this.comboboxNode.setAttribute('aria-expanded', 'false');
        // this.buttonNode.setAttribute('aria-expanded', 'false');
        this.setActiveDescendant(false);
        (this.comboboxNode.parentNode as HTMLElement).classList.add('focus');
      }
    }
  
    /* combobox Events */
  
    onComboboxKeyDown(event:KeyboardEvent) {
      var flag = false,
        altKey = event.altKey;
      var target = event.target as HTMLElement;
  
      if (event.ctrlKey || event.shiftKey) {
        return;
      }
  
      switch (event.key) {
        case 'Enter':
          if (this.listboxHasVisualFocus) { /* this.setValue(this.option.textContent);*/ }
          // if(target.tagName === 'A' || target.tagName === 'BUTTON' || (target.tagName === 'LI' && target.getAttribute('role') === 'option')){ }
          this.close(true); 
          this.setVisualFocusCombobox();
          flag = true;
          break;
  
        case 'Down':
        case 'ArrowDown':
          if (this.filteredOptions.length > 0) {
            if (altKey) {
              this.open();
            } else {
              this.open();
              if (
                this.listboxHasVisualFocus ||
                (this.isBoth && this.filteredOptions.length > 1)
              ) {
                this.setOption(this.getNextOption(this.option), true);
                this.setVisualFocusListbox();
              } else {
                this.setOption(this.firstOption, true);
                this.setVisualFocusListbox();
              }
            }
          }
          flag = true;
          break;
  
        case 'Up':
        case 'ArrowUp':
          if (this.hasOptions()) {
            if (this.listboxHasVisualFocus) {
              this.setOption(this.getPreviousOption(this.option), true);
            } else {
              this.open();
              if (!altKey) {
                this.setOption(this.lastOption, true);
                this.setVisualFocusListbox();
              }
            }
          }
          flag = true;
          break;
  
        case 'Esc':
        case 'Escape':
          if (this.isOpen()) {
            this.close(true);
            this.filter = this.comboboxNode.value;
            this.filterOptions();
            this.setVisualFocusCombobox();
          } else {
            this.setValue('');
            this.comboboxNode.value = '';
          }
          this.option = null;
          flag = true;
          break;
  
        case 'Tab':
          this.close(true);
          if (this.listboxHasVisualFocus) {
            if (this.option) {
              this.setValue(this.option.textContent);
            }
          }
          break;
  
        case 'Home':
          this.comboboxNode.setSelectionRange(0, 0);
          flag = true;
          break;
  
        case 'End':
          var length = this.comboboxNode.value.length;
          this.comboboxNode.setSelectionRange(length, length);
          flag = true;
          break;
  
        default:
          break;
      }
  
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  
    isPrintableCharacter(str:String) {
      return str.length === 1 && str.match(/\S| /);
    }
  
    onComboboxKeyUp(event:KeyboardEvent) {
      var flag = false,
        option = null,
        char = event.key;
  
      if (this.isPrintableCharacter(char)) {
        this.filter += char;
      }
  
      // this is for the case when a selection in the textbox has been deleted
      if (this.comboboxNode.value.length < this.filter.length) {
        this.filter = this.comboboxNode.value;
        this.option = null;
        this.filterOptions();
      }
  
      if (event.key === 'Escape' || event.key === 'Esc') {
        return;
      }
  
      switch (event.key) {
        case 'Backspace':
          this.setVisualFocusCombobox();
          this.setCurrentOptionStyle(false);
          this.filter = this.comboboxNode.value;
          this.option = null;
          this.filterOptions();
          flag = true;
          break;
  
        case 'Left':
        case 'ArrowLeft':
        case 'Right':
        case 'ArrowRight':
        case 'Home':
        case 'End':
          if (this.isBoth) {
            this.filter = this.comboboxNode.value;
          } else {
            this.option = null;
            this.setCurrentOptionStyle(false);
          }
          this.setVisualFocusCombobox();
          flag = true;
          break;
  
        default:
          if (this.isPrintableCharacter(char)) {
            this.setVisualFocusCombobox();
            this.setCurrentOptionStyle(false);
            flag = true;
  
            if (this.isList || this.isBoth) {
              option = this.filterOptions();
              if (option) {
                if (this.isClosed() && this.comboboxNode.value.length) {
                  this.open();
                }
  
                if (
                  this.getLowercaseContent(option).indexOf(
                    this.comboboxNode.value.toLowerCase()
                  ) === 0
                ) {
                  this.option = option;
                  if (this.isBoth || this.listboxHasVisualFocus) {
                    this.setCurrentOptionStyle(option);
                    if (this.isBoth) {
                      this.setOption(option);
                    }
                  }
                } else {
                  this.option = null;
                  this.setCurrentOptionStyle(false);
                }
              } else {
                this.close();
                this.option = null;
                this.setActiveDescendant(false);
              }
            } else if (this.comboboxNode.value.length) {
              this.open();
            }
          }
  
          break;
      }
  
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  
    onComboboxClick() {
      if (this.isOpen()) {
        this.close(true);
      } else {
        this.open();
      }
    }
  
    onComboboxFocus() {
      this.filter = this.comboboxNode.value;
      this.filterOptions();
      this.setVisualFocusCombobox();
      this.option = null;
      this.setCurrentOptionStyle(null);
    }
  
    onComboboxBlur() {
      this.removeVisualFocusAll();
    }
  
    onBackgroundPointerUp(event:Event) {
      if (
        !this.comboboxNode.contains(event.target as HTMLElement) &&
        !this.listboxNode.contains(event.target as HTMLElement) 
        // && !this.buttonNode.contains(event.target)
      ) {
        this.comboboxHasVisualFocus = false;
        this.setCurrentOptionStyle(null);
        this.removeVisualFocusAll();
        setTimeout(this.close.bind(this, true), 300);
      }
    }
  
    onButtonClick() {
      if (this.isOpen()) {
        this.close(true);
      } else {
        this.open();
      }
      this.comboboxNode.focus();
      this.setVisualFocusCombobox();
    }
  
    /* Listbox Events */
  
    onListboxPointerover() {
      this.hasHover = true;
    }
  
    onListboxPointerout() {
      this.hasHover = false;
      setTimeout(this.close.bind(this, false), 300);
    }
  
    // Listbox Option Events
    onOptionClick(event:Event) {
      // this.comboboxNode.value = (event.target as HTMLElement).textContent ?? '';
      this.close(true);
    }
  
    onOptionPointerover() {
      this.hasHover = true;
      this.open();
    }
  
    onOptionPointerout() {
      this.hasHover = false;
      setTimeout(this.close.bind(this, false), 300);
    }

    // Getter
    static get COMPONENT_KEY() {
      return COMPONENT_KEY;
    }
    
    /** Static Interface to check for an existing instance, create new if required and return the Instance
     * @param {*} element:HTMLElement - will be bound to _element property on the instance 
     * @returns class instance with parameter bound to _element
     */
    static comboBoxInterface(element:HTMLElement) {
        let context = Context.get(element, COMPONENT_KEY);
        if(context){
          return context;
        }
        if (!context) {
            return new ComboboxAutocomplete(element);
        }
    }
}


export const comboboxINIT = () =>{
    if(!document.querySelector('.combobox-list')){
        return;
    }

    // NOTE: CALL THIS ON ngAfterViewInit()
    let comboboxes = [].slice.call(document.querySelectorAll('.combobox-list') as NodeListOf<HTMLElement>) || [];
    let elements = comboboxes.map((item:HTMLElement) => ComboboxAutocomplete.comboBoxInterface(item));

    // NOTE: CALL THE FOLLOWING LINE IN ngOnDestroy() to remove eventlisteners
    // elements.forEach(item=> item._destroy());
}


// window.addEventListener('load', function () {
//     var comboboxes = document.querySelectorAll('.combobox-list');
  
//     for (var i = 0; i < comboboxes.length; i++) {
//       var combobox = comboboxes[i];
//       var comboboxNode = combobox.querySelector('input');
//       var buttonNode = combobox.querySelector('button');
//       var listboxNode = combobox.querySelector('[role="listbox"]');
//       new ComboboxAutocomplete(comboboxNode, buttonNode, listboxNode);
//     }
//   });
  