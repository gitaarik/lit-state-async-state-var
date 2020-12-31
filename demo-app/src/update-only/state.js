import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';


class DemoState extends LitState {

    data = asyncStateVar({
        set: value => this._setData(value),
        initialValue: "[initial value]"
    });

    _setData(value) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(value);
            }, 3000);
        });
    }

}


export const demoState = new DemoState();
