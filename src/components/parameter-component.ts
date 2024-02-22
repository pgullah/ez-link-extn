// import { html, render } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators';

@customElement("app-link-param")
export class ParameterComponent extends LitElement {
    param!: LinkParameter
    render() {
        const deleteParam = (evt: any) => {
            const $row = evt.target.parentNode.parentNode;
            $row.parentNode.removeChild($row);
        };

        return html`
        <tr class="adv-params-row">
            <td><input type="text" class="param-key" value="${this.param.key}"></td>
            <td><input type="text" class="param-value" value="${this.param.value}"></td>
            <td><input type="text" class="param-desc" value="${this.param.desc}"></td>
            <td><button type="button" class="param-delete" onclick="${deleteParam}">X</td>
        </tr>
        `;
    }
}