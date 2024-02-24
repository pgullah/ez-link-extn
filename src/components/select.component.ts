import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Option } from '../common/models';

@customElement("hx-select")
export class SelectComponent extends LitElement {
    options!: Option[]
    defaultValue!: string
    required: boolean = false

    protected render() {
        console.log(">>> defaultL", this.defaultValue)
        return html`
        <select name="method" ?required=${this.required}>
        ${this.options?.map(o => html`
            <option value="${o.key}" ?selected=${o.key == this.defaultValue}>${o.value}</option>`)
            }
        </select>
        `;
    }

}