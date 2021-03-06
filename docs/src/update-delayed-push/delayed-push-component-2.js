import { customElement, LitElement, html, css } from 'lit-element';
import { demoComponentStyle } from '@app/demo-component.js';
import { observeState } from 'lit-element-state';
import { demoState } from './state';
import 'lit-docs';


@customElement('delayed-push-component-2')
export class DelayedPushComponent2 extends observeState(demoComponentStyle(LitElement)) {

    render() {

        return html`

            <showcase-box>

                <h2>&lt;component-2&gt;</h2>
                <h3 class="status">Status: ${this.dataStatus}</h3>

                <h3 class="value">
                    <span>Value:</span>
                    <input
                        type="text"
                        .value=${demoState.data}
                        @keyup=${event => demoState.data = event.target.value}
                        ?disabled=${demoState.data.isPending()}
                    />
                </h3>

                <div class="buttons">

                    <button
                        @click=${() => demoState.data.push()}
                        ?disabled=${demoState.data.isPending()}
                    >
                        push
                    </button>

                    <button
                        @click=${() => demoState.data.reset()}
                        ?disabled=${demoState.data.isPending()}
                    >
                        reset
                    </button>

                    <button
                        @click=${() => demoState.data.restore()}
                        ?disabled=${demoState.data.isPending()}
                    >
                        restore
                    </button>

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

    static get styles() {

        return css`

            .value {
                display: flex;
            }

            .value input {
                margin-left: 5px;
                min-width: 0;
            }

        `;

    }

}
