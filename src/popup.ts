import * as db from './common/local-store';
import { ifExists, isEmpty, toBoolean } from './common/utils.js';
// import { html, render } from 'lit';
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';


/* @customElement("app-link-adv-opts")
export class AdvancedOptionsComponent extends LitElement {
    params: LinkParameter[] = []

    render() {
        const addNewParameter = () => {
            // refresh model
            this.params.push({ key: '', value: '', desc: '' });
            refreshComponent("adv-parm-list", AdvancedParameterListComponent, this.params);
        }
        return html`
    <div id="toggle-adv-container" class="row container" data-toggle="${toBoolean(context.toggle)}">
        <div class="cell">
            <div class="row">
                <div class="cell"><button type="button" id="add-adv-param" onclick="${addNewParameter}">Add new parameter</button></div>
            </div>
            <div id="adv-parm-list">
                ${this.params.length > 0 && AdvancedParameterListComponent(this.params)}
            </div>
        </div>
    </div>
    `;
    }
} */


@customElement("app-root")
export class AppComponent extends LitElement {
    linkForm?: Link

    async render() {
        const links = await db.findAllLinks();
        const hasLinks = links && links.length > 0;
        return html`
        <div class="ez-container">
        <h4 id="greeting">${hasLinks ? "Your Links" : "Sorry, you don't seem to have any links. Try adding links by clicking the 'Add new link' button"}</h4>
        <button class="add-link" onclick="${this.linkForm = {}}">Add new link</button>
        <ul id="available-links">
            ${hasLinks && links.map(l => html`<app-link link=${l}></app-link>`)}
        </ul>
        ${this.linkForm && html`<app-link-form></app-link-form>`}
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


