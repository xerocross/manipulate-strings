(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $$observable = _interopDefault(require('symbol-observable'));

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionDescription = actionType && "action \"" + String(actionType) + "\"" || 'an action';
  return "Given " + actionDescription + ", reducer \"" + key + "\" returned undefined. " + "To ignore an action, you must explicitly return the previous state. " + "If you want this reducer to hold no value, you can return null instead of undefined.";
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!isPlainObject(inputState)) {
    return "The " + argumentName + " has unexpected type of \"" + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + "\". Expected argument to be an object with the following " + ("keys: \"" + reducerKeys.join('", "') + "\"");
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });
  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });
  if (action && action.type === ActionTypes.REPLACE) return;

  if (unexpectedKeys.length > 0) {
    return "Unexpected " + (unexpectedKeys.length > 1 ? 'keys' : 'key') + " " + ("\"" + unexpectedKeys.join('", "') + "\" found in " + argumentName + ". ") + "Expected to find one of the known reducer keys instead: " + ("\"" + reducerKeys.join('", "') + "\". Unexpected keys will be ignored.");
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });

    if (typeof initialState === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined during initialization. " + "If the state passed to the reducer is undefined, you must " + "explicitly return the initial state. The initial state may " + "not be undefined. If you don't want to set a value for this reducer, " + "you can use null instead of undefined.");
    }

    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error("Reducer \"" + key + "\" returned undefined when probed with a random type. " + ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") + "namespace. They are considered private. Instead, you must return the " + "current state for any unknown actions, unless it is undefined, " + "in which case you must return the initial state, regardless of the " + "action type. The initial state may not be undefined, but can be null.");
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */


function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};

  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning("No reducer provided for key \"" + key + "\"");
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  var finalReducerKeys = Object.keys(finalReducers);
  var unexpectedKeyCache;

  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError;

  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);

      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};

    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);

      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }

      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(this, arguments));
  };
}
/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */


