import { customElement, LitElement, html, css } from 'lit-element';
import { demoComponentStyle } from '@app/demo-component.js';
import { observeState } from 'lit-element-state';
import { demoState } from './state';
import 'lit-docs';


@customElement('async-update-component-2')
export class AsyncUpdateComponent2 extends observeState(demoComponentStyle(LitElement)) {

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
                        reload data
                    </button>

                    <button
                        @click=${() => demoState.data.push('<component-2> updated the data!')}
                        ?disabled=${demoState.data.isPending()}
                    >
                        update data
                    </button>

                    <button
                        @click=${() => demoState.simulateErrorReload()}
                        ?disabled=${demoState.data.isPending()}
                    >
                        reload error
                    </button>

                    <button
                        @click=${() => demoState.simulateErrorUpdate()}
                        ?disabled=${demoState.data.isPending()}
                    >
                        update error
                    </button>

                </div>

            </showcase-box>

        `;

    }

    get dataStatus() {
        if (demoState.data.isPendingGet()) {
            return 'loading value...';
        } else if (demoState.data.isPendingSet()) {
            return 'updating value...'
        } else if (demoState.data.isRejectedGet()) {
            return 'loading failed with error: "' + demoState.data.getErrorGet() + '"';
        } else if (demoState.data.isRejectedSet()) {
            return 'updating failed with error: "' + demoState.data.getErrorSet() + '"';
        } else if (demoState.data.isFulfilledGet()) {
            return 'value loaded';
        } else if (demoState.data.isFulfilledSet()) {
            return 'value updated';
        } else {
            return 'unknown';
        }
    }

}
