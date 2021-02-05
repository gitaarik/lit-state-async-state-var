import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import './reject-component-1';
import './reject-component-2';


@customElement('promises-that-reject')
export class PromisesThatReject extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>Promises that reject</h1>

                <p>
                    A promise might become rejected. You can check if the
                    promise was rejected with <code>isRejected()</code>. And
                    you can render your template according to this state.
                </p>

                <h2>Demo</h2>

                <div class="demoComponents">
                    <reject-component-1></reject-component-1>
                    <reject-component-2></reject-component-2>
                </div>

                <h2>Explanation</h2>

                <p>
                    This is an extension on the example in
                    <a href="basic-usage/" @click=${event => litDocsUiState.handlePageLinkClick(event)}>Basic Usage</a>.
                </p>

                <p>
                    In our <code>DemoState</code> code, we extended the promise
                    that <code>_getData()</code> returns to call the
                    <code>reject()</code> callback when
                    <code>this._simulateError</code> is <code>true</code>. You
                    can induce the reject with the "reject" button in the
                    components.
                </p>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <p>
                    The components can check if the promise rejected using the
                    <code>isRejected()</code> method. If the promise has been
                    rejected, the error value passed to the
                    <code>reject()</code> callback can be accessed with
                    <code>getError()</code>.
                </p>

                <p>
                    <code-block filename='component-1.js' .code=${this.componentCode}></code-block>
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
            initialValue: '[initial value]',
            get: () => this._getData()
        };
    }

    _induceReject = false;

    _getData() {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                if (this._induceReject) {
                    reject("simulated reject");
                    this._induceReject = false;
                } else {
                    resolve("Hello world (" + currentTime() + ")");
                }

            }, 3000);

        });

    }

    induceReject() {
        this._induceReject = true;
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

            <h3 class="status">Status: \${this.dataStatus}</h3>
            <h3 class="value">Value: \${demoState.data}</h3>

            <div class="buttons">

                <button
                    @click=\${() => demoState.data.reload()}
                    ?disabled=\${demoState.data.isPending()}
                >
                    reload
                </button>

                <button
                    @click=\${() => demoState.induceReject()}
                    ?disabled=\${demoState.data.isPending()}
                >
                    reject
                </button>

            </div>

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPending()) {
            return 'loading value...';
        } else if (demoState.data.isRejected()) {
            return 'loading failed with error: "' + demoState.data.getError() + '"';
        } else if (demoState.data.isFulfilled()) {
            return 'value loaded';
        } else {
            return 'unknown';
        }
    }

}`;

    }

}
