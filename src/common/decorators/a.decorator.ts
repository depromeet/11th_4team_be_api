export function ReturnToClass(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  // Check of the decorated property is a function
  if (typeof descriptor.value === 'function') {
    // The function that we are going to wrap
    const declaredFn = descriptor.value;
    console.log(declaredFn);

    // Provide a new function for this property that wraps the original function
    descriptor.value = () => {
      // Call the method with `this` set the object with the method,
      // in case that matters.
      const result = declaredFn.apply(target);
      if (result instanceof Promise) {
        // execute the promise
        result
          .then((data) => {
            return data;
          })
          .catch((error) => {
            throw error;
          });
      }
      // Do the thing you want with the result
      console.log(result);

      // Return the result from the origin function
      return result;
    };
  }
}

export function trace(verbose = false) {
  return (
    target: any,
    prop: string,
    descriptor?: TypedPropertyDescriptor<any>,
  ): any => {
    let fn;
    let patchedFn;

    if (target instanceof Function) {
      // for static methods return function itself
      return target;
    }

    if (descriptor) {
      fn = descriptor.value;
    }

    return {
      configurable: true,
      enumerable: false,
      get() {
        if (!patchedFn) {
          patchedFn = (...args) => {
            const ret = fn.apply(this, args);
            if (ret instanceof Promise) {
              // execute the promise
              ret
                .then((data) => {
                  return data;
                })
                .catch((error) => {
                  console.log(error);
                });
            }
            return ret;
          };
        }
        return patchedFn;
      },
      set(newFn) {
        patchedFn = undefined;
        fn = newFn;
      },
    };
  };
}
