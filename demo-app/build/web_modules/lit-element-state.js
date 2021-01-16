// import { LitElement } from 'lit-element';


const observeState = superclass => class extends superclass {

    constructor() {
        super();
        this._observers = [];
    }

    update(changedProperties) {
        stateRecorder.start();
        super.update(changedProperties);
        this._initStateObservers();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._clearStateObservers();
    }

    _initStateObservers() {
        this._clearStateObservers();
        if (!this.isConnected) return;
        this._addStateObservers(stateRecorder.finish());
    }

    _addStateObservers(stateVars) {
        for (let [state, keys] of stateVars) {
            const observer = () => this.requestUpdate();
            this._observers.push([state, observer]);
            state.addObserver(observer, keys);
        }
    }

    _clearStateObservers() {
        for (let [state, observer] of this._observers) {
            state.removeObserver(observer);
        }
        this._observers = [];
    }

};


// export const LitStateElement = observeState(LitElement);


class LitState {

    static stateVars = {};

    constructor() {
        this._observers = [];
        this._initStateVars();
    }

    addObserver(observer, keys) {
        this._observers.push({observer, keys});
    }

    removeObserver(observer) {
        this._observers = this._observers.filter(observerObj => observerObj.observer !== observer);
    }

    _initStateVars() {
        for (let [name, options] of Object.entries(this.constructor.stateVars)) {
            this._initStateVar(name, options);
        }
    }

    _initStateVar(name, options) {

        if (!options.handler) {
            options.handler = StateVar;
        }

        const stateVar = new options.handler({
            options: options,
            recordRead: () => this._recordRead(name),
            notifyChange: () => this._notifyChange(name)
        });

        Object.defineProperty(
            this,
            name,
            {
                get() {
                    return stateVar.get();
                },
                set(value) {
                    if (stateVar.shouldSetValue(value)) {
                        stateVar.set(value);
                    }
                },
                configurable: true,
                enumerable: true
            }
        );

    }

    _recordRead(key) {
        stateRecorder.recordRead(this, key);
    }

    _notifyChange(key) {
        for (const observerObj of this._observers) {
            if (!observerObj.keys || observerObj.keys.includes(key)) {
                observerObj.observer(key);
            }
        }    }

}


class StateVar {

    constructor(args) {
        this.options = args.options; // The options given in the `stateVar` declaration
        this.recordRead = args.recordRead; // Callback to indicate the `stateVar` is read
        this.notifyChange = args.notifyChange; // Callback to indicate the `stateVar` value has changed
        this.value = undefined; // The initial value
    }

    // Called when the `stateVar` on the `State` class is read.
    get() {
        this.recordRead();
        return this.value;
    }

    // Returns whether the given `value` should be passed on to the `set()`
    // method. Can be used for validation and/or optimization.
    shouldSetValue(value) {
        return this.value !== value;
    }

    // Called when the `stateVar` on the `State` class is set.
    set(value) {
        this.value = value;
        this.notifyChange();
    }

}


class StateRecorder {

    constructor() {
        this._log = null;
    }

    start() {
        this._log = new Map();
    }

    recordRead(stateObj, key) {
        if (this._log === null) return;
        const keys = this._log.get(stateObj) || [];
        if (!keys.includes(key)) keys.push(key);
        this._log.set(stateObj, keys);
    }

    finish() {
        const stateVars = this._log;
        this._log = null;
        return stateVars;
    }

}

const stateRecorder = new StateRecorder();

export { LitState, StateVar, observeState };
