import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import './async-update-component-1';
import './async-update-component-2';


@customElement('update-usage')
export class UpdateUsage extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>Update promise</h1>

                <p>
                    The <a href="#async-state-var"><code>asyncStateVar</code></a>
                    can also be used to asynchronously <strong>update</strong>
                    data. This is done by defining 2 promises on the
                    <code>asyncStateVar</code>: one to
                    <strong>get</strong> the data, and one to
                    <strong>set</strong> the data. When the status of any of
                    the promises changes, it automatically re-renders the
                    components that use the
                    <code>asyncStateVar</code>:
                </p>

                <div class="demoComponents">
                    <async-update-component-1></async-update-component-1>
                    <async-update-component-2></async-update-component-2>
                </div>

                <p>
                    Like in the previous example, we have a fake API for
                    demonstation purposes. This fake API also simulates
                    updating the value:
                </p>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <p>
                    The components use
                    <code>demoState.data.push(value);</code> to
                    initiate the <strong>set</strong> promise. When it
                    resolves, the value returned by the
                    <code>resolve()</code> callback of the promise
                    will be set as the new value for the
                    <code>asyncStateVar</code>, and your components
                    will be re-renderd. When the promise fails, no new value
                    will be set.
                <p>

                <p>
                    The components use <code>isPendingSet()</code>,
                    <code>isRejectedSet()</code> and
                    <code>isFulfilledSet()</code> to check the
                    status of the <strong>set</strong> promise. For the
                    <strong>get</strong> promise we use
                    <code>isPendingGet()</code>,
                    <code>isRejectedGet()</code> and
                    <code>isFulfilledGet()</code>. When any of the
                    promises fails, the error value passed to the
                    <code>reject()</code> callback can be accessed
                    through <code>getErrorSet()</code> for the
                    <strong>set</strong> promise and
                    <code>getErrorGet()</code> for the
                    <strong>get</strong> promise.
                </p>

                <p>
                    <code-block filename='component-1.js' .code=${this.componentCode}></code-block>
                </p>

                <p>
                    This makes it easy to deal with asynchronous
                    <strong>gets</strong> and <strong>sets</strong>.
                </p>

                <p>
                    You can also set the value first and call
                    <code>push()</code> later, if you want to
                    update your UI before you execute the <strong>set</strong>
                    promise, check out <a href="#update-delayed-push">update
                    with delayed push</a>.
                </p>

            </div>

        `;

    }

    get demoStateCode() {

        return `import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';
import { currentTime } from './utils.js';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            get: () => this._getData(),
            set: value => this._setData(value),
            initialValue: "[initial value]" // optional
        };
    }

    _simulateError = false;

    _getData() {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                if (this._simulateError) {
                    reject("fake load data error");
                    this._simulateError = false;
                } else {
                    resolve(this._fakeApiResponse());
                }

            }, 3000);

        });

    }

    _setData(value) {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                if (this._simulateError) {
                    reject("fake update data error");
                    this._simulateError = false;
                } else {
                    this._fakeApiResponseText = value;
                    resolve(this._fakeApiResponse());
                }

            }, 3000);

        });

    }

    _fakeApiResponseText = "Hello world";

    _fakeApiResponse() {
        return this._fakeApiResponseText + " (" + currentTime() + ")";
    }

    simulateErrorReload() {
        this._simulateError = true;
        this.data.reload();
    }

    simulateErrorUpdate() {
        this._simulateError = true;
        this.data.push("This value won't be set, because our fake API will fail.");
    }

}


export const demoState = new DemoState();`;

    }

    get componentCode() {

        return `import { customElement, LitElement, html, css } from 'lit-element';
import { observeState } from 'lit-element-state';
import { demoState } from './demo-state.js';


@customElement('async-component-1')
export class AsyncComponent1 extends observeState(LitElement) {

    render() {

        return html\`

            <h2>&lt;component-1&gt;</h2>

            <h3>Status: \${this.dataStatus}</h3>
            <h3>Value: \${demoState.data}</h3>

            <button
                @click=\${() => demoState.data.reload()}
                ?disabled=\${demoState.data.isPending()}
            >
                reload data
            </button>

            <button
                @click=\${() => demoState.data.push('<component-1> updated the data!')}
                ?disabled=\${demoState.data.isPending()}
            >
                update data
            </button>

            <button
                @click=\${() => demoState.simulateErrorReload()}
                ?disabled=\${demoState.data.isPending()}
            >
                reload error
            </button>

            <button
                @click=\${() => demoState.simulateErrorUpdate()}
                ?disabled=\${demoState.data.isPending()}
            >
                update error
            </button>

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPendingGet()) {
            return 'loading value...';
        } else if (demoState.data.isPendingSet()) {
            return 'updating value...'
        } else if (demoState.data.isRejectedGet()) {
            return (
                'loading failed with error: ' +
                '"' + demoState.data.getErrorGet() + '"'
            );
        } else if (demoState.data.isRejectedSet()) {
            return (
                'updating failed with error: ' +
                '"' + demoState.data.getErrorSet() + '"'
            );
        } else if (demoState.data.isFulfilledGet()) {
            return 'value loaded';
        } else if (demoState.data.isFulfilledSet()) {
            return 'value updated';
        } else {
            return 'unknown';
        }
    }

}`;

    }

}
