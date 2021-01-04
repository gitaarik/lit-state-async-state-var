import { customElement, LitElement, html } from 'lit-element';
import { DemoComponent } from 'lit-element-demo-app-helpers';
import { observeState } from 'lit-element-state';
import { demoState } from './state';


@customElement('send-email-status-component')
export class SendEmailStatusComponent extends observeState(DemoComponent(LitElement)) {

    render() {
        return html`
            <h2>&lt;send-email-status-component&gt;</h2>
            <h3>Status: ${this.sendMailStatus}</h3>
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
