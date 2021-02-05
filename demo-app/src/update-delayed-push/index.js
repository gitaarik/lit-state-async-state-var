import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import './delayed-push-component-1';
import './delayed-push-component-2';


@customElement('update-delayed-push')
export class UpdateDelayedPush extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>Delayed update</h1>

                <p>
                    Sometimes you want to update your UI first before you send
                    the update to your API. When you set a new value to your
                    <code>asyncStateVar</code>, the UI
                    automatically reflects this new value. Then you can call
                    the <code>push()</code> method at a later time,
                    when you're done with the edits, and you want the
                    <code>set</code> promise to be called.
                </p>

                <p>
                    If you don't want to push the new value, but go back to the
                    original value before you changed it, use
                    <code>reset()</code>. If you didn't mean to
                    reset the change, you can restore it with
                    <code>restore()</code>:
                </p>

                <div class="demoComponents">
                    <delayed-push-component-1></delayed-push-component-1>
                    <delayed-push-component-2></delayed-push-component-2>
                </div>

                <p>
                    Our <code>demoState</code> doesn't need extra
                    functionality. We just have our fake API for demonstation
                    purposes:
                </p>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <p>
                    In our components, we set the new value on a
                    <code>keyup</code> event of the
                    <code>&lt;input&gt;</code> element. Also, we
                    keep the <code>&lt;input&gt;</code>
                    synchronized by setting the <code>.value</code>
                    property. It is important that you use the dot, to make it
                    a <a href="https://lit-html.polymer-project.org/guide/writing-templates#bind-to-properties" target="_blank">property</a>
                    instead of an attribute, otherwise lit-html won't be able
                    to compare the input's current value with the value we're
                    giving it, causing it to not re-render in certain
                    situations.
                </p>

                <p>
                    We additionally use the
                    <code>isPendingChange()</code> method to check
                    whether there is a change pending to be pushed:
                </p>

                <p>
                    <code-block filename='component-1.js' .code=${this.componentCode}></code-block>
                </p>

                <p>
                    Like this, it's easy to keep your UI synchronized with the
                    asynchronous data in your app.
                </p>

            </div>

        `;

    }

    get demoStateCode() {

        return `import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            get: () => this._getData(),
            set: value => this._setData(value),
            initialValue: "[initial value]"
        };
    }

    _getData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this._fakeApiResponse);
            }, 3000);
        });
    }

    _setData(value) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this._fakeApiResponse = value;
                resolve(this._fakeApiResponse);
            }, 3000);
        });
    }

    _fakeApiResponse = "Hello world";

}


export const demoState = new DemoState();
`;

    }

    get componentCode() {

        return `import { customElement, LitElement, html, css } from 'lit-element';
import { observeState } from 'lit-element-state';
import { demoState } from './demo-state.js';


@customElement('async-delayed-push-component-1')
export class AsyncDelayedPushComponent1 extends observeState(LitElement) {

    render() {

        return html\`

            <h2>&lt;component-1&gt;</h2>
            <h3>Status: \${this.dataStatus}</h3>

            <h3>
                Value:
                <input
                    type="text"
                    .value=\${demoState.data}
                    @keyup=\${demoState.data = event.target.value}
                    ?disabled=\${demoState.data.isPending()}
                />
            </h3>

            <button
                @click=\${() => demoState.data.reset()}
                ?disabled=\${demoState.data.isPending()}
            >
                reset
            </button>

            <button
                @click=\${() => demoState.data.push()}
                ?disabled=\${demoState.data.isPending()}
            >
                push
            </button>

            <button
                @click=\${() => demoState.data.restore()}
                ?disabled=\${demoState.data.isPending()}
            >
                restore
            </button>

            <button
                @click=\${() => demoState.data.reload()}
                ?disabled=\${demoState.data.isPending()}
            >
                reload
            </button>

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPendingGet()) {
            return 'loading value...';
        } else if (demoState.data.isPendingSet()) {
            return 'updating value...'
        } else if (demoState.data.isPendingChange()) {
            return 'change pending';
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
