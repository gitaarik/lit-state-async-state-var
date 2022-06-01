import { StateVar, stateVar } from '../web_modules/lit-element-state.js';

class AsyncStateVarHandler extends StateVar {
  constructor(args) {
    super(args); // These methods are proxied to the `stateObject`. They are public API
    // functions for the developer.

    this.proxyMethods = ['valueOf', 'getValue', 'isPending', 'isPendingGet', 'isPendingSet', 'isPendingChange', 'isRejected', 'isRejectedGet', 'isRejectedSet', 'getError', 'getErrorGet', 'getErrorSet', 'isFulfilled', 'isFulfilledGet', 'isFulfilledSet', 'hasChange', 'reset', 'restore', 'push', 'reload'];

    this._init();
  }

  [Symbol.toPrimitive](hint) {
    return this.getValue();
  }

  _init() {
    this.value = this._hasOption('initialValue') ? this._getOption('initialValue') : null;
    this._initiatedGet = false;
    this._pendingGet = false;
    this._pendingSet = false;
    this._pendingChange = false;
    this._fulfilledGet = false;
    this._fulfilledSet = false;
    this._rejectedGet = false;
    this._rejectedSet = false;
    this._errorGet = null;
    this._errorSet = null;
    this._hasChange = false;
    this._newValue = null;
  }

  _getOption(key) {
    if (this._hasOption(key)) {
      return this.options[key];
    } else {
      throw `asyncStateVar missing '${key}' option.`;
    }
  }

  _hasOption(key) {
    return key in this.options;
  }

  get() {
    this._initFirstGet();

    if (typeof this.getValue() === 'object') {
      return this._stateObj;
    } else {
      return this;
    }
  }

  get _stateObj() {
    // Creates and returns a `stateObject`. This object is a clone of the
    // object that is set in the current value of the `asyncStateVar`. Then
    // the `this.proxyMethods` are added to it's properties. Giving the
    // developer access to both the object and the state on the
    // `asyncStateVar`.
    //
    // The original object can always be recovered with the `getValue()`
    // proxy method.
    const stateObject = Object.create(this.getValue());
    stateObject.__asyncStateVarHandler = this;

    for (let method of this.proxyMethods) {
      stateObject[method] = function () {
        return this.__asyncStateVarHandler[method](arguments);
      };
    }

    return stateObject;
  }

  set(value) {
    this._newValue = value;

    if (this._newValue === this.value) {
      this._hasChange = false;
      this._pendingChange = false;
    } else {
      this._hasChange = true;
      this._pendingChange = true;
    }

    this._notifyChange();
  }

  _initFirstGet() {
    if (!this._hasOption('get') || this._initiatedGet) {
      return;
    }

    this._initiatedGet = true;
    this._pendingGet = true;
    this._rejectedGet = false;
    this._fulfilledGet = false;

    this._loadValue();
  }

  _loadValue() {
    this._getOption('get')().then(value => {
      this._fulfilledGet = true;
      this._errorGet = null;
      this._pendingChange = false;
      this._hasChange = false;
      this.value = value;
    }).catch(error => {
      this._rejectedGet = true;
      this._errorGet = error;
    }).finally(() => {
      this._pendingGet = false;
      this._rejectedSet = false;

      this._notifyChange();
    });
  }

  _pushValue(value) {
    this._getOption('set')(value).then(value => {
      this._fulfilledSet = true;
      this.value = value;
      this._pendingChange = false;
      this._hasChange = false;
    }).catch(error => {
      this._rejectedSet = true;
      this._errorSet = error;
    }).finally(() => {
      this._pendingSet = false;
      this._rejectedGet = false;

      this._notifyChange();
    });
  }

  _notifyChange() {
    this.notifyChange();
  }

  isPending() {
    return this.isPendingGet() || this.isPendingSet();
  }

  isPendingGet() {
    this.recordRead();
    return this._pendingGet;
  }

  isPendingSet() {
    this.recordRead();
    return this._pendingSet;
  }

  isPendingChange() {
    this.recordRead();
    return this._pendingChange;
  }

  isRejected() {
    return this.isRejectedGet() || this.isRejectedSet();
  }

  isRejectedGet() {
    this.recordRead();
    return this._rejectedGet;
  }

  isRejectedSet() {
    this.recordRead();
    return this._rejectedSet;
  }

  getError() {
    return this.getErrorGet() || this.getErrorSet();
  }

  getErrorGet() {
    this.recordRead();
    return this._errorGet;
  }

  getErrorSet() {
    this.recordRead();
    return this._errorSet;
  }

  isFulfilled() {
    return this.isFulfilledGet() || this.isFulfilledSet();
  }

  isFulfilledGet() {
    this.recordRead();
    return this._fulfilledGet;
  }

  isFulfilledSet() {
    this.recordRead();
    return this._fulfilledSet;
  }

  getValue() {
    this.recordRead();
    if (this._pendingChange) return this._newValue;
    return this.value;
  }

  hasChange() {
    this.recordRead();
    return this._hasChange;
  }

  reset() {
    this._pendingChange = false;
    this._fulfilledGet = false;
    this._fulfilledSet = false;
    this._rejectedGet = false;
    this._rejectedSet = false;

    this._notifyChange();
  }

  restore() {
    if (!this._hasChange) return;
    this._pendingChange = true;

    this._notifyChange();
  }

  push(value) {
    this._pendingSet = true;
    this._fulfilledSet = false;
    this._fulfilledGet = false;
    this._rejectedSet = false;

    this._notifyChange();

    if (value === undefined) {
      if (this._pendingChange) {
        this._pushValue(this._newValue);
      } else {
        this._pushValue(this.value);
      }
    } else {
      this._pushValue(value);
    }
  }

  reload() {
    this._pendingGet = true;
    this._rejectedGet = false;
    this._fulfilledGet = false;
    this._fulfilledGet = false;

    this._notifyChange();

    this._loadValue();
  }

}

export function asyncStateVar() {
  return stateVar({
    handler: AsyncStateVarHandler
  });
}