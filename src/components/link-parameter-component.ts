// import { html, render } from 'lit';
import { LinkParameter } from '../common/models';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement("app-link-param")
export class LinkParameterComponent extends LitElement {
    param!: LinkParameter
    render() {
        const deleteParam = (evt: any) => {
            const $row = evt.target.parentNode.parentNode;
            $row.parentNode.removeChild($row);
        };

        return html`
        <div class="link-row">
            <md-filled-text-field autofocus="" label="Name" role="presentation" inputmode="" type="text" autocomplete="" value="${this.param.key}"></md-filled-text-field>
            <md-filled-text-field autofocus="" label="Value" role="presentation" inputmode="" type="text" autocomplete="" value="${this.param.value}"></md-filled-text-field>
            <md-filled-text-field autofocus="" label="Description" role="presentation" inputmode="" type="text" autocomplete="" value="${this.param.desc}"></md-filled-text-field>
        </div>
        <tr class="adv-params-row">
            <td><input type="text" class="param-key" value="${this.param.key}"></td>
            <td><input type="text" class="param-value" value="${this.param.value}"></td>
            <td><input type="text" class="param-desc" value="${this.param.desc}"></td>
            <td><button type="button" class="param-delete" @click="${deleteParam}">X</td>
        </tr>
        `;
    }
}