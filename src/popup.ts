// import { html, render } from 'lit';
import { SignalWatcher } from '@lit-labs/preact-signals';
import '@material/web/fab/branded-fab.js';
import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import { LitElement, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { appState } from './common/app-state';
import { Link } from './common/models';
import './components/link-form.component';
import './components/links.component';
import { matFabStyle } from './styles/component';
import { mainStyles } from './styles/main.styles';
import { AddIcon, MdIcon } from './common/icons';

@customElement("app-root")
export class AppComponent extends SignalWatcher(LitElement) {
    static styles = [
        mainStyles,
        matFabStyle,
    ];
    @state()
    private linkForm?: Link

    private showForm(evt?: Event) {
        if(evt != null && evt instanceof CustomEvent) {
            this.linkForm = {...evt.detail}
        } else {
            this.linkForm = {}
        }
    }

    private hideForm() {
        this.linkForm = undefined
    }

    renderHeader() {
        return html`
        <!--<header class="mdc-top-app-bar">
            <div class="mdc-top-app-bar__row">
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button" aria-label="Open navigation menu">menu</button>
                <span class="mdc-top-app-bar__title">Page title</span>
            </section>
            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Favorite">favorite</button>
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Search">search</button>
                <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Options">more_vert</button>
            </section>
            </div>
        </header>-->        
        `
    }

    renderMain() {
        const hasLinks = appState.links.value.length > 0;
        return html`
            <main class="mdc-top-app-bar--fixed-adjust">
                <div class="ez-container" @showLinkForm=${this.showForm} @hideLinkForm=${this.hideForm}>
                    ${!hasLinks ? html`<h4>Sorry, you don't seem to have any links. Try adding one.</h4>` : nothing}
                    <div class="row">
                        <md-fab size="small" label="Add Link" variant="primary" @click="${this.showForm}">
                            ${MdIcon(AddIcon)}
                        </md-fab>
                    </div>
                    ${hasLinks ? html`
                        <md-divider style="margin:10px 0px 10px 0px;"></md-divider>
                        <app-links></app-links>` 
                        : nothing
                    } 
                    ${this.linkForm && html`<app-link-form .link=${this.linkForm}></app-link-form>`}
                </div>
            </main>        
        `
    }

    render() {
        return html`
        ${this.renderHeader()}
        ${this.renderMain()}
        `;
    }
}

