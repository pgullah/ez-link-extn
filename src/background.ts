import { EventActionType, Link } from "./common/models";

chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
    console.log("Got your message from content.js : ", request);
    if (request.actionType === EventActionType.LINK_ACTION_INIT) {
        const link = request.data
        chrome.tabs.create(
            { url: chrome.runtime.getURL("views/redirect.html"), active: true },
            (tab) => {
                const handler = (tabId: number, changeInfo: any) => {
                    if (tabId === tab.id && changeInfo.status === "complete") {
                        chrome.tabs.onUpdated.removeListener(handler);
                        chrome.tabs.sendMessage(tabId, link);
                    }
                };
    
                // in case we're faster than page load (usually):
                chrome.tabs.onUpdated.addListener(handler);
                // just in case we're too late with the listener:
                tab.id !== undefined && chrome.tabs.sendMessage(tab.id, link);
            }
        );
    }
    // sendResponse('Got it');
});