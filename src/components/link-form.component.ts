import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as db from '../common/local-store';
import './link-parameter-component'
import './select.component'
import { Consumer, KeyOption, Link, LinkParameter, Option, Supplier } from '../common/models';
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
import { renderReactiveInput, renderReactiveSelect, setInputValue } from '../common/render-utils';
import { CloseIcon, DeleteIcon } from '../common/icons';

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
        const newParms = (this.link.params || []).concat({});
        this.link = { ...this.link, params: newParms }
    }

    private hideForm() {
        this.dispatchEvent(new CustomEvent('hideLinkForm', {
            bubbles: true,
            composed: true
        }))
    }

    private async saveForm(linkToSave: Link) {
        await db.saveLink(linkToSave)
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
        this.link = { ...this.link, params: newParms }
    }

    private renderAdvOptParams(param: LinkParameter) {
        return html`
        <div class="link-row">
            <md-icon-button form="link-entry-form" slot="start" @click="${() => this.deleteParam(param)}">
                <md-icon>${DeleteIcon}</md-icon>
            </md-icon-button>
            ${renderReactiveInput('Name', () => param.key, v => param.key = v)}
            ${renderReactiveInput('Value', () => param.value, v => param.value = v)}
            ${renderReactiveInput('Description', () => param.desc, v => param.desc = v)}
        </div>
        `;
    }

    private toggleAdvOpts() {
        this.toggle = !this.toggle
    }

    private hasLinkParams() {
        return this.link !== undefined && this.link.params !== undefined && this.link.params.length > 0
    }


    connectedCallback(): void {
        super.connectedCallback()
        this.toggle = this.hasLinkParams();
    }

    render() {
        return html`            
            <md-dialog class="link" role="presentation" open="" @close=${this.hideForm} @cancel=${this.hideForm}>
                <span slot="headline">
                    <md-icon-button form="link-entry-form"  @click=${this.hideForm} aria-label="Close dialog" role="presentation">
                        <md-icon>${CloseIcon}</md-icon>
                    </md-icon-button>
                    <span class="headline">${!this.link.id ? 'Create new' : 'Update'} link</span>
                </span>
                <form id="link-entry-form" slot="content" class="link-content" action="#">
                    <input type="hidden" name="id" value="${this.link.id ?? ''} />
                    <div class="link-row">
                        ${renderReactiveInput('Title', () => this.link.title, v => this.link.title = v, {required: true})}
                    </div>
                    <div class="link-row">
                        ${renderReactiveInput('URL', () => this.link.url, v => this.link.url = v, {required: true, type: 'url'})}
                    </div>
                    <div class="link-row">
                        ${renderReactiveSelect('Method', this.buildHttpMethodOptions(), 
                            () => (this.link.method ?? 'GET'), 
                            v => this.link.method = v as any, {required: true})
                        }
                    </div>
                    <div class="link-row">
                        <label>
                            Advanced Options <md-switch icons ?selected=${this.toggle} @change="${this.toggleAdvOpts}"></md-switch>
                        </label>
                    </div>
                    ${this.toggle ? this.advancedOptions() : nothing}
                </form>
                <div slot="actions">
                    <!--<md-text-button form="link-entry-form" value="reset" type="reset" role="presentation">Reset</md-text-button>-->
                    <div style="flex: 1"></div>
                    <md-text-button form="link-entry-form" value="close" role="presentation">Cancel</md-text-button>
                    <md-text-button form="link-entry-form" value="save" autofocus @click=${async () => await this.saveForm(this.link)} role="presentation">Save</md-text-button>
                </div>
            </md-dialog>
        `
    }

    private buildHttpMethodOptions() {
        return KeyOption.from_array("GET", "POST", "PUT", "PATCH", "DELETE")
    }
}
