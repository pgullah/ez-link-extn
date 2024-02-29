import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as db from '../common/local-store';
import { Link } from '../common/models';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { appState } from '../common/app-state';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import { MdDialog } from '@material/web/dialog/dialog.js';
const linkStyles = css`
  md-list {
    border-radius: 8px;
    outline: 1px solid var(--md-sys-color-outline);
    max-width: 360px;
    overflow: hidden;
    width: 100%;
  }
`;

@customElement("app-links")
export class LinksComponent extends SignalWatcher(LitElement) {
    static styles = [
        linkStyles,
    ]

    private async deleteLink(link: Link) {
        console.log("delete data:", link);
        await db.deleteLink(link.id!!);
        appState.links.value = await db.findAllLinks();
    }

    private async openLink(link: any) {


    }

    private editLink(link: any) {
        this.dispatchEvent(new CustomEvent('showLinkForm', {
            detail: link,
            bubbles: true,
            composed: true
        }))
    }

    render() {
        return html
            `
        <md-list style="max-width: 300px;">
            ${appState.links.value.map(l => this.renderLink(l))}
        </md-list>`
    }

    private showDialog(event: Event) {
        ((event.target as Element).nextElementSibling as MdDialog)?.show();
    }

    private renderEditButton(link: Link) {
        return html`
            <md-icon-button slot="end" @click="${() => this.editLink(link)}">
                <md-icon aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </md-icon>
            </md-icon-button>
        `
    }

    private renderDeleteButton(link: Link) {
        return html`
            <md-icon-button slot="end" @click="${async () => await this.deleteLink(link)}">
                <md-icon aria-hidden="true">                    
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </md-icon>
            </md-icon-button>
        `
    }

    private renderLink(link: Link) {
        if (true) {
            return html`
            <md-list-item type="button">
                ${link.title}
                ${this.renderEditButton(link)}
                ${this.renderDeleteButton(link)}
            </md-list-item>
                
            `
        }
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