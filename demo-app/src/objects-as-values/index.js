import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import './object-component-1';
import './object-component-2';


@customElement('objects-as-values')
export class ObjectsAsValues extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>Objects as values</h1>

                <p>
                    When you access your stateVar with for example
                    <code>myState.myAsyncStateVar</code>, the value
                    that is returned is the value you have set on it. However,
                    on this variable you can also call methods like
                    <code>myState.myAsyncStateVar.isPending()</code>. So that
                    you can check the state of the promise and interact with
                    it.
                </p>

                <p>
                    When your value is a primitive value, like a string or
                    integer, asyncStateVar uses
                    <a
                        target="_blank"
                        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive"
                    ><code>[Symbol.toPrimitive]</code></a> to return your value.
                </p>

                <p>
                    When your value is not a primitive value but an object or
                    an array, then asyncStateVar creates and returns a
                    <code>stateObject</code>. This object is a clone of your
                    value, with the promise state methods added. Giving you
                    access to both the object and the state on the
                    <code>asyncStateVar</code>.
                </p>

                <p>
                    If you want to get your original object, you can recover it
                    through <code>myState.myAsyncStateVar.getValue()</code>.
                </p>

                <h2>Example</h2>

                <p>
                    So let's say we have a state where the value of our
                    <code>asyncStateVar</code> is an object:
                </p>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <p>
                    Then the properties of the object in the
                    <code>asyncStateVar</code> can be simply accessed with
                    <code>demoState.data.value1</code> and
                    <code>demoState.data.value2</code>. Also the status of the
                    promise can be checked with
                    <code>demoState.data.isPending()</code> and
                    <code>demoState.data.isFulfilled()</code>.
                </p>

                <p>
                    <code-block filename='component-1.js' .code=${this.componentCode}></code-block>
                </p>

                <h2>Output</h2>

                <div class="demoComponents">
                    <object-component-1></object-component-1>
                    <object-component-2></object-component-2>
                </div>

            </div>

        `;

    }

    get demoStateCode() {

        return `import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';
import { currentTime } from './current-time.js';


class DemoState extends LitState {

    @asyncStateVar()
    data() {
        return {
            initialValue: {
                value1: '[initial value1]',
                value2: '[initial value2]'
            },
            get: () => this._getData()
        };
    }

    _getData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    value1: 'Hello World 1 "' + currentTime() + '"',
                    value2: 'Hello World 2 "' + currentTime() + '"'
                });
            }, 3000);
        });
    }

}


export const demoState = new DemoState();`;

    }

    get componentCode() {

        return `import { customElement, LitElement, html } from 'lit-element';
import { observeState } from 'lit-element-state';
import { demoState } from './state.js';


@customElement('object-component-1')
export class ObjectComponent1 extends observeState(LitElement) {

    render() {

        return html\`

            <h2>&lt;component-1&gt;</h2>

            <h3 class="status">Status: \${this.dataStatus}</h3>
            <h3 class="value">Value1: \${demoState.data.value1}</h3>
            <h3 class="value">Value2: \${demoState.data.value2}</h3>

            <div class="buttons">

                <button
                    @click=\${() => demoState.data.reload()}
                    ?disabled=\${demoState.data.isPending()}
                >
                    reload
                </button>

            </div>

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPending()) {
            return 'loading values...';
        } else if (demoState.data.isFulfilled()) {
            return 'values loaded';
        } else {
            return 'unknown';
        }
    }

}`;

    }

}
