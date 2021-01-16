import { StateVar, stateVar } from 'lit-element-state';


class AsyncStateVarHandler extends StateVar {

    constructor(args) {
        super(args);
        this.options = args.options.element.descriptor.value();
        this._init();
    }

    [Symbol.toPrimitive](hint) {
        return this.getValue();
    }

    valueOf() {
        return this.getValue();
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
        return this.value;
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
        this.notifyChange();
    }

    restore() {
        if (!this._hasChange) return;
        this._pendingChange = true;
        this.notifyChange();
    }

    push(value = undefined) {
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
        this._loadValue();
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
        this.value = this._hasOption('initialValue') ? this._getOption('initialValue') : null;
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

        if (this._hasOption('get')) {
            this._initGet();
        }

        return this;

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

        this.notifyChange();

    }

    _initGet() {
        if (this._initiatedGet) return;
        this._initiatedGet = true;
        this._loadValue();
    }

    _loadValue() {

        this._pendingGet = true;
        this._rejectedGet = false;
        this._fulfilledGet = false;
        this._fulfilledGet = false;
        this.notifyChange();

        this._getOption('get')().then(value => {
            this._fulfilledGet = true;
            this.value = value;
            this._errorGet = null;
            this._pendingChange = false;
            this._hasChange = false;
        }).catch(error => {
            this._rejectedGet = true;
            this._errorGet = error;
        }).finally(() => {
            this._pendingGet = false;
            this._rejectedSet = false;
            this.notifyChange();
        });

    }

    _pushValue(value) {

        this._pendingSet = true;
        this._fulfilledSet = false;
        this._fulfilledGet = false;
        this._rejectedSet = false;

        this.notifyChange();

        this._getOption('set')(value).then(value => {
            this._fulfilledSet = true;
            this.value = value;
            this._pendingChange = false;
            this._hasChange = false;
        }).catch(error => {
            this._rejectedSet = true;
            this._errorSet = error;
        }).finally(() => {
            this._pendingSet = false;
            this._rejectedGet = false;
            this.notifyChange();
        });

    }

}


export function asyncStateVar() {
    return stateVar({handler: AsyncStateVarHandler});
}
