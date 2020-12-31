function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { LitState } from '../../web_modules/lit-element-state.js';
import { asyncStateVar } from '../async-state-var.js';
import { currentTime } from '../../web_modules/lit-element-demo-app-helpers.js';

class DemoState extends LitState {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "data", asyncStateVar({
      get: () => this._getData(),
      initialValue: '[initial value]'
    }));

    _defineProperty(this, "_simulateError", false);

    _defineProperty(this, "_fakeApiResponseText", "Hello world");
  }

  _getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this._simulateError) {
          reject("fake load data error");
          this._simulateError = false;
        } else {
          resolve(this._fakeApiResponse());
        }
      }, 3000);
    });
  }

  _fakeApiResponse() {
    return this._fakeApiResponseText + " (" + currentTime() + ")";
  }

  simulateErrorReload() {
    this._simulateError = true;
    this.data.reload();
  }

}

export const demoState = new DemoState();