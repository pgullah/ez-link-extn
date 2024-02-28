import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as db from '../common/local-store';
import { Link } from '../common/models';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { appState } from '../common/app-state';

@customElement("app-links")
export class LinksComponent extends SignalWatcher(LitElement) {

    private async deleteLink(link: Link) {
        console.log("delete data:", link);
        await db.deleteLink(link);
        appState.links.value = await db.findAllLinks();
    }

    private async openLink(link: any) {
        

    }

    private editLink(link: any) {
        this.dispatchEvent(new CustomEvent('showLinkForm',{
            detail: link,
            bubbles: true,
            composed: true
        }))
    }

    render() {
        return html
        `<ul id="available-links">
            ${appState.links.value.map(l => this.renderLink(l))}
        </ul>`
    }

    private renderLink(link: Link) {
        return html`
            <li class="ez-container">
                <a href="#" class="link" title="${link.title}" @click="${async () => await this.openLink(link)}">${link.title}</a>
                <span class="action-bar right">
                <button class="action edit" @click="${() => this.editLink(link)}">-</button>
                <button class="action delete" @click="${async () => await this.deleteLink(link)}">X</button>
                </span>
            </li>
            `;
    }
}