import { customElement, LitElement, html, css } from 'lit-element';
import { DemoComponent } from 'lit-element-demo-app-helpers';
import { observeState } from 'lit-element-state';
import { demoState } from './state';


@customElement('async-update-component-1')
export class AsyncUpdateComponent1 extends observeState(DemoComponent(LitElement)) {

    render() {

        return html`

            <h2>&lt;component-1&gt;</h2>

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
                    @click=${() => demoState.data.push('<component-1> updated the data!')}
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
