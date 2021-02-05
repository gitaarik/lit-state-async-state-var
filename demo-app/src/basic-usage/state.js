import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';
import { currentTime } from '@app/current-time.js';


class DemoState extends LitState {

    /*@asyncStateVar({
        get: '_getData',
        set: '_setData'
    })
    data = '[initial value]';*/

    @asyncStateVar()
    data() {
        return {
            initialValue: '[initial value]',
            get: () => this._getData(),
            // set: value => this._setData(value)
        };
    }

    _simulateError = false;

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

    _fakeApiResponseText = "Hello world";

    _fakeApiResponse() {
        return this._fakeApiResponseText + " (" + currentTime() + ")";
    }

    simulateErrorReload() {
        this._simulateError = true;
        this.data.reload();
    }

}


export const demoState = new DemoState();
