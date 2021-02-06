import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';
import { currentTime } from '@app/current-time.js';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            initialValue: {
                value1: '[initial value1]',
                value2: '[initial value2]'
            },
            get: () => this._getData()
        };
    }

    _getData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    value1: 'Hello World 1 "' + currentTime() + '"',
                    value2: 'Hello World 2 "' + currentTime() + '"'
                });
            }, 3000);
        });
    }

}


export const demoState = new DemoState();
