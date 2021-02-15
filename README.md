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

    @asyncStateVar()
    myData() {
        return {
            get: () => this._getData()
        }
    };

    _getData() {

        return new Promise((resolve, reject) => {
            
            setTimeout(() => {
                resolve('some async data');
            }, 3000);

        });

    }

}
```

See the [docs](https://gitaarik.github.io/lit-state-async-state-var/docs/build/)
for more examples.


## Explanation

It's not uncommon for a modern web-app to have asynchronous data. For example:
when the page loads you want to fetch some data from a REST API. It's also not
uncommon that this data is used in multiple components; a shared state.

Therefore `asyncStateVar` is a special kind of `stateVar` that provides a
convenient way of dealing with asynchronous data.

When using the `asyncStateVar()`, you decorate a method instead of a variable.
From within a method you can access `this`. We'll use this to call
`this._getData()` to return the promise that gets our data. We return this in
an object containing a `get` key:

```javascript
import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';

class MyState extends LitState {

    @asyncStateVar()
    myData() {
        return {
            get: () => this._getData()
        };
    }

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
can then get the value simply by calling `myState.myData`, or if the promise
was rejected, get the error with `getError()`.

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
            return myState.myData;
        }
    }

}
```

You can also use `myState.myData.reload()` to re-execute the promise.

Check the [docs](https://gitaarik.github.io/lit-state-async-state-var/docs/build/)
to see how `asyncStateVar` works.


## Asynchronous updates

Besides fetching data from an API, we also might want to update the data. In
this case, we write our state class like this:

```javascript
import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';

class MyState extends LitState {

    @asyncStateVar()
    myData() {
        return {
            get: () => this._getData(),
            set: value => this._setData(value),
            initialValue: 'initial value' // optional
        }
    }

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

You can set a new value using the `push()` functions:

```javascript
myState.myData.push('new value');
```

This will execute the `_setData()` function. If the promise is succesful and
the `resolve()` callback is called, the value given to that callback will be
set as the new value for `myState.myData`. If the promise fails, no new value
will be set, and the `reject()` callback is called. The error value given to
the `reject()` callback will be accesible with the `getErrorSet()` method.

**Hint**: When you have both **get** and **set** functions on your
`asyncStateVar`, the errors for both promises can be separately accessed with
`getErrorGet()` for the **get** promise, and `getErrorSet()` for the **set**
promise.

Check the [docs](https://gitaarik.github.io/lit-state-async-state-var/docs/build/#update)
to see how `asyncStateVar` with updates works.


## Update with delayed push

Sometimes you want to update your UI before you send the update to your API.
You can set a new value without executing the **set** promies by just doing
`myState.myData = 'new value';`. This will re-render your components with the
new value. When you finally want to push the change to your API, you can use
`push()` without any arguments. Or if you don't want to push the new value, but
go back to the original value, use `reset()`. If you didn't mean to reset the
change, you can restore it with `restore()`.

### Set a new value

```javascript
myState.myData = 'new value';
```

### Push the change

```javascript
myState.myData.push();
```

### Reset the unpushed change

```javascript
myState.myData.reset();
```

### Restore the resetted change

```javascript
myState.myData.restore();
```

Check the [docs](https://gitaarik.github.io/lit-state-async-state-var/docs/build/#update-delayed-push)
to see how delayed updates works.


## Check `asyncStateVar` status

Use the following methods to check the status of the promise(s):

```javascript
isPending()         // 'get' or 'set' is pending
isPendingGet()      // 'get' is pending
isPendingSet()      // 'set' is pending
isPendingChange()   // A new value has been set that has not yet been pushed
hasChange()         // Wether there is a resetted change that can be restored

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
