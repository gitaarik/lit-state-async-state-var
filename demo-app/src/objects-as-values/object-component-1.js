import { customElement, LitElement, html, css } from 'lit-element';
import { demoComponentStyle } from '@app/demo-component.js';
import { observeState } from 'lit-element-state';
import { demoState } from './state';
import 'lit-docs';


@customElement('object-component-1')
export class ObjectComponent1 extends observeState(demoComponentStyle(LitElement)) {

    render() {

        return html`

            <showcase-box>

                <h2>&lt;component-1&gt;</h2>

                <h3 class="status">Status: ${this.dataStatus}</h3>
                <h3 class="value">Value1: ${demoState.data.value1}</h3>
                <h3 class="value">Value2: ${demoState.data.value2}</h3>

                <div class="buttons">

                    <button
                        @click=${() => demoState.data.reload()}
                        ?disabled=${demoState.data.isPending()}
                    >
                        reload
                    </button>

                </div>

            </showcase-box>

        `;

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

}
