import * as db from './local-store.js';
import { LitElement, html } from 'lit';

export class AvilableLinks extends LitElement {
    static get properties() {
        return {
            myProp: { type: String }
        };
    }
    render() {
        return html`
        
        `;
    }
}

export class LinkForm extends LitElement {
    render() {
        return html`
        <form class="ez-container" action="#" >
            <input type="hidden" name="id" />
            <div class="row">
            <div class="cell"><label>Title:</label></div>
            <div class="cell"><input type="text" name="title" required /></div>
            </div>
            <div class="row">
            <div class="cell"><label>URL:</label></div>
            <div class="cell"><input type="url" name="url" required minlength="6" /></div>
            </div>
            <div class="row">
            <div class="cell"><label>Method:</label></div>
            <div class="cell">
                <select name="method" required>
                <option value="GET" selected>GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                </select>
            </div>
            </div>
            <div class="row">
            <div class="cell">
                <div class="container">
                <div class="row">
                    <div class="cell"><a href="#" id="show-advanced">Advanced</label></div>
                </div>
                <div class="row parameters">
                    <div class="cell">
                    <table>
                        <thead>
                        <tr>
                            <th>Key</th><th>Value</th><th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><input type="text"></td><td><input type="text"></td>
                        </tr>
                        </tbody>
                        <tr>
                        
                        </tr>
                    </table>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="row" class="advanced params">
            <div class="cell">
                <div class="row">
                <div class="cell"><input type="text" /></div>
                <div class="cell"><input type="text" /></div>
                </div>
            </div>
            </div>
            </div>
            <div class="row">
            <div class="cell"><button type="submit" class="save-link">Save</button></div>
            </div>
        </form>
        `;
    }

}

export class Application extends LitElement {
    static properties = {
        greeting: {},
        canShowForm: {},
        links: {},
    };

    constructor() {
        super();
        this.greeting = 'Loading...';
        this.canShowForm = false;
        this.links = [];
    }

    connectedCallback() {
        super.connectedCallback();
        db.findAllLinks().then(result => this.links = result);
    }

    render() {
        const linkForm = html`
            <form class="ez-container" action="#" >
                <input type="hidden" name="id" />
                <div class="row">
                <div class="cell"><label>Title:</label></div>
                <div class="cell"><input type="text" name="title" required /></div>
                </div>
                <div class="row">
                <div class="cell"><label>URL:</label></div>
                <div class="cell"><input type="url" name="url" required minlength="6" /></div>
                </div>
                <div class="row">
                <div class="cell"><label>Method:</label></div>
                <div class="cell">
                    <select name="method" required>
                    <option value="GET" selected>GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                    </select>
                </div>
                </div>
                <div class="row">
                <div class="cell">
                    <div class="container">
                    <div class="row">
                        <div class="cell"><a href="#" id="show-advanced">Advanced</label></div>
                    </div>
                    <div class="row parameters">
                        <div class="cell">
                        <table>
                            <thead>
                            <tr>
                                <th>Key</th><th>Value</th><th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><input type="text"></td><td><input type="text"></td>
                            </tr>
                            </tbody>
                            <tr>
                            
                            </tr>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div class="row" class="advanced params">
                <div class="cell">
                    <div class="row">
                    <div class="cell"><input type="text" /></div>
                    <div class="cell"><input type="text" /></div>
                    </div>
                </div>
                </div>
                </div>
                <div class="row">
                <div class="cell"><button type="submit" class="save-link">Save</button></div>
                </div>
            </form>
        `;

        const availableLink = (item) => html`
            <li class="ez-container">
                <a href="#" class="link">${item}</a>
                <span class="action-bar right">
                <button class="action edit" @click=${this.editLink}>-</button>
                <button class="action delete" @click=${this.deleteLink}>X</button>
                </span>
            </li>
        `;
        return html`
        <div class="ez-container">
            <h4 id="greeting">${this.greet()}</h4>
            <button class="add-link" @click=${this.addNewLink()}>Add new link</button>
            <ul id="available-links">
                ${this.links.map(availableLink)}
            </ul>
            <div id="link-form">
                ${this.canShowForm ? linkForm : ''}
            </div>
        </div>
        `;
    }

