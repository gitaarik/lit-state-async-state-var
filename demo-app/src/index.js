import { customElement, property, html, css } from 'lit-element';
import { LitStateElement } from 'lit-element-state';
import 'lit-element-demo-app-helpers';
import './basic-usage/index';
import './update-usage/index';
import './update-with-cache/index';


@customElement('lit-state-async-state-var-demo')
export class LitStateAsyncStateVarDemo extends LitStateElement {

    render() {
        return html`<demo-shell .pages=${this.pages}></demo-shell>`;
    }

    get pages() {
        return [
            {
                hash: 'basic-usage',
                title: 'Basic usage',
                template: html`<basic-usage></basic-usage>`
            },
            {
                hash: 'update',
                title: 'Update',
                template: html`<update-usage></update-usage>`
            },
            {
                hash: 'update-with-cache',
                title: 'Update with cache',
                template: html`<update-with-cache></update-with-cache>`
            }
        ];
    }

}