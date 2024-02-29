import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as db from '../common/local-store';
import { toBoolean } from '../common/utils';
import './link-parameter-component'
import './select.component'
import { KeyOption, Link, LinkParameter } from '../common/models';
import { appState } from '../common/app-state';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/radio/radio.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/switch/switch.js';

const formStyles = css`

.contacts {
    min-width: calc(100vw - 212px);
  }

  .link [slot='header'] {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }

  .link .headline {
    flex: 1;
  }

  .link-content,
  .link-row {
    display: flex;
    gap: 8px;
  }

  .link-content {
    flex-direction: column;
  }

  .link-row > * {
    flex: 1;
  }
`
type Supplier<V> = () => V;
type Consumer<T> = (obj: T) => {}


@customElement("app-link-form")
export class FormComponent extends LitElement {
    static styles = [
        formStyles,
    ]
    @property({ type: Object, reflect: true })
    link!: Link
    @state()
    private toggle = false
    

    private addNewParameter() {
        this.link = this.link || [];
        this.link.params = this.link.params || [];
        this.link.params = this.link.params.concat({})
        // this.link.params = [...this.link.params, {}]
        this.requestUpdate()
    }

    private hideForm() {
        this.dispatchEvent(new CustomEvent('hideLinkForm', {
            bubbles: true,
            composed: true
        }))
    }

    private async saveForm(link: Link) {
        await db.saveLink(this.link)
        appState.links.value = await db.findAllLinks()
        this.hideForm()
    }

    private advancedOptions() {
        return html`
        <div id="toggle-adv-container" class="row container">
            <div class="cell">
                <div class="row">
                    <md-text-button type="button" role="presentation" @click=${this.addNewParameter}>Add new parameter</md-text-button>
                </div>
                <div id="adv-parm-list">
                    ${this.link.params?.map(param => this.renderAdvOptParams(param))}
                </div>
            </div>
        </div>
        `;
    }

    private deleteParam(param: LinkParameter) {
        const newParms = this.link.params?.filter(p => p !== param);
        this.link = {...this.link, params: newParms}
    }

    private renderAdvOptParams(param: LinkParameter) {
        return html`
        <div class="link-row">
            <md-icon-button form="form" slot="start" @click="${() => this.deleteParam(param)}">
                <md-icon aria-hidden="true">                    
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </md-icon>
            </md-icon-button>
            ${this.renderReactiveInput('Name', () => param.key, v => param.key = v)}
            ${this.renderReactiveInput('Value', () => param.value, v => param.value = v)}
            ${this.renderReactiveInput('Description', () => param.desc, v => param.desc = v)}
        </div>
        `;
    }

    private renderReactiveInput(label: string, getter: Supplier<string | undefined>, setter: Consumer<string>, required: boolean = false) {
        return html`
            <md-filled-text-field autofocus="" label="${label}" role="presentation" inputmode="" type="text" autocomplete="" 
                ?required=${required}
                value="${getter()}" 
                @change=${this.setInputValue(setter)}>
            </md-filled-text-field>
        `
    }

    private renderReactiveSelect(label: string, options: KeyOption[], getter: Supplier<string | undefined>, setter: Consumer<string>, required: boolean = false) {
        return html`
            <md-outlined-select @change=${this.setInputValue(setter)}>
                ${options.map(o => html`<md-select-option value=${o.key} ?selected=${o.key == getter()}><div slot="headline">${o.value}</div></option>`)}
            </md-outlined-select>
        `
    }

    private toggleAdvOpts() {
        this.toggle = !this.toggle
    }

    private hasLinkParams() {
        return this.link !== undefined && this.link.params !== undefined && this.link.params.length > 0
    }


    private setInputValue(setter: Consumer<string>) {
        return (evt: Event) => setter((evt.target as HTMLInputElement).value)
    }

    connectedCallback(): void {
        super.connectedCallback()
        this.toggle = this.hasLinkParams();
    }

    render() {
        // this.toggle = this.hasLinkParams();
        return html`            
            <md-dialog class="link" role="presentation" open="" @close=${this.hideForm} @cancel=${this.hideForm}>
                <span slot="headline">
                    <md-icon-button form="form"  @click=${this.hideForm} aria-label="Close dialog" role="presentation">
                        <md-icon aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></md-icon>
                    </md-icon-button>
                    <span class="headline">${!this.link.id ? 'Create new' : 'Update'} link</span>
                </span>
                <form id="form" slot="content" class="link-content" action="#">
                    <input type="hidden" name="id" value="${this.link.id ?? ''} />
                    <div class="link-row">
                        ${this.renderReactiveInput('Title', () => this.link.title, v => this.link.title = v, true)}
                    </div>
                    <div class="link-row">
                        ${this.renderReactiveInput('URL', () => this.link.url, v => this.link.url = v, true)}
                    </div>
                    <div class="link-row">
                        ${this.renderReactiveSelect('Method', this.buildHttpMethodOptions(), () => (this.link.method ?? 'GET'), v => this.link.method = v as any)}
                    </div>
                    <div class="link-row">
                        <label>
                            Advanced Options [${this.toggle}]<md-switch icons ?selected=${this.toggle}  @change="${this.toggleAdvOpts}"></md-switch>
                        </label>
                    </div>
                    ${this.toggle ? this.advancedOptions() : nothing}
                </form>
                <div slot="actions">
                    <md-text-button form="form" value="reset" type="reset" role="presentation">Reset</md-text-button>
                    <div style="flex: 1"></div>
                    <md-text-button form="form" value="close" role="presentation">Cancel</md-text-button>
                    <md-text-button form="form" value="save" @click=${async () => await this.saveForm(this.link)} role="presentation">Save</md-text-button>
                </div>
            </md-dialog>
        `
    }

    private buildHttpMethodOptions() {
        return KeyOption.from_array("GET", "POST", "PUT", "PATCH", "DELETE")
    }
}