function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error("bindActionCreators expected an object or a function, instead received " + (actionCreators === null ? 'null' : typeof actionCreators) + ". " + "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?");
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];

    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error("Dispatching while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

exports.createStore = createStore;
exports.combineReducers = combineReducers;
exports.bindActionCreators = bindActionCreators;
exports.applyMiddleware = applyMiddleware;
exports.compose = compose;
exports.__DO_NOT_USE__ActionTypes = ActionTypes;

}).call(this,require('_process'))
},{"_process":1,"symbol-observable":3}],3:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = require('./ponyfill.js');

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./ponyfill.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};
},{}],5:[function(require,module,exports){
let id = 1;
module.exports = class Transform {
    constructor(previous, description, transformFunction, value) {
        this.value = value;
        this.id = id++;
        this.previous = previous;
        this.description = description;
        this.transform = transformFunction;
        this.toString = this.toString.bind(this);
    }
    toString () {
        return this.previous ? this.transform(this.previous.toString()) : this.value
    }
}
},{}],6:[function(require,module,exports){
angular.module("manipulateStringsMod", [])
.service("manipulateStringsService", function() {
    this.reverse = function(str) {
        let result = "";
        for (let i = str.length - 1; i > -1; i--) {
            result += str[i];
        }
        return result;
    }
    this.removeDuplicated = function(str) {
        let result = "";
        let duplicated = [];
        outer: for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if (duplicated.indexOf(char) > -1) {
                continue;
            }
            for (let j = 0; j < i; j++) {
                if (str[j] == char) {
                    duplicated.push(char);
                    continue outer;
                }
            }
            for (let j = i+1; j < str.length; j++) {
                if (str[j] == char) {

                    duplicated.push(char);
                    continue outer;
                }
            }
            result+= char;
        }
        return result;
    }
    this.removeSubstringAll = function(str, substring) {
        let resultArray = [];
        let substringLen = substring.length;
        for (let i = 0; i < str.length; i++) {
            resultArray.push(str[i]);
        }
        resultArray.toString = function() {
            return resultArray.join("");
        }
        let i;
        while ((i = resultArray.toString().indexOf(substring), i > -1)) {
            resultArray.splice(i, substringLen);
        }
        return resultArray.toString();
    }
    this.replaceSubstringAll = function(substring, newSubstring) {
        return (str) => {
            let i = 0;
            let len = substring.length;
            let remaining = str.substring(i);
            let frontpart = "";
            while (i = remaining.indexOf(substring), i > -1) {
                // split into front working part and the new remaining
                let workingPart = remaining.substring(0 , i+ len);
                // append the workingPart and make the substitution
                frontpart += workingPart.replace(substring, newSubstring);
                // cut the remaining to exclude the current working part
                remaining = remaining.substring(i + len);
            }
            frontpart += remaining;
            return frontpart;
        }
    }
    this.removeSpaces = function(str) {
        return this.removeSubstringAll(str, " ");
    }
    this.alphabatize = function (str) {
        return str.split("").sort().join("");
    }
});
},{}],7:[function(require,module,exports){
module.exports.template = `
<div>
    <div class = "row">
        <div class="col-lg-6">
            <p>
                Enter any initial string and then you can use the form below to
                transform it. The results of the last transform get piped into
                the next transform you choose.
            </p>
            <div>
                <label for="mainStringInput">
                    Initial String
                </label>
            </div>
            <form name="stringInputForm" data-toggle="tooltip" data-placement="top" title="you can change the input text at any time">
                <input class="form-control main-string-input" name="mainStringInput" type="text" ng-model="inputString"
                    ng-change="inputChange(inputString)" />
            </form>
            
            <transform-list 
                transform-array = "stringResults"
                remove-transform-function = "removeTransform"
            ></transform-list>



        </div>
        <div class="col-lg-6">

            <p class="alert alert-info">
                Use this interface to apply transformations to the string.  After you have 
                created a sequence of transforms, you can change the input string and 
                the entire table will be live-updated.
            </p>
            <div class="main-btn-group-outer form-group card">
                <div class="card-body">
                    <div>
                        <label>Elementary Transformations</label>
                    </div>
                    <select class="form-control" ng-model = "selectedTransform">
                        <option ng-repeat = "opt in transformOptions" value="{{opt.id}}">{{opt.title}}</option>
                    </select>
                    <div ng-show = "selectedTransform == 'alphabetize'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" 
                        class="btn btn-primary alphabatize-string-button" 
                            ng-click="alphabatize(stringResults[stringResults.length - 1].string)"
                        >
                            alphabatize
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'reverse'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" class="btn btn-primary 
                            reverse-string-button" ng-click="reverseString(stringResults[stringResults.length - 1].string)">
                            reverse string
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'nodupes'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine"
                            class="btn btn-primary remove-duplicated-button"
                            ng-click="removeDuplicated(stringResults[stringResults.length - 1].string)">
                            remove chars that appear more than once
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'nospace'">
                        <button ng-disabled="stringInputForm.mainStringInput.$pristine" class="btn btn-primary 
                        remove-spaces-button" ng-click="removeSpaces(stringResults[stringResults.length - 1].string)">
                            remove spaces
                        </button>
                    </div>
                    <div ng-show = "selectedTransform == 'replaceSubstring'">
                        <div class=" form-group">
                            <label for="replaceSubstring">search substring</label>
                            <input type="text" name="replaceSubstring" ng-model="replaceSubstring"
                                class="replace-substring-input form-control" />
                            <label for="newSubstring">new substring</label>
                            <input type="text" name="newSubstring" ng-model="newSubstring"
                                class="new-substring-input form-control" />
                            <button class="replace-substring-button form-control btn btn-primary"
                                ng-click="replaceSubstringAll(replaceSubstring, newSubstring)(inputString)"
                                ng-disabled="!(replaceSubstring.length > 0)">
                                replace
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
},{}],8:[function(require,module,exports){


let createStore = require("redux").createStore;
let transformReducerApp = require("./transform-reducer").transformReducerApp;


let template = require("./manipulate-strings-template").template;
require("./manipulate-strings-service.js");
let Transform = require("./Transform");
angular.module("manipulateStringsApp", ["manipulateStringsMod"])
require("./transform-list.js");

let getRemoveTransformAction = require("./transform-actions.js").getRemoveTransformAction;




angular.module("manipulateStringsApp")
.directive("manipulateStrings", ["manipulateStringsService", function(manipulateStringsService) {
    return {

        template: template,
        controller : ["$scope", "$element", "$timeout", "$window", function($scope, $element, $timeout, $window) {
            $scope.inputString = "";
            $scope.stringResults = [];
            $scope.replaceSubstring = "";
            $scope.newSubstring = "";
           
            $scope.transformOptions = [
                {
                    title: "alphabetize",
                    id : "alphabetize"
                },
                {
                    title: "remove all characters that appear more than once",
                    id : "nodupes"
                },
                {
                    title: "reverse",
                    id : "reverse"
                },
                {
                    title: "remove spaces",
                    id : "nospace"
                },
                {
                    title: "replace substrings",
                    id : "replaceSubstring"
                }
            ];
            $scope.selectedTransform = $scope.transformOptions[0].id;

            $scope.inputChange = function(inputString) {
                let transform = new Transform(null, "init", (x)=>x, inputString);

                $scope.stringResults[0] = transform;
                if ($scope.stringResults[1]) {
                    $scope.stringResults[1].previous = transform;
                }

            }
            $scope.removeDuplicated = function() {
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1],"remove duplicated", (x) => manipulateStringsService.removeDuplicated(x));
                $scope.stringResults.push(transform);
            }
            $scope.reverseString = function() {
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1], "reverse", (x) => manipulateStringsService.reverse(x));
                $scope.stringResults.push(transform);
            }
            $scope.removeSpaces = function() {
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1], "remove spaces", (x) => manipulateStringsService.removeSpaces(x));
                $scope.stringResults.push(transform);
            }
            $scope.replaceSubstringAll = function(substring, newSubstring) {
                let transformFunc = (x)=>manipulateStringsService.replaceSubstringAll(substring, newSubstring)(x);
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1],`replace all ${substring} with ${newSubstring}`, transformFunc);
                $scope.stringResults.push(transform);
            }
            $scope.alphabatize = function() {
                let transformFunc = (x)=>manipulateStringsService.alphabatize(x);
                let transform = new Transform($scope.stringResults[$scope.stringResults.length - 1],`alphabatize`, transformFunc);
                $scope.stringResults.push(transform);
            
            }
            $scope.removeTransform = function(index) {
                this.store.dispatch(getRemoveTransformAction(index));
                // let elts = $($element).find('[data-toggle="tooltip"]');
                // elts.tooltip('dispose');
                // if (index < 1 || index >= $scope.stringResults.length) {
                //     throw new Error("index out of bounds");
                // }
                // if ($window.confirm("Delete this transform?")) {
                //     if (index + 1 < $scope.stringResults.length) {
                //         $scope.stringResults[index + 1].previous = $scope.stringResults[index - 1];
                //     }
                //     $scope.stringResults.splice(index, 1);
                // }
            }
            $scope.$watch("stringResults", function() {
                $timeout(()=>{
                    let elts = $($element).find('[data-toggle="tooltip"]');
                    elts.tooltip();
                }, 0)
                // this is a hack to queue this action
                // after the dom has updated
            }, true);

            

            this.$onInit = function() {
                $scope.store = createStore(transformReducerApp);
                //stringResults

                $scope.store.subscribe(() => {
                    let state = this.store.getState();
                    $scope.stringResults = state.transformList;

                    this.updateStorage(state);
                    this.setState(()=> {return this.updateFromState(state)});
                });



                $($element).find('[data-toggle="tooltip"]').tooltip()
            }
            
        }]
    }
}])
},{"./Transform":5,"./manipulate-strings-service.js":6,"./manipulate-strings-template":7,"./transform-actions.js":9,"./transform-list.js":10,"./transform-reducer":11,"redux":2}],9:[function(require,module,exports){
module.exports.getRemoveTransformAction = function(index) {
    return {
        type: "REMOVE_TRANSFORM",
        index : index
    }
}

module.exports.getAddTransformAction = function (description, transformFunction) {
    return {
        type: "ADD_TRANSFORM",
        description: description,
        transformFunction: transformFunction,
    }
}
},{}],10:[function(require,module,exports){
const template = `
<div>
    <h2>Transform List</h2>
    <table class="result-array-container table">
        <thead>
            <tr>
                <th class="index-col" scope="col">#</th>
                <th scope="col" class="function-col">Transformation</th>
                <th scope="col">Result</th>
                <th scope="col" lass="remove-button">Delete</th>
            </tr>
        </thead>
        <tbody>
            <tr class="" ng-repeat="transform in transformArray track by transform.id">
                <th class="index-col" scope="row">{{ $index }}</th>
                <td class="function-col">{{transform.description}}</td>
                <td class=""><span class="result-string">{{ transform.toString() }}</span></td>
                <td class="remove-button">
                    <span class = "btn-span" ng-if="$index > 0" data-remove-button="{{ $index }}"
                        ng-click="removeTransform($index)"
                        data-toggle="tooltip"
                        data-placement="top" 
                        title="remove just this transform from the sequence"    
                    >
                        delete
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`
angular.module("manipulateStringsApp")
.directive("transformList", function() {
    return {
        template : template,
        restrict : "E",
        scope: {
            transformArray: "<",
            removeTransformFunction: "<"
        },
        controller : function() {
            this.$onChanges = function () {
                console.log("onchange");
            }
            
        }
    }
});
},{}],11:[function(require,module,exports){

let Transform = require("./Transform");


// makes a shallow copy
var cloneTransformList = function(list) {
    let clone = [];
    for (let i = 0; i < list.length; i++) {
        clone.push(list[i]);
    }
    return clone;
}

var cloneState = function(state) {
    cloneTransformList(state.transformList);
}

const init = {
    transformList : []
}
module.exports.transformReducerApp = function(state, action) {

    if (typeof state == "undefined") {
        return init;
    }
    let newState = cloneState(state);
    switch (action.type) {
        case "REMOVE_TRANSFORM":
            newState.transformList.splice(action.index, 1);
            break;
        case "ADD_TRANSFORM":
            let len = newState.transformList.length;
            let previous;
            if (len == 0) {
                previous = null
            } else {
                previous = newState.transformList[len - 1];
            }
            newState.transformList.push(new Transform(previous, action.description, action.transformFunction))

    }
    return newState;
}
},{"./Transform":5}]},{},[8]);
