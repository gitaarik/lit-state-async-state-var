import { customElement, LitElement, property, html, css } from 'lit-element';
import { DemoPage } from 'lit-element-demo-app-helpers';
import 'lit-element-demo-app-helpers';
import './send-email-component';
import './send-email-status-component';


@customElement('action-usage')
export class ActionUsage extends DemoPage(LitElement) {

    render() {

        return html`

            <div>

                <h1>Using <code-small>asyncStateVar</code-small> for actions</h1>

                <p>
                    You can also use <code-small>asyncStateVar</code-small> for
                    asynchronous actions. For example, say you have an API to
                    send emails. You can use
                    <code-small>asyncStateVar</code-small> to execute the API
                    call, track the status of the action with the status
                    checking methods, and automatically have your UI
                    synchronized with this status:
                </p>

                <div class="demoComponents">
                    <send-email-component></send-email-component>
                    <send-email-status-component></send-email-status-component>
                </div>

                <p>
                    As you can see in our <code-small>demoState</code-small>,
                    we use a normal <code-small>asyncStateVar</code-small>. The
                    notable thing is that it only has a <strong>set</strong>
                    promise, and doesn't contain any value:
                </p>

                <p>
                    <code-big filename='demo-state.js' .code=${this.demoStateCode}></code-big>
                </p>

                <p>
                    Our <code-small>&lt;send-email-component&gt;</code-small>
                    sends the email using the <code-small>push()</code-small>
                    method:
                </p>

                <p>
                    <code-big filename='send-email-component.js' .code=${this.sendEmailComponentCode}></code-big>
                </p>

                <p>
                    And our <code-small>&lt;send-email-status-component&gt;</code-small>
                    component tracks the status using
                    <code-small>isPending()</code-small>,
                    <code-small>isRejected()</code-small> and
                    <code-small>isFulfilled()</code-small>:
                </p>

                <p>
                    <code-big filename='send-email-status-component.js' .code=${this.sendEmailStatusComponentCode}></code-big>
                </p>

                <p>
                    This makes it quite easy to handle asynchronous actions and
                    have your UI updated according to the action's status.
                </p>

            </div>

        `;

    }

    get demoStateCode() {

        return `import { LitState } from 'lit-element-state';
import { asyncStateVar } from 'lit-state-async-state-var';


class DemoState extends LitState {

    sendMail = asyncStateVar({
        set: text => this._sendEmail(text)
    });

    _sendEmail(text) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (text) resolve();
                else reject("Can't send email without any text!");
            }, 3000);
        });
    }

}


export const demoState = new DemoState();`;

    }

    get sendEmailComponentCode() {

        return `import { customElement, LitElement, property, html, css } from 'lit-element';
import { demoState } from './demo-state.js';


@customElement('send-email-component')
export class SendEmailComponent extends LitElement {

    @property() emailText = '';

    render() {
        return html\`

            <h2>&lt;send-email-component&gt;</h2>

            <textarea
                .value=\${this.emailText}
                @keyup=\${this.handleEmailTextareaKeyup}
            ></textarea>

            <button @click=\${this.handleSendEmailButtonClick}>
                Send mail
            </button>

        \`;
    }

    handleEmailTextareaKeyup(event) {
        this.emailText = event.target.value;
    }

    handleSendEmailButtonClick() {
        demoState.sendMail.push(this.emailText);
    }

}`;

    }

    get sendEmailStatusComponentCode() {

        return `import { customElement, LitElement, html } from 'lit-element';
import { observeState } from 'lit-element-state';
import { demoState } from './demo-state.js';


@customElement('send-email-status-component')
export class SendEmailStatusComponent extends observeState(LitElement) {

    render() {
        return html\`
            <h2>&lt;send-email-status-component&gt;</h2>
            <h3>Status: \${this.sendMailStatus}</h3>
        \`;
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

}`;

    }

}
