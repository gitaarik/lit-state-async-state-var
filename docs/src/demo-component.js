import { css } from 'lit-element';
import { litStyle } from 'lit-element-style';
import 'lit-docs';


export const demoComponentStyle = litStyle(css`

    h2 {
        margin-top: 0;
        font-size: 20px;
        color: green;
    }

    h3 {
        margin: 20px 0;
        font-weight: 600;
        font-size: 16px;
    }

    .status {
        color: blue;
    }

    .value {
        color: #cb2828;
    }

    .buttons {
        display: flex;
        flex-wrap: wrap;
        margin: -5px 0 0 -5px;
    }

    .buttons > * {
        margin: 5px 0 0 5px;
    }

`);
