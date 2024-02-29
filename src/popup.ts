// import { html, render } from 'lit';
import { SignalWatcher } from '@lit-labs/preact-signals';
import '@material/web/fab/branded-fab.js';
import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { appState } from './common/app-state';
import { Link } from './common/models';
import './components/link-form.component';
import './components/links.component';
import { mainStyles } from './styles/main';

@customElement("app-root")
export class AppComponent extends SignalWatcher(LitElement) {
    static styles = [
        mainStyles,
    ];
    @state()
    linkForm?: Link

    @query(".mdc-top-app-bar")
    private _topAppBarElement!: HTMLDivElement

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

    connectedCallback(): void {
        super.connectedCallback();
        const pid = setInterval(() => {
            const el = this.renderRoot.querySelector('.mdc-top-app-bar')!
            console.log("checking ", el)
            if (el !== null && el !== undefined) {
                clearInterval(pid);
            }

        }, 100);
        //${new MDCTopAppBar(document.querySelector('.mdc-top-app-bar')!)}
    }

    renderMain() {
        const hasLinks = appState.links.value.length > 0;
        return html`
            <main class="mdc-top-app-bar--fixed-adjust">
                <div class="ez-container" @showLinkForm=${this.showForm} @hideLinkForm=${this.hideForm}>
                    <h4 id="greeting">${hasLinks ? "Your Links" : "Sorry, you don't seem to have any links. Try adding one."}</h4>
                    <div class="row">
                        <md-fab size="small" label="Add Link" variant="primary" @click="${this.showForm}">
                            <md-icon slot="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                            </md-icon>
                        </md-fab>
                    </div>
                    <md-divider style="margin:10px 0px 10px 0px;"></md-divider>            
                    ${hasLinks ? html`<app-links></app-links>` : ''} 
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