    greet() {
        return this.links.length > 0 ? 'Your Links' : "Sorry, you don't seem to have any links. Try adding links by clicking the 'Add new link' button"
    }

    async addNewLink() {

    }

    async deleteLink() {

    }

    async editLink() {

    }
}
customElements.define('ez-app', Application);


// @customElement('ez-available-links')
/* // If there is CSS specified, inject it into the page.
if (items.css) {
chrome.tabs.insertCSS({ code: items.css }, function () {
    if (chrome.runtime.lastError) {
        message.innerText = 'Not allowed to inject CSS into special page.';
    } else {
        message.innerText = 'Injected style!';
    }
});
} else {
var optionsUrl = chrome.extension.getURL('popup.html');
message.innerHTML = 'Set a style in the <a target="_blank" href="' +
    optionsUrl + '">options page</a> first.';
} */


const showLinkForm = async (obj) => {
    const $root = document.querySelector("#link-form");
    $root.innerHTML = '';
    const $template = document.querySelector("#link-form-template").content.cloneNode(true);
    const $form = $template.querySelector('form');
    $form.addEventListener('submit', saveLink);
    $root.appendChild($template);
    if (obj) {
        $form.querySelector('input[name=id]').value = obj.id;
        $form.querySelector('input[name=title]').value = obj.title;
        $form.querySelector('input[name=url]').value = obj.url;
        $form.querySelector('select[name=method]').value = obj.method;
    } else {
        $form.reset();
    }
};

const saveLink = async (form) => {
    const $formNode = document.querySelector('#link-form form');
    const id = $formNode.querySelector('input[name=id]').value;
    const title = $formNode.querySelector('input[name=title]').value;
    const url = $formNode.querySelector('input[name=url]').value;
    const method = $formNode.querySelector('select[name=method]').value;
    await db.saveLink({ id: id, url, title, method });
    await triggerUpdate();
}

const openLink = async (obj) => {
    const cfg = await db.findLink(obj.id);
    if (!cfg) {
        alert("Sorry, I couldn't find anything");
        return;
    }
    const { url, method = 'GET' } = cfg;
    if (method === 'GET') {
        chrome.tabs.create({ url: url });
        return;
    }
    chrome.tabs.create(
        { url: chrome.runtime.getURL("fake-send.html") },
        (tab) => {
            const handler = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(handler);
                    chrome.tabs.sendMessage(tabId, cfg);
                }
            };

            // in case we're faster than page load (usually):
            chrome.tabs.onUpdated.addListener(handler);
            // just in case we're too late with the listener:
            chrome.tabs.sendMessage(tab.id, cfg);
        }
    );
}

const deleteLink = async (obj) => {
    await db.deleteLink(obj.id);
    await triggerUpdate();
}

const triggerUpdate = async () => {
    // showLinks(await db.findAllLinks());
    // await showLinkForm();
    await init();
}


const showLinks = (entries) => {
    const $root = document.querySelector("#available-links");
    $root.innerHTML = '';
    entries.forEach(el => {
        const $template = document.querySelector("#available-links-template").content.cloneNode(true);
        const $link = $template.querySelector(".link");
        $link.href = "#";
        $link.title = el.title;
        $link.innerHTML = el.title;
        // $link.id = el.id;
        $link.addEventListener('click', async () => await openLink(el));
        const $deleteBtn = $template.querySelector(".delete");
        $deleteBtn.addEventListener('click', async () => {
            console.log("delete data:", el);
            await deleteLink(el)
        });
        const $editBtn = $template.querySelector(".edit");
        $editBtn.addEventListener('click', async () => await showLinkForm(el));
        $root.appendChild($template);
    });
};


const init = async () => {
    const $root = document.querySelector("#root");
    $root.innerHTML = '';

    const $template = document.querySelector("#root-template").content.cloneNode(true);
    $template.querySelector(".add-link").addEventListener("click", async () => showLinkForm());
    const entries = await db.findAllLinks();
    console.log(entries);
    const $geeting = $template.querySelector('#greeting');
    $root.appendChild($template);
    if (entries && entries.length > 0) {
        $geeting.innerHTML = "Your Links";
        showLinks(entries);
    }
    else {
        $geeting.innerHTML = "Sorry, you don't seem to have any links. Try adding links by clicking the 'Add new link' button"
    }
}

init();


