import { StateVar, stateVar } from 'lit-element-state';


class AsyncStateVarHandler extends StateVar {

    constructor(args) {
        super(args);
        this._init();
    }

    _init() {
        this._initiatedGet = false;
        this._pendingGet = false;
        this._pendingSet = false;
        this._pendingChange = false;
        this._fulfilledGet = false;
        this._fulfilledSet = false;
        this._rejectedGet = false;
        this._rejectedSet = false;
        this._errorGet = null;
        this._errorSet = null;
        this._value = this._hasOption('initialValue') ? this._getOption('initialValue') : null;
        this._hasChange = false;
        this._newValue = null;
    }

    _getOption(key) {
        if (this._hasOption(key)) {
            return this.options[key];
        } else {
            throw `asyncStateVar missing '${key}' option.`;
        }
    }

    _hasOption(key) {
        return (key in this.options);
    }

    get() {
        this._initGet();
        return new AsyncStateVarObj(this);
    }

    set(value) {

        this._newValue = value;

        if (this._newValue === this.value) {
            this._hasChange = false;
            this._pendingChange = false;
        } else {
            this._hasChange = true;
            this._pendingChange = true;
        }

        this._notifyChange();

    }

    _initGet() {

        if (!this._hasOption('get') || this._initiatedGet) return;
        this._initiatedGet = true;

        this._pendingGet = true;
        this._rejectedGet = false;
        this._fulfilledGet = false;
        this._fulfilledGet = false;

        this._loadValue();

    }

    _loadValue() {
        this._getOption('get')().then(value => {
            this._fulfilledGet = true;
            this._errorGet = null;
            this._pendingChange = false;
            this._hasChange = false;
            this._value = value;
        }).catch(error => {
            this._rejectedGet = true;
            this._errorGet = error;
        }).finally(() => {
            this._pendingGet = false;
            this._rejectedSet = false;
            this._notifyChange();
        });
    }

    _pushValue(value) {
        this._getOption('set')(value).then(value => {
            this._fulfilledSet = true;
            this._value = value;
            this._pendingChange = false;
            this._hasChange = false;
        }).catch(error => {
            this._rejectedSet = true;
            this._errorSet = error;
        }).finally(() => {
            this._pendingSet = false;
            this._rejectedGet = false;
            this._notifyChange();
        });
    }

    _notifyChange() {
        this.notifyChange();
    }

    isPending() {
        return this.isPendingGet() || this.isPendingSet();
    }

    isPendingGet() {
        this.recordRead();
        return this._pendingGet;
    }

    isPendingSet() {
        this.recordRead();
        return this._pendingSet;
    }

    isPendingChange() {
        this.recordRead();
        return this._pendingChange;
    }

    isRejected() {
        return this.isRejectedGet() || this.isRejectedSet();
    }

    isRejectedGet() {
        this.recordRead();
        return this._rejectedGet;
    }

    isRejectedSet() {
        this.recordRead();
        return this._rejectedSet;
    }

    getError() {
        return this.getErrorGet() || this.getErrorSet();
    }

    getErrorGet() {
        this.recordRead();
        return this._errorGet;
    }

    getErrorSet() {
        this.recordRead();
        return this._errorSet;
    }

    isFulfilled() {
        return this.isFulfilledGet() || this.isFulfilledSet();
    }

    isFulfilledGet() {
        this.recordRead();
        return this._fulfilledGet;
    }

    isFulfilledSet() {
        this.recordRead();
        return this._fulfilledSet;
    }

    getValue() {
        this.recordRead();
        if (this._pendingChange) return this._newValue;
        return this._value;
    }

    hasChange() {
        this.recordRead();
        return this._hasChange;
    }

    reset() {
        this._pendingChange = false;
        this._fulfilledGet = false;
        this._fulfilledSet = false;
        this._rejectedGet = false;
        this._rejectedSet = false;
        this._notifyChange();
    }

    restore() {
        if (!this._hasChange) return;
        this._pendingChange = true;
        this._notifyChange();
    }

    push(value) {

        this._pendingSet = true;
        this._fulfilledSet = false;
        this._fulfilledGet = false;
        this._rejectedSet = false;

        this._notifyChange();

        if (value === undefined) {
            if (this._pendingChange) {
                this._pushValue(this._newValue);
            } else {
                this._pushValue(this.value);
            }
        } else {
            this._pushValue(value);
        }

    }

    reload() {

        this._pendingGet = true;
        this._rejectedGet = false;
        this._fulfilledGet = false;
        this._fulfilledGet = false;
        this._notifyChange();

        this._loadValue();

    }

}


class AsyncStateVarObj {

    constructor(asyncStateVarHandler) {

        this.__asyncStateVarHandler = asyncStateVarHandler;

        if (typeof this.getValue() === 'object') {
            // When the value is an object, set the properties of that object
            // on this class, so that those properties are easily accessible by
            // doing `stateObj.stateVar.propertyName`. If the object also
            // contains methods the user needs to access, one should use
            // `stateObj.stateVar.getValue().methodName()`. `getValue()`
            // returns the original value. Without `getValue()`, you'll get
            // this object, which contains the helper methods like
            // `isPending()` and `isFulfilled()` etc.
            Object.assign(this, this.getValue());
        }

    }

    [Symbol.toPrimitive](hint) {
        return this.getValue();
    }

    valueOf() {
        return this.getValue();
    }

    getValue() {
        return this.__asyncStateVarHandler.getValue();
    }

    isPending() {
        return this.isPendingGet() || this.isPendingSet();
    }

    isPendingGet() {
        return this.__asyncStateVarHandler.isPendingGet();
    }

    isPendingSet() {
        return this.__asyncStateVarHandler.isPendingSet();
    }

    isPendingChange() {
        return this.__asyncStateVarHandler.isPendingChange();
    }

    isRejected() {
        return this.__asyncStateVarHandler.isRejected();
    }

    isRejectedGet() {
        return this.__asyncStateVarHandler.isRejectedGet();
    }

    isRejectedSet() {
        return this.__asyncStateVarHandler.isRejectedSet();
    }

    getError() {
        return this.__asyncStateVarHandler.getError();
    }

    getErrorGet() {
        return this.__asyncStateVarHandler.getErrorGet();
    }

    getErrorSet() {
        return this.__asyncStateVarHandler.getErrorSet();
    }

    isFulfilled() {
        return this.__asyncStateVarHandler.isFulfilled();
    }

    isFulfilledGet() {
        return this.__asyncStateVarHandler.isFulfilledGet();
    }

    isFulfilledSet() {
        return this.__asyncStateVarHandler.isFulfilledSet();
    }

    hasChange() {
        return this.__asyncStateVarHandler.hasChange();
    }

    reset() {
        return this.__asyncStateVarHandler.reset();
    }

    restore() {
        return this.__asyncStateVarHandler.restore();
    }

    push(value = undefined) {
        return this.__asyncStateVarHandler.push(value);
    }

    reload() {
        return this.__asyncStateVarHandler.reload();
    }

}


export function asyncStateVar() {
    return stateVar({handler: AsyncStateVarHandler});
}
