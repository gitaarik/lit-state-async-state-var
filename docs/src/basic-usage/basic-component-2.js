import { customElement, LitElement, html, css } from 'lit-element';
import { demoComponentStyle } from '@app/demo-component.js';
import { observeState } from 'lit-element-state';
import { demoState } from './state';
import 'lit-docs';


@customElement('basic-component-2')
export class BasicComponent2 extends observeState(demoComponentStyle(LitElement)) {

    render() {

        return html`

            <showcase-box>

                <h2>&lt;component-2&gt;</h2>

                <h3 class="status">Status: ${this.dataStatus}</h3>
                <h3 class="value">Value: ${demoState.data}</h3>

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
            return 'loading value...';
        } else if (demoState.data.isFulfilled()) {
            return 'value loaded';
        } else {
            return 'unknown';
        }
    }

}
