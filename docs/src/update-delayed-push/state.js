import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            get: () => this._getData(),
            set: value => this._setData(value),
            initialValue: "[initial value]"
        };
    };

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

    _fakeApiResponse = "Hello world";

}


export const demoState = new DemoState();
