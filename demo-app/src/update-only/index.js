import { customElement, LitElement, property, html, css } from 'lit-element';
import { DemoPage } from 'lit-element-demo-app-helpers';
import 'lit-element-demo-app-helpers';
import './update-only-component-1';
import './update-only-component-2';


@customElement('update-only')
export class UpdateOnly extends DemoPage(LitElement) {

    render() {

        return html`

            <div>

                <h1>LitState <code-small>asyncStateVar</code-small> update only demo</h1>

                <p>
                    You might have any data that doesn't need to be
                    asynchronously loaded, but should be asynchronously
                    updated. You can make an
                    <a href="#async-state-var"><code-small>asyncStateVar</code-small></a>
                    that only has a <code-small>set</code-small> promise, and
                    no <code-small>get</code-small>. You can use the
                    <code-small>initialValue</code-small> key to set an initial
                    value, and <code-small>setCache()</code-small> to set a the
                    value locally before pushing it to the asynchronous medium.
                </p>

                <div class="demoComponents">
                    <update-only-component-1></update-only-component-1>
                    <update-only-component-2></update-only-component-2>
                </div>

                <p>
                    The <code-small>asyncStateVar</code-small> we use in our
                    <code-small>demoState</code-small> contains an object that
                    only has the <code-small>set</code-small> and
                    <code-small>initialValue</code-small> keys:
                </p>

                <p>
                    <code-big filename='demo-state.js' .code=${this.demoStateCode}></code-big>
                </p>

                <p>
                    The component shows the initial value by default, and when
                    the cache is updated or pushed, it shows the new value. The
                    component doesn't contain a load button because we don't
                    load any data asynchronously.
                </p>

                <p>
                    <code-big filename='component-1.js' .code=${this.componentCode}></code-big>
                </p>

                <p>
                    So whether you need to load or update a value
                    asynchronously, or both, it is easily done with
                    <code-small>asyncStateVar</code-small>.
                </p>

            </div>

        `;

    }

    get demoStateCode() {

        return `import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';


class DemoState extends LitState {

    data = asyncStateVar({
        set: value => this._setData(value),
        initialValue: "[initial value]"
    });

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


@customElement('async-update-cache-component-1')
export class AsyncUpdateCacheComponent1 extends observeState(LitElement) {

    render() {

        return html\`

            <h2>&lt;component-1&gt;</h2>
            <h3 class="status">Status: \${this.dataStatus}</h3>

            <h3 class="value">
                <span>Value:</span>
                <input
                    type="text"
                    .value=\${demoState.data.getValue()}
                    @keyup=\${this.handleInputKeyUp}
                    ?disabled=\${demoState.data.isPending()}
                />
            </h3>

            <div class="buttons">

                <button
                    @click=\${() => demoState.data.pushCache()}
                    ?disabled=\${demoState.data.isPending() || !demoState.data.isPendingCache()}
                >
                    push cache
                </button>

            </div>

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPendingSet()) {
            return 'updating value...'
        } else if (demoState.data.isPendingCache()) {
            return 'cache pending';
        } else if (demoState.data.isFulfilledSet()) {
            return 'value updated';
        } else {
            return 'initial value';
        }
    }

    handleInputKeyUp(event) {
        demoState.data.setCache(event.target.value);
    }

}`;

    }

}
