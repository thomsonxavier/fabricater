/** 
 * EventListener
 * https://github.com/Cristy94/dynamic-listener
 * */

/**
 * Returns a modified callback function that calls the 
 * initial callback function only if the target element matches the given selector
 * 
 * @param {String} selector 
 * @param {Function} callback 
 * @returns {Function}
 */
function getConditionalCallback(selector:String, callback:Function) {
    return function(event:any) {
      if (event.target && event.target.matches(selector)) {
        event.delegatedTarget = event.target;
        callback.apply(this, arguments);
        return;
      }
      // Not clicked directly, check bubble path
      var path = event.path || (event.composedPath && event.composedPath());
      if (!path) return;
      for(var i = 0; i < path.length; ++i) {
        var el = path[i];
        if (el.matches(selector)) {
          // Call callback for all elements on the path that match the selector
          event.delegatedTarget = el;
          callback.apply(this, arguments);  
        }
        // We reached parent node, stop
        if (el === event.currentTarget) {
          return;
        }
      }
    };
  }
  
  export default {
    /**
     * The dynamic listener gets an extra `selector` parameter that only calls the callback
     * if the target element matches the selector.
     * 
     * The listener has to be added to the container/root element and the selector should match
     * the elements that should trigger the event.
     * 
     * Note: You will have to use event.delegatedTarget in your callbacks to get the element that matches the selector 
     * (as event.target could be a child of this element and event.currentTarget is the root on which the listener was attached to).
     * 
     * @param {Element} rootElement The root element to add the linster too.
     * @param {String} eventType The event type to listen for.
     * @param {String} selector The selector that should match the dynamic elements.
     * @param {Function} callback The function to call when an event occurs on the given selector.
     * @param {Boolean|Object} options Passed as the regular `options` parameter to the addEventListener function
     *                         Set to `true` to use capture.
     *                         Usually used as an object to add the listener as `passive`
     */
    on(rootElement = document.body, eventType:String, selector:String, callback:Function, options:Boolean | Object = false) {
      rootElement.addEventListener(eventType as any, getConditionalCallback(selector, callback), options as any);
    },
  
    /**
     * Dispatch custom event for an element
     * 
     * @param {Element} element 
     * @param {String} event 
     * @param {Object} args additional arguments like relatedTarget
     * @returns {Event Object}
     */
    dispatch(element:Element, event:String, args:Object) {
      if (typeof event !== 'string' || !element) {
        return null
      }
  
      let evt = new CustomEvent(event, { bubbles: true, cancelable: true });
  
      // merge custom information in our event
      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return (args as any)[key];
            }
          })
        })
      }
  
      element.dispatchEvent(evt);
  
      return evt;
    },
  }