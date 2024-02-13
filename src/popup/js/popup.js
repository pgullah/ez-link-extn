import * as db from './local-store';
import {ifExists} from './utils';


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

const cloneTemplate = (selector) => ifExists(document.querySelector(selector), el => el.content.cloneNode(true));
const setFormElementValue = (form, selector, value) => ifExists(form.querySelector(selector), el => el.value = value);
const getFormElementValue = (form, selector) => ifExists(form.querySelector(selector), el => el.value);

const showLinkForm = async (obj) => {
    ifExists(document.querySelector("#link-form"), formRoot => {
        formRoot.innerHTML = '';
        ifExists(cloneTemplate("#link-form-template"), formTemplate => {
            formRoot.appendChild(formTemplate);
            ifExists(formTemplate.querySelector('form'), form => {
                form.addEventListener('submit', saveLink);
                if (obj !== null) {
                    setFormElementValue(form, 'input[name=id]', obj.id);
                    setFormElementValue(form, 'input[name=title]', obj.title);
                    setFormElementValue(form, 'input[name=url]', obj.url);
                    setFormElementValue(form, 'select[name=method]', obj.method);
                }
                else {
                    form.reset();
                }
            });
        });
    });
}

const saveLink = async () => {
    ifExists (document.querySelector('#link-form form'), async ($formNode) => {
        const id = getFormElementValue($formNode, 'input[name=id]');
        const title = getFormElementValue($formNode, 'input[name=title]');
        const url = getFormElementValue($formNode, 'input[name=url]');
        const method = getFormElementValue($formNode, 'select[name=method]');
        await db.saveLink({ id: id, url, title, method });
        await refreshView();
    });
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
    await refreshView();
}

const refreshView = async () => {
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


