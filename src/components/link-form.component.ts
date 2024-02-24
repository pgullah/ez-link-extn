import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as db from '../common/local-store';
import { toBoolean } from '../common/utils';
import './link-parameter-component'
import './select.component'
import { KeyOption, Link } from '../common/models';

@customElement("app-link-form")
export class FormComponent extends LitElement {
    // @property({ type: Object, reflect: true })
    link: Link
    @state()
    private toggle = false

    constructor(link: Link) {
        super();
        this.link = link;
    }

    private addNewParameter() {
        this.link = this.link || [];
        this.link.params = this.link.params || [];
        this.link.params = [...this.link.params, {}]
    }

    private advancedOptions() {
        return html`
        <div id="toggle-adv-container" class="row container">
            <div class="cell">
                <div class="row">
                    <div class="cell"><button type="button" id="add-adv-param" @click=${this.addNewParameter}>Add new parameter</button></div>
                </div>
                <div id="adv-parm-list">
                    ${this.link.params && this.link.params.length > 0 && this.paramTable()}
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
                ${this.link.params?.map(param => html`<app-link-param .param=${param}"></app-link-param>`)}
            </tbody>
    </table>
        `;
    }

    private toggleAdvOpts() {
        this.toggle = !this.toggle
    }

    render() {
        // const advancedOptionsToggle = () => {
        //     context.toggle = !context.toggle;
        //     refreshLinkForm(null);
        // };
        return html`
        <form class="ez-container" action="#" @submit="${async () => await db.saveLink(this.link)}">
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
                    <hx-select .options=${this.buildHttpMethodOptions()} .defaultValue=${this.link.method} .required=${true}></hx-select>
                </div>
            </div>
            <div class="row">
                <div class="cell"> 
                    <a href="#" id="toggle-adv" data-toggle="false" @click=${this.toggleAdvOpts}>
                        Advanced 
                    </a>
                </div>
            </div>
            ${this.toggle ? this.advancedOptions() : ''}
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
