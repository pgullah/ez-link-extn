import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import * as db from '../common/local-store';
import { toBoolean } from '../common/utils';

@customElement("app-link-form")
export class FormComponent extends LitElement {
    link!: Link
    toggle = false

    private addNewParameter() {
        this.link.params = this.link.params || [];
        this.link.params.push({})
    }

    private advancedOptions() {
        return html`
        <div id="toggle-adv-container" class="row container" data-toggle="${toBoolean(this.toggle)}">
            <div class="cell">
                <div class="row">
                    <div class="cell"><button type="button" id="add-adv-param" onclick="${this.addNewParameter}">Add new parameter</button></div>
                </div>
                <div id="adv-parm-list">
                    ${this.link.params && this.paramTable()}
                </div>
            </div>
        </div>
        `;
    }

    private paramTable() {
        return html`
        <table>
            <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
                ${this.link.params?.map(param => html`<app-link-param param="${param}"></app-link-param>`)}
            </tbody>
    </table>
        `;
    }

    render() {
        // const advancedOptionsToggle = () => {
        //     context.toggle = !context.toggle;
        //     refreshLinkForm(null);
        // };

        return html`
        <form class="ez-container" action="#" onsubmit="${async () => await db.saveLink(this.link)}">
            <input type="hidden" name="id" value="${this.link.id} />
                <div class=" row">
            <div class="cell"> <label>Title: </label></div>
            <div class="cell"> <input type="text" name="title" required value="${this.link.title}" /> </div>
            </div>
            <div class="row">
            <div class="cell"> <label>URL: </label></div>
            <div class="cell"> <input type="url" name="url" required minlength="6" value="${this.link.url}" /> </div>
            </div>
            <div class="row">
            <div class="cell"> <label>Method: </label></div>
            <div class="cell">
                <hx-select options="${this.buildHttpMethodOptions()} default="${this.link.method}"></hx-select>
            </div>
            </div>
            <div class="row">
            <div class="cell"> <a href="#" id="toggle-adv" data - toggle="false" onclick="${this.toggle = !this.toggle}">
                Advanced </a></div>
            </div>
            ${this.toggle && this.advancedOptions()}
            <div class="row">
            <div class="cell">
                <button type="submit" class="save-link"> Save </button> &nbsp;
                <button type="reset"> Clear </button>
            </div>
            </div>
        </form>
        `;
    }

    private buildHttpMethodOptions() {
        return KeyOption.from_array(" GET", "POST" , "PUT" , "PATCH" , "DELETE" )
    }
}
