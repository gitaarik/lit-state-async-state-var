import { BaseStateVar } from '../web_modules/lit-element-state.js';

class AsyncStateVar extends BaseStateVar {
  constructor(options) {
    super();
    this._options = options;

    this._init();
  }

  [Symbol.toPrimitive](hint) {
    return this.getValue();
  }

  valueOf() {
    return this.getValue();
  }

  isPending() {
    return this.isPendingGet() || this.isPendingSet();
  }

  isPendingGet() {
    this._recordRead();

    return this._pendingGet;
  }

  isPendingSet() {
    this._recordRead();

    return this._pendingSet;
  }

  isPendingChange() {
    this._recordRead();

    return this._pendingChange;
  }

  isRejected() {
    return this.isRejectedGet() || this.isRejectedSet();
  }

  isRejectedGet() {
    this._recordRead();

    return this._rejectedGet;
  }

  isRejectedSet() {
    this._recordRead();

    return this._rejectedSet;
  }

  getError() {
    return this.getErrorGet() || this.getErrorSet();
  }

  getErrorGet() {
    this._recordRead();

    return this._errorGet;
  }

  getErrorSet() {
    this._recordRead();

    return this._errorSet;
  }

  isFulfilled() {
    return this.isFulfilledGet() || this.isFulfilledSet();
  }

  isFulfilledGet() {
    this._recordRead();

    return this._fulfilledGet;
  }

  isFulfilledSet() {
    this._recordRead();

    return this._fulfilledSet;
  }

  getValue() {
    this._recordRead();

    if (this._pendingChange) return this._newValue;
    return this._value;
  }

  hasChange() {
    this._recordRead();

    return this._hasChange;
  }

  reset() {
    if (!this._hasChange) return;
    this._pendingChange = false;

    this._notifyChange();
  }

  restore() {
    if (!this._hasChange) return;
    this._pendingChange = true;

    this._notifyChange();
  }

  push(value = undefined) {
    if (value === undefined) {
      if (this._pendingChange) {
        this._pushValue(this._newValue);
      } else {
        this._pushValue(this._value);
      }
    } else {
      this._pushValue(value);
    }
  }

  reload() {
    this._loadValue();
  }

  _init() {
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
    this._value = this._hasOption('initialValue') ? this._getOption('initialValue') : null;
    this._hasChange = false;
    this._newValue = null;
  }

  _getOption(key) {
    if (this._hasOption(key)) {
      return this._options[key];
    } else {
      throw `asyncStateVar missing '${key}' option.`;
    }
  }

  _hasOption(key) {
    return key in this._options;
  }

  _handleGet() {
    if (this._hasOption('get')) {
      this._initGet();
    }

    return this;
  }

  _handleSet(value) {
    this._newValue = value;

    if (this._newValue === this._value) {
      this._hasChange = false;
      this._pendingChange = false;
    } else {
      this._hasChange = true;
      this._pendingChange = true;
    }

    this._notifyChange();
  }

  _initGet() {
    if (this._initiatedGet) return;
    this._initiatedGet = true;

    this._loadValue();
  }

  _loadValue() {
    this._pendingGet = true;
    this._rejectedGet = false;
    this._fulfilledGet = false;
    this._fulfilledGet = false;

    this._notifyChange();

    this._getOption('get')().then(value => {
      this._fulfilledGet = true;
      this._value = value;
      this._errorGet = null;
      this._pendingChange = false;
      this._hasChange = false;
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
    this._pendingSet = true;
    this._fulfilledSet = false;
    this._fulfilledGet = false;
    this._rejectedSet = false;

    this._notifyChange();

    this._getOption('set')(value).then(value => {
      this._fulfilledSet = true;
      this._value = value;
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

}

export function asyncStateVar(options) {
  return new AsyncStateVar(options);
}