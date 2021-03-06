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
        if (!this.constructor.stateVars) return;
        for (let [key, options] of Object.entries(this.constructor.stateVars)) {
            this._initStateVar(key, options);
        }
    }

    _initStateVar(key, options) {

        options = this._parseOptions(options);

        const stateVar = new options.handler({
            options: options,
            recordRead: () => this._recordRead(key),
            notifyChange: () => this._notifyChange(key)
        });

        Object.defineProperty(
            this,
            key,
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

    _parseOptions(options) {

        if (!options.handler) {
            options.handler = StateVar;
        } else {

            // In case of a custom `StateVar` handler is provided, we offer a
            // second way of providing options to your custom handler class.
            //
            // You can decorate a *method* with `@stateVar()` instead of a
            // variable. The method must return an object, and that object will
            // be assigned to the `options` object.
            //
            // Within the method you have access to the `this` context. So you
            // can access other properties and methods from your state class.
            // And you can add arrow function callbacks where you can access
            // `this`. This provides a lot of possibilities for a custom
            // handler class.
            if (options.propertyMethod && options.propertyMethod.kind === 'method') {
                Object.assign(options, options.propertyMethod.descriptor.value.call(this));
            }

        }

        return options;

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


function stateVar(options = {}) {

    return element => {

        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(litStateClass) {

                if (element.kind === 'method') {
                    options.propertyMethod = element;
                }

                if (litStateClass.stateVars === undefined) {
                    litStateClass.stateVars = {};
                }

                litStateClass.stateVars[element.key] = options;

            }
        };

    };

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

export { LitState as L, StateVar as S, observeState as o, stateVar as s };
