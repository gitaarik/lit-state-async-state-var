import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            initialValue: "[initial value]",
            set: value => this._setData(value)
        };
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
