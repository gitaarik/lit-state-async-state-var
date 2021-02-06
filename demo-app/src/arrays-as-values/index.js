import { customElement, LitElement, property, html, css } from 'lit-element';
import { LitDocsContent } from 'lit-docs';
import './array-component';


@customElement('arrays-as-values')
export class ArraysAsValues extends LitDocsContent(LitElement) {

    render() {

        return html`

            <div>

                <h1>Arrays as values</h1>

                <p>
                    Just like when you have objects as values, you can also
                    have arrays as values. You can access items in the array
                    like <code>myState.myAsyncStateVar[0]</code>, and also
                    iterate over the array like
                    <code>for (let item of myState.myAsyncStateVar) { /* ... */ }</code>.
                </p>

                <p>
                    <code-block filename='demo-state.js' .code=${this.demoStateCode}></code-block>
                </p>

                <p>
                    <code-block filename='component-1.js' .code=${this.componentCode}></code-block>
                </p>


                <div class="demoComponents">
                    <array-component></array-component>
                </div>

            </div>

        `;

    }

    get demoStateCode() {

        return ``;

    }

    get componentCode() {

        return ``;

    }

}
