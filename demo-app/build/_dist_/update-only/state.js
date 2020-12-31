function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { LitState } from '../../web_modules/lit-element-state.js';
import { asyncStateVar } from '../async-state-var.js';

class DemoState extends LitState {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "data", asyncStateVar({
      set: value => this._setData(value),
      initialValue: "[initial value]"
    }));
  }

  _setData(value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(value);
      }, 3000);
    });
  }

}

export const demoState = new DemoState();