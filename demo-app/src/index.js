import { customElement, LitElement, property, html, css } from 'lit-element';
import 'lit-docs';
import './basic-usage/index';
import './update-usage/index';
import './update-delayed-push/index';
import './update-only/index';
import './action-usage/index';


@customElement('lit-state-async-state-var-demo')
export class LitStateAsyncStateVarDemo extends LitElement {

    render() {
        return html`<lit-docs-ui docsTitle="LitState asyncStateVar" .pages=${this.pages}></lit-docs-ui>`;
    }

    get pages() {
        return [
            {
                title: 'Basic usage',
                path: 'basic-usage',
                template: html`<basic-usage></basic-usage>`
            },
            {
                title: 'Update',
                path: 'update',
                template: html`<update-usage></update-usage>`
            },
            {
                title: 'Update with delayed push',
                path: 'update-delayed-push',
                template: html`<update-delayed-push></update-delayed-push>`
            },
            {
                title: 'Update only',
                path: 'update-only',
                template: html`<update-only></update-only>`
            },
            {
                title: 'Actions',
                path: 'actions',
                template: html`<action-usage></action-usage>`
            }
        ];
    }

}
