import { SignalWatcher } from '@lit-labs/preact-signals';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/dialog/dialog.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/list/list-item.js';
import '@material/web/list/list.js';
import { LitElement, css, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { appState } from '../common/app-state';
import * as db from '../common/local-store';
import { EventActionType, Link } from '../common/models';

import { CloseIcon, DeleteIcon, EditIcon } from '../common/icons';
import { MdDialog } from '@material/web/dialog/dialog.js';
import { signal, } from "@lit-labs/preact-signals";
import { createRef } from 'lit/directives/ref.js';


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

    private canShowDialog = signal(false)

    confirmDialog?: MdDialog

    confirmDialogRef = createRef();

    showDialog() {
        this.canShowDialog.value = true;
    }
    
    hideDialog() {
        this.canShowDialog.value = false;
    }


    private async deleteLink(link: Link) {
        console.log("delete data:", link);
        await db.deleteLink(link.id!!);
        appState.links.value = await db.findAllLinks();
    }

    private async dispatchLinkOpen(evt: Event, link: Link) {
        evt.preventDefault();
        // send message to service worker
        chrome.runtime.sendMessage({ actionType: EventActionType.LINK_ACTION_INIT, data: link });
    }

    private editLink(link: any) {
        this.dispatchEvent(new CustomEvent('showLinkForm', {
            detail: link,
            bubbles: true,
            composed: true
        }))
    }

    render() {
        return html`
            <md-list >
                ${appState.links.value.map(l => this.renderLink(l))}
            </md-list>
        `
    }

    private renderLink(link: Link) {
        return html`            
            <md-list-item type="link">
                <a href="#" class="link" title="${link.title}" @click="${async (evt: Event) => await this.dispatchLinkOpen(evt, link)}">${link.title}</a>
                <md-icon-button slot="end" @click="${() => this.editLink(link)}">
                    <md-icon>${EditIcon}</md-icon>
                </md-icon-button>
                <md-icon-button slot="end" @click="${this.showDialog}">
                    <md-icon>${DeleteIcon}</md-icon>
                </md-icon-button>
                ${this.canShowDialog.value ? this.renderConfirmDialog(link) : nothing}
            </md-list-item>
        `;
    }


    private renderConfirmDialog(link: Link) {
        return html`
        <md-dialog id="confirmDialog" style="max-width: 320px;" open @close=${this.hideDialog}>
            <div slot="headline">Permanently delete?</div>
            <md-icon>${CloseIcon}</md-icon>
            <form id="form" slot="content" method="dialog">
                Are you sure you want to delete <b>${link.title}</b> ?
            </form>
            <div slot="actions">
                <md-text-button form="form" value="delete" @click=${async () => this.deleteLink(link)}>Delete</md-text-button>
                <md-filled-tonal-button form="form" value="cancel" autofocus @click=${this.hideDialog}>Cancel</md-filled-tonal-button>
            </div>
        </md-dialog>
        `
    }

}