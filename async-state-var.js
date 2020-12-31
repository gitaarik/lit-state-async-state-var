import { BaseStateVar } from 'lit-element-state';


class AsyncStateVar extends BaseStateVar {

    constructor(options) {
        super();
        this._options = options;
        this._init();
    }

    _init() {
        this._initiatedGet = false;
        this._pendingGet = false;
        this._pendingSet = false;
        this._pendingCache = false;
        this._fulfilledGet = false;
        this._fulfilledSet = false;
        this._rejectedGet = false;
        this._rejectedSet = false;
        this._errorGet = null;
        this._errorSet = null;
        this._value = this._hasOption('initialValue') ? this._getOption('initialValue') : null;
    }

    _getOption(key) {
        if (this._hasOption(key)) {
            return this._options[key];
        }
    }

    _hasOption(key) {
        return (key in this._options);
    }

    _handleGet() {

        if (this._hasOption('get')) {
            this.initGet();
        }

        return this;

    }

    _handleSet(value) {
        throw (
            "Can't assign to an asyncStateVar. If you want to set a new " +
            "value, use setValue(value), or setCache(value) and pushCache()."
        );
    }

    initGet() {
        if (this._initiatedGet) return;
        this._initiatedGet = true;
        this._loadValue();
    }

    _loadValue() {

        this._pendingGet = true;
        this._rejectedGet = false;
        this._fulfilledGet = false;
        this._fulfilledGet = false;
        this._notifyChange();

        this._getPromise().then(value => {
            this._fulfilledGet = true;
            this._value = value;
            this._errorGet = null;
            this._pendingCache = false;
        }).catch(error => {
            this._rejectedGet = true;
            this._errorGet = error;
        }).finally(() => {
            this._pendingGet = false;
            this._rejectedSet = false;
            this._notifyChange();
        });

    }

    isPending() {
        return this.isPendingGet() || this.isPendingSet();
    }

    isPendingGet() {
        this._recordRead();
        return this._pendingGet;
    }

    isPendingSet() {
        this._recordRead();
        return this._pendingSet;
    }

    isPendingCache() {
        this._recordRead();
        return this._pendingCache;
    }

    isRejected() {
        return this.isRejectedGet() || this.isRejectedSet();
    }

    isRejectedGet() {
        this._recordRead();
        return this._rejectedGet;
    }

    isRejectedSet() {
        this._recordRead();
        return this._rejectedSet;
    }

    getError() {
        return this.getErrorGet() || this.getErrorSet();
    }

    getErrorGet() {
        this._recordRead();
        return this._errorGet;
    }

    getErrorSet() {
        this._recordRead();
        return this._errorSet;
    }

    isFulfilled() {
        return this.isFulfilledGet() || this.isFulfilledSet();
    }

    isFulfilledGet() {
        this._recordRead();
        return this._fulfilledGet;
    }

    isFulfilledSet() {
        this._recordRead();
        return this._fulfilledSet;
    }

    getValue() {
        this._recordRead();
        return this._value;
    }

    setValue(value) {

        this._pendingSet = true;
        this._fulfilledSet = false;
        this._fulfilledGet = false;
        this._rejectedSet = false;

        this._notifyChange();

        this._setPromise(value).then(value => {
            this._fulfilledSet = true;
            this._value = value;
            this._pendingCache = false;
        }).catch(error => {
            this._rejectedSet = true;
            this._errorSet = error;
        }).finally(() => {
            this._pendingSet = false;
            this._rejectedGet = false;
            this._notifyChange();
        });

    }

    setCache(value) {
        if (value === this._value) return;
        this._value = value;
        this._pendingCache = true;
        this._notifyChange();
    }

    pushCache() {
        this.setValue(this._value);
    }

    reload() {
        this._loadValue();
    }

    get _getPromise() {
        if (this._hasOption('get')) {
            return this._getOption('get');
        } else {
            throw "asyncStateVar missing `get` option.";
        }
    }

    get _setPromise() {
        if (this._hasOption('set')) {
            return this._getOption('set');
        } else {
            throw "asyncStateVar missing `set` option.";
        }
    }

}


export function asyncStateVar(options) {
    return new AsyncStateVar(options);
}
