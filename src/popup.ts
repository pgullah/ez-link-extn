import * as db from './common/local-store';
import { ifExists, isEmpty, toBoolean } from './common/utils.js';
// import { html, render } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './components/link-form.component';
import './components/links.component'
import { Link } from './common/models';
import { SignalWatcher } from '@lit-labs/preact-signals';


@customElement("app-root")
export class AppComponent extends SignalWatcher(LitElement) {
    @state()
    linkForm?: Link
    links?: Link[]

    private showForm() {
        this.linkForm = {}
    }

    render() {
        db.findAllLinks().then(r => this.links = r);
        const hasLinks = this.links && this.links.length > 0;
        return html`
        <div class="ez-container">
        <h4 id="greeting">${hasLinks ? "Your Links" : "Sorry, you don't seem to have any links. Try adding links by clicking the 'Add new link' button"}</h4>
        <button class="add-link" @click="${this.showForm}">Add new link</button>
        <ul id="available-links">
            ${this.links?.map(l => html`<app-link link=${l}></app-link>`)}
        </ul>
        ${this.linkForm && html`<app-link-form link=${this.linkForm}></app-link-form>`}
        `;
    }
}


/* const init = async () => {
    const $root = document.getElementById('root');
    if ($root) {
        $root.innerHTML = '';
        render($root, AppComponent());
    }
};

init(); */


