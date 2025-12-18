/**
 * Context
 * */ 

const instanceMap = new Map();

export default {
  set(element, key, context) {
    if (!instanceMap.has(element)) {
      instanceMap.set(element, new Map());
    }

    const contextMap = instanceMap.get(element);

    // we only want one context per element 
    if (!contextMap.has(key) && contextMap.size !== 0) {
      console.error(`Not allowed more than one instance per element. Bound instance: ${Array.from(contextMap.keys())[0]}.`);
      return;
    }

    contextMap.set(key, context);
  },

  get(element, key) {
    if (instanceMap.has(element)) {
      return instanceMap.get(element).get(key) || null;
    }

    return null;
  },

  remove(element, key) {
    if (!instanceMap.has(element)) {
      return;
    }

    const contextMap = instanceMap.get(element);

    contextMap.delete(key);

    // free up element references if there are no context left for an element
    if (contextMap.size === 0) {
      instanceMap.delete(element);
    }
  }
}