import { customElement, LitElement, property, html, css } from 'lit-element';
import { DemoComponent } from 'lit-element-demo-app-helpers';
import { demoState } from './state';


@customElement('send-email-component')
export class SendEmailComponent extends DemoComponent(LitElement) {

    @property() emailText = '';

    render() {
        return html`
            <h2>&lt;send-email-component&gt;</h2>
            <div><textarea .value=${this.emailText} @keyup=${this.handleEmailTextareaKeyup}></textarea></div>
            <div><button @click=${this.handleSendEmailButtonClick}>Send mail</button></div>
        `;
    }

    handleEmailTextareaKeyup(event) {
        this.emailText = event.target.value;
    }

    handleSendEmailButtonClick() {
        demoState.sendMail.push(this.emailText);
    }

    static get styles() {
        return css`
            textarea {
                margin-bottom: 10px;
                padding: 10px;
                width: 200px;
                height: 50px;
            }
        `;
    }

}
