# `asyncStateVar` for LitState

This is an asynchronous variation of the default `stateVar` from
[LitState](https://github.com/gitaarik/lit-state). It makes dealing with
asynchronous data in your app easy.

## Installation

```
npm install lit-state-async-state-var
```

## Usage

```javascript
import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';

class MyState extends LitState {

    myAsyncStateVar = asyncStateVar(() => this._getData());

    _getData() {

        return new Promise((resolve, reject) => {
            
            setTimeout(() => {
                resolve('some async data');
            }, 3000);

        });

    }

}
```

See the [demo app](https://gitaarik.github.io/lit-state-async-state-var/demo-app/build/)
for more info.
