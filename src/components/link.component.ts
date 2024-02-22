import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import * as db from '../common/local-store';

@customElement("app-link")
export class LinkComponent extends LitElement {
    // @property()
    link!: Link

    async _deleteLink() {
        console.log("delete data:", this.link);
        await db.deleteLink(this.link);
        // refreshAvailableLinks(null);
    }

    refreshLinkForm(link: any) {

    }

    async openLink(link: any) {

    }

    render() {
        return html`
            <li class="ez-container">
                <a href="#" class="link" title="${this.link.title}" onclick="${async () => await this.openLink(this.link)}">${this.link.title}</a>
                <span class="action-bar right">
                <button class="action edit" onclick="${() => this.refreshLinkForm(this.link)}">-</button>
                <button class="action delete" onclick="${this._deleteLink}">X</button>
                </span>
            </li>
            `;
    }
}