import { customElement, LitElement, property, html, css } from 'lit-element';
import { DemoPage } from 'lit-element-demo-app-helpers';
import 'lit-element-demo-app-helpers';
import './async-component-1';
import './async-component-2';


@customElement('basic-usage')
export class BasicUsage extends DemoPage(LitElement) {

    render() {

        return html`

            <div>

                <h1>LitState <code-small>asyncStateVar</code-small> demo</h1>

                <p>
                    To make working with asynchronous data easy, LitState has
                    the <code>asyncStateVar</code>. It's a special kind of
                    <code>stateVar</code> which holds a
                    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">promise</a>.
                    The promise is automatically executed when the
                    <code>asyncStateVar</code> is being used in a component.
                    When the promise settles, it will re-render the component.
                    The component can check the status of the
                    <code>asyncStateVar</code>, so it can display the status
                    and it's value:
                </p>

                <div class="demoComponents">
                    <async-component-1></async-component-1>
                    <async-component-2></async-component-2>
                </div>

                <p>
                    Our <code-small>demoState</code-small> has a simple fake
                    API for demonstation purposes. The fake API simulates a
                    succesful response (which includes the current time), or an
                    unsuccesful response (with an error message) in case
                    <code-small>_simulateError</code-small> is
                    <code-small>true</code-small>.
                </p>
                    
                <p>
                    On the <code-small>asyncStateVar</code-small> we define the
                    function that returns the promise for <strong>retrieving
                    the data</strong>. In this case <code-small>_getData()</code-small>:
                </p>

                <p>
                    <code-big filename='demo-state.js' .code=${this.demoStateCode}></code-big>
                </p>

                <p>
                    When the fake API simulates a succesful response, it calls
                    the promise's <code>resolve()</code> callback, with the
                    value that needs to be set. When the fake API gets an
                    error, it calls the promise's <code>reject()</code>
                    callback, with the error message.
                </p>

                <p>
                    The components use
                    <code-small>demoState.data.getValue()</code-small> to get
                    the current value. This initially returns the (optional)
                    default value, or <code-small>undefined</code-small> if
                    there's no default set. When the promise resolves or fails,
                    the components will be re-rendered, and
                    <code-small>getValue()</code-small> will return the new
                    value.
                </p>
                
                <p>
                    The components use
                    <code-small>isPending()</code-small>,
                    <code-small>isRejected()</code-small> and
                    <code-small>isFulfilled()</code-small> to check the status
                    of the promise:
                </p>

                <p>
                    <code-big filename='component-1.js' .code=${this.componentCode}></code-big>
                </p>

                <p>
                    Like this, you can easily synchronize your UI with the
                    state of your asynchronous data on your page. You don't
                    have to create additional state variables to do this.
                </p>

                <p>
                    <code-small>asyncStateVar</code-small> can also handle updates. See
                    <a href="#update">asyncStateVar update</a>.
                </p>

            </div>

        `;

    }

    get demoStateCode() {

        return `import { LitState, asyncStateVar } from 'lit-element-state';
import { currentTime } from './utils.js';


class DemoState extends LitState {

    data = asyncStateVar(
        () => this._getData(),
        '[default value]' // optional
    );

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

    _fakeApiResponseText = "Hello world";

    _fakeApiResponse() {
        return this._fakeApiResponseText + " (" + currentTime() + ")";
    }

    simulateError() {
        this._simulateError = true;
        this.data.reload();
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
            <h3>Value: \${demoState.data.getValue()}</h3>

            <button
                @click=\${() => demoState.data.reload()}
                ?disabled=\${demoState.data.isPending()}
            >
                reload data
            </button>

            <button
                @click=\${() => demoState.simulateError()}
                ?disabled=\${demoState.data.isPending()}
            >
                simulate error
            </button>

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPending()) {
            return 'loading value...';
        } else if (demoState.data.isRejected()) {
            return (
                'loading failed with error: ' +
                '"' + demoState.data.getError() + '"'
            );
        } else if (demoState.data.isFulfilled()) {
            return 'value loaded';
        } else {
            return 'unknown';
        }
    }

}`;

    }

}
