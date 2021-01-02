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
        this._hasCache = false;
        this._cacheValue = null;
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
            this._hasCache = false;
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
        if (this._pendingCache) return this._cacheValue;
        return this._value;
    }

    hasCache() {
        this._recordRead();
        return this._hasCache;
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
            this._hasCache = false;
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

        this._cacheValue = value;

        if (this._cacheValue === this._value) {
            this._hasCache = false;
            this._pendingCache = false;
        } else {
            this._hasCache = true;
            this._pendingCache = true;
        }

        this._notifyChange();

    }

    dropCache() {
        if (!this._hasCache) return;
        this._pendingCache = false;
        this._notifyChange();
    }

    restoreCache() {
        if (!this._hasCache) return;
        this._pendingCache = true;
        this._notifyChange();
    }

    pushCache() {
        if (this._pendingCache) {
            this.setValue(this._cacheValue);
        } else {
            this.setValue(this._value);
        }
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
