import { LitState, asyncStateVar } from 'lit-element-state';


class DemoState extends LitState {

    data = asyncStateVar({
        get: () => this._getData(),
        set: value => this._setData(value),
        default: "[default value]"
    });

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