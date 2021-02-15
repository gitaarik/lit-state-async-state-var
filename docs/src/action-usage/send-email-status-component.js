import { customElement, LitElement, html } from 'lit-element';
import { demoComponentStyle } from '@app/demo-component.js';
import { observeState } from 'lit-element-state';
import { demoState } from './state';
import 'lit-docs';


@customElement('send-email-status-component')
export class SendEmailStatusComponent extends observeState(demoComponentStyle(LitElement)) {

    render() {
        return html`
            <showcase-box>
                <h2>&lt;send-email-status-component&gt;</h2>
                <h3>Status: ${this.sendMailStatus}</h3>
            </showcase-box>
        `;
    }

    get sendMailStatus() {
        if (demoState.sendMail.isPending()) {
            return 'Sending mail...'
        } else if (demoState.sendMail.isRejected()) {
            return 'Sending mail failed with error: "' + demoState.sendMail.getError() + '".';
        } else if (demoState.sendMail.isFulfilled()) {
            return 'Mail sent!';
        } else {
            return 'No mail sent yet.';
        }
    }

}
