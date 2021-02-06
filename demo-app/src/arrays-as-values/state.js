import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';
import { currentTime } from '@app/current-time.js';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            initialValue: ['[initial value1]', '[initial value2]'],
            get: () => this._getData()
        };
    }

    _getData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([
                    'Hello World 1 "' + currentTime() + '"',
                    'Hello World 2 "' + currentTime() + '"'
                ]);
            }, 3000);
        });
    }

}


export const demoState = new DemoState();
