import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import 'lit-docs';
import './array-component';


@customElement('arrays-as-values')
export class ArraysAsValues extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>Arrays as values</h1>

                <p>
                    Just like when you have
                    <lit-docs-link href="basic-usage/objects-as-values/">objects as values</lit-docs-link>,
                    you can also have arrays as values. You can access items in
                    the array like <code>myState.myAsyncStateVar[0]</code>, and
                    also iterate over the array for <code>for</code>.
                </p>

                <h2>State</h2>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <h2>Component</h2>

                <p>
                    <code-block filename='component.js' .code=${this.componentCode}></code-block>
                </p>


                <div class="demoComponents">
                    <array-component></array-component>
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
            initialValue: ['[initial value1]', '[initial value2]'],
            get: () => this._getData()
        };
    }

    _getData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([
                    'Hello World 1 "' + currentTime() + '"',
                    'Hello World 2 "' + currentTime() + '"'
                ]);
            }, 3000);
        });
    }

}


export const demoState = new DemoState();`;

    }

    get componentCode() {

        return `
import { customElement, LitElement, html, css } from 'lit-element';
import { observeState } from 'lit-element-state';
import { demoState } from './demo-state.js';


@customElement('array-component')
export class ArrayComponent extends observeState(LitElement) {

    render() {

        return html\`

            <h2>&lt;array-component&gt;</h2>

            <h3 class="status">Status: \${this.dataStatus}</h3>
            <h3 class="value">Value1: \${demoState.data[0]}</h3>
            <h3 class="value">Value2: \${demoState.data[1]}</h3>
            <h3 class="value">Iterate values: <ul>\${this.iterateValues()}</ul></h3>

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

    *iterateValues() {
        for (let value of demoState.data) {
            yield html\`<li>\${value}</li>\`;
        }
    }

}`;

    }

}
