import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import './update-only-component-1';
import './update-only-component-2';


@customElement('update-only')
export class UpdateOnly extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>Update only</h1>

                <p>
                    You might have any data that doesn't need to be
                    asynchronously loaded, but should be asynchronously
                    updated. You can make an
                    <a href="#async-state-var"><code>asyncStateVar</code></a>
                    that only has a <code>set</code> promise, and
                    no <code>get</code>. You can use the
                    <code>initialValue</code> key to set an initial
                    value, and <code>push()</code> to initiate the
                    <code>set</code> promise.
                </p>

                <div class="demoComponents">
                    <update-only-component-1></update-only-component-1>
                    <update-only-component-2></update-only-component-2>
                </div>

                <p>
                    The <code>asyncStateVar</code> we use in our
                    <code>demoState</code> contains an object that
                    only has the <code>set</code> and
                    <code>initialValue</code> keys:
                </p>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <p>
                    The component shows the initial value by default, and when
                    the value is updated and/or pushed, it shows the new value.
                    The component doesn't contain a load button because we
                    don't load any data asynchronously.
                </p>

                <p>
                    <code-block filename='component-1.js' .code=${this.componentCode}></code-block>
                </p>

                <p>
                    So whether you need to load or update a value
                    asynchronously, or both, it is easily done with
                    <code>asyncStateVar</code>.
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
            set: value => this._setData(value),
            initialValue: "[initial value]"
        };
    }

    _setData(value) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(value);
            }, 3000);
        });
    }

}


export const demoState = new DemoState();`;

    }

    get componentCode() {

        return `import { customElement, LitElement, html, css } from 'lit-element';
import { observeState } from 'lit-element-state';
import { demoState } from './demo-state.js';


@customElement('update-only-component-1')
export class UpdateOnlyComponent1 extends observeState(LitElement) {

    render() {

        return html\`

            <h2>&lt;component-1&gt;</h2>
            <h3 class="status">Status: \${this.dataStatus}</h3>

            <h3 class="value">
                <span>Value:</span>
                <input
                    type="text"
                    .value=\${demoState.data}
                    @keyup=\${event => demoState.data = event.target.value}
                    ?disabled=\${demoState.data.isPending()}
                />
            </h3>

            <div class="buttons">

                <button
                    @click=\${() => demoState.data.push()}
                    ?disabled=\${demoState.data.isPending() || !demoState.data.isPendingChange()}
                >
                    push
                </button>

            </div>

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPendingSet()) {
            return 'updating value...'
        } else if (demoState.data.isPendingChange()) {
            return 'change pending';
        } else if (demoState.data.isFulfilledSet()) {
            return 'value updated';
        } else {
            return 'initial value';
        }
    }

}`;

    }

}
