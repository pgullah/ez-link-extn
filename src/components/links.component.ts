import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as db from '../common/local-store';
import { Link } from '../common/models';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { appState } from 'common/app-state';

@customElement("app-link")
export class LinksComponent extends SignalWatcher(LitElement) {

    private async deleteLink(link: Link) {
        console.log("delete data:", link);
        await db.deleteLink(link);
        appState.links.value = await db.findAllLinks();
    }

    refreshLinkForm(link: any) {

    }

    async openLink(link: any) {

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
                <a href="#" class="link" title="${link.title}" onclick="${async () => await this.openLink(link)}">${this.link.title}</a>
                <span class="action-bar right">
                <button class="action edit" onclick="${() => this.refreshLinkForm(link)}">-</button>
                <button class="action delete" onclick="${async () => await this.deleteLink(link)}">X</button>
                </span>
            </li>
            `;
    }
}