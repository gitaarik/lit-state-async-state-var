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

    myAsyncStateVar = asyncStateVar({
        get: () => this._getData()
    });

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
for more examples.


## Explanation

It's not uncommon for a modern web-app to have asynchronous data. For example:
when the page loads you want to fetch some data from a REST API. It's also not
uncommon that this data is used in multiple components; a shared state.

Therefore `asyncStateVar` is a special kind of `stateVar` that provides a
convenient way of dealing with asynchronous data.

The `asyncStateVar()` function takes as its first argument a function that
returns a promise. When the variable is used in a component, the promise will
automatically be executed. When it is resolved or rejected, the component that
uses the variable will automatically re-render.

Here is a state class with an `asyncStateVar`:

```javascript
import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';

class MyState extends LitState {

    myData = asyncStateVar({
        get: () => this._getData()
    });

    _getData() {

        return new Promise((resolve, reject) => {

            fetchDataFromApi().then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });

        });

    }

}

export const myState = new MyState();
```

In the component, you can check the status of the promise with the functions
`isPending()`, `isRejected()` and `isFulfilled()` on the `asyncStateVar`. For
example: `myState.myData.isPending()`. Based on the status of the promise you
can then either call `getValue()` or `getError()`. `getError()` returns the
error in case a promise was rejected:

```javascript
import { LitElement } from 'lit-element';
import { observeState } from 'lit-element-state';
import { myState } from './my-state.js';

class MyElement extends observeState(LitElement) {

    render() {
        if (myState.myData.isPending()) {
            return html`loading data...`;
        } else if (myState.myData.isRejected()) {
            return html`loading data failed with error: ${myState.myData.getError()}`;
        } else {
            return myState.myData.getValue();
        }
    }

}
```

You can also use `myState.myData.reload()` to re-execute the promise.

Check the [demo app](https://gitaarik.github.io/lit-state-async-state-var/demo-app/build/)
to see how `asyncStateVar` works.


## Asynchronous updates

Besides fetching data from an API, we also might want to update the data. In
this case, we write our state class like this:

```javascript
import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';

class MyState extends LitState {

    myData = asyncStateVar({
        get: () => this._getData(),
        set: value => this._setData(value),
        initialValue: 'initial value' // optional
    });

    _getData() {

        return new Promise((resolve, reject) => {

            fetchDataFromApi().then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });

        });

    }

    _setData(value) {

        return new Promise((resolve, reject) => {

            sendDataToApi(value).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });

        });

    }

}

export const myState = new MyState();
```

Check the [demo app](https://gitaarik.github.io/lit-state-async-state-var/demo-app/build/#update)
to see how `asyncStateVar` with updates works.


## Update the UI before executing the promise

Sometimes you want to update your UI before you send the update to your API.
For this you can use the `setCache(value)` method of `asyncStateVar`. This will
re-render your components with the cached value. When you finally want to push
the update to your API, you can use `pushCache()`. Or if you wish to go back to
the original value, use dropCache():

### Set the cache

```javascript
myState.myData.setCache('value');
```

### Push the cache

```javascript
myState.myData.pushCache();
```

### Drop the cache

```javascript
myState.myData.dropCache();
```

Check the [demo app](https://gitaarik.github.io/lit-state-async-state-var/demo-app/build/#update-with-cache)
to see how `setCache()` works.


## Check `asyncStateVar` status

Use the following methods to check the status of the promise(s):

```javascript
isPending()         // 'get' or 'set' is pending
isPendingGet()      // 'get' is pending
isPendingSet()      // 'set' is pending
isPendingCache()    // A cache that has been set with `setCache()` is not yet
                    // pushed with `pushCache()`

isRejected()        // 'get' or 'set' is rejected
isRejectedGet()     // 'get' is rejected
isRejectedSet()     // 'set' is rejected

getError()          // 'get' or 'set' error (if any)
getErrorGet()       // 'get' error (if any)
getErrorSet()       // 'set' error (if any)

isFulfilled()       // 'get' or 'set' is fulfilled
isFulfilledGet()    // 'get' is fulfilled
isFulfilledSet()    // 'set' is fulfilled
```
