import { customElement, LitElement, html, css } from 'lit-element';
import { DemoComponent } from 'lit-element-demo-app-helpers';
import { observeState } from 'lit-element-state';
import { demoState } from './state';


@customElement('update-only-component-1')
export class UpdateOnlyComponent1 extends observeState(DemoComponent(LitElement)) {

    render() {

        return html`

            <h2>&lt;component-1&gt;</h2>
            <h3 class="status">Status: ${this.dataStatus}</h3>

            <h3 class="value">
                <span>Value:</span>
                <input
                    type="text"
                    .value=${demoState.data.getValue()}
                    @keyup=${this.handleInputKeyUp}
                    ?disabled=${demoState.data.isPending()}
                />
            </h3>

            <div class="buttons">

                <button
                    @click=${() => demoState.data.pushCache()}
                    ?disabled=${demoState.data.isPending() || !demoState.data.isPendingCache()}
                >
                    push cache
                </button>

            </div>

        `;

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
