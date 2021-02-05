import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';
import { currentTime } from '@app/current-time.js';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            initialValue: '[initial value]',
            get: () => this._getData()
        };
    }

    _induceReject = false;

    _getData() {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                if (this._induceReject) {
                    reject("simulated reject");
                    this._induceReject = false;
                } else {
                    resolve("Hello world (" + currentTime() + ")");
                }

            }, 3000);

        });

    }

    induceReject() {
        this._induceReject = true;
        this.data.reload();
    }

}


export const demoState = new DemoState();
