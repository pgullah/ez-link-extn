import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators';

@customElement("hx-select")
export class SelectComponent extends LitElement {
    options!: Option[]
    default!: string

    protected render() {
        return html`
        <select name="method" required >
        ${this.options.map(o => html`
            <option value="${o.key}" ${o.key == this.default && 'selected'}>${o.value}</option>`)
            }
        </select>
        `;
    }

}