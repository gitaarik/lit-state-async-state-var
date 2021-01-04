import { LitState } from 'lit-element-state';
import { asyncStateVar } from '@app/async-state-var.js';


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


export const demoState = new DemoState();
