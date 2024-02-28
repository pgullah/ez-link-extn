import * as db from './common/local-store';
import { ifExists, isEmpty, toBoolean } from './common/utils.js';
// import { html, render } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './components/link-form.component';
import './components/links.component'
import { Link } from './common/models';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { appState } from './common/app-state';


@customElement("app-root")
export class AppComponent extends SignalWatcher(LitElement) {
    @state()
    linkForm?: Link

    private showForm(evt?: Event) {
        if(evt != null && evt instanceof CustomEvent) {
            this.linkForm = evt.detail
        } else {
            this.linkForm = {}
        }
    }

    private hideForm() {
        this.linkForm = undefined
    }

    render() {
        const hasLinks = appState.links.value.length > 0;
        // db.resetLinks().then(() => console.log("cleared links"));
        return html`
        <div class="ez-container" @showLinkForm=${this.showForm} @hideLinkForm=${this.hideForm}>
            <h4 id="greeting">${hasLinks ? "Your Links" : "Sorry, you don't seem to have any links. Try adding links by clicking the 'Add new link' button"}</h4>
            <button class="add-link" @click="${this.showForm}">Add new link</button>
            <app-links></app-links>
            ${this.linkForm && html`<app-link-form .link=${this.linkForm}></app-link-form>`}
        </div>
        `;
    }
}

