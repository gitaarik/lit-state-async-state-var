import './common/lit-element-7d33ee9a.js';

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


class LitState {

    constructor() {

        this._stateVars = [];
        this._observers = [];

        return new Proxy(this, {

            set: (obj, key, value) => {

                if (this._isStateVar(key)) {
                    const return_value = obj[key]._handleSet(value);
                    if (return_value !== undefined) {
                        return return_value;
                    }
                } else if (value instanceof BaseStateVar) {
                    this._stateVars.push(key);
                    value._recordRead = () => this._recordRead(key);
                    value._notifyChange = () => this._notifyChange(key);
                    obj[key] = value;
                } else {
                    obj[key] = value;
                }

                return true;

            },

            get: (obj, key) => {

                if (obj._isStateVar(key)) {
                    return obj[key]._handleGet();
                }

                return obj[key];

            }

        });

    }

    addObserver(observer, keys) {
        this._observers.push({observer, keys});
    }

    removeObserver(observer) {
        this._observers = this._observers.filter(observerObj => observerObj.observer !== observer);
    }

    _isStateVar(key) {
        return this._stateVars.includes(key);
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


class BaseStateVar {
    _handleGet() {}
    _handleSet(value) {}
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

export { BaseStateVar, LitState, observeState };
