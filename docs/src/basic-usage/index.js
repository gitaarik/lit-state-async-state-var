import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import './basic-component-1';
import './basic-component-2';


@customElement('basic-usage')
export class BasicUsage extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>LitState asyncStateVar</h1>

                <p>
                    To make it easy to work with asynchronous data in LitState,
                    you can use the <code>asyncStateVar</code>. It's a special kind
                    of <code>stateVar</code> on which you can define a
                    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank">promise</a>.
                    This promise will do some asynchronous task. When the
                    status of the promise changes (it becomes resolved or
                    rejected), your component will be re-rendered. And in your
                    component you can access the status and the resolved value
                    of the promise.
                </p>

                <p>
                    Like this, you don't have to keep track of the status of
                    your promises yourself. You don't need extra
                    <code>stateVar</code> variables that you manually update
                    when your promises get resolved or rejected. It saves a lot
                    of manual work and potential bugs
                </p>

                <h2>Demo</h2>

                <p>
                    The demo components underneath automatically start to load
                    it's data using the promise specified on the state
                    (explained later in the code below). Try to refresh the
                    page and check the status and value. You can also reload
                    the value with the "reload" button. The value that the
                    promise returns includes the current time. Every time the
                    promise resolves, you'll see the time is updated.
                </p>

                <div class="demoComponents">
                    <basic-component-1></basic-component-1>
                    <basic-component-2></basic-component-2>
                </div>

                <h2>Explanation</h2>

                <p>
                    To define the <code>asyncStateVar</code>, we decorate a
                    method which returns an object that controls the behavior.
                    We decorate a method, and not a instance variable, because
                    in a method we have access to the instance's
                    <code>this</code> object. We use this to access the
                    <code>_getData()</code> method, which returns the promise.
                </p>

                <p>
                    The promise in this example automatically resolves after 3
                    seconds, using a simple <code>setTimeout()</code>.
                </p>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <p>
                    The components use <code>demoState.data</code> to get the
                    value. This initially returns the (optional)
                    <code>initialValue</code> if it's set, or otherwise
                    <code>undefined</code>. When the promise resolves, it calls
                    the <code>resolve(value)</code> callback with the new
                    value. Then <code>demoState.data</code> will contain this
                    new value and the components will be re-rendered.
                </p>

                <p>
                    The components use <code>isPending()</code> and
                    <code>isFulfilled()</code> to check the status of the
                    promise.
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
            initialValue: '[initial value]', // optional
            get: () => this._getData()
        };
    }

    _getData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Hello world (" + currentTime() + ")");
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


@customElement('component-1')
export class Component1 extends observeState(LitElement) {

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

        \`;

    }

    get dataStatus() {
        if (demoState.data.isPending()) {
            return 'loading value...';
        } else if (demoState.data.isFulfilled()) {
            return 'value loaded';
        } else {
            return 'unknown';
        }
    }

}`;

    }

}
