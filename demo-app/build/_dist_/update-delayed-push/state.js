function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { LitState } from '../../web_modules/lit-element-state.js';
import { asyncStateVar } from '../async-state-var.js';

class DemoState extends LitState {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "data", asyncStateVar({
      get: () => this._getData(),
      set: value => this._setData(value),
      initialValue: "[initial value]"
    }));

    _defineProperty(this, "_fakeApiResponse", "Hello world");
  }

  _getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this._fakeApiResponse);
      }, 3000);
    });
  }

  _setData(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._fakeApiResponse = value;
        resolve(this._fakeApiResponse);
      }, 3000);
    });
  }

}

export const demoState = new DemoState();