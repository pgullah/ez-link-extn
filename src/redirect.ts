import { LinkParameter } from "common/models";

const onMessageHandler = (message: any) => {
    // Ensure it is run only once, as we will try to message twice
    chrome.runtime.onMessage.removeListener(onMessageHandler);
    console.log("message", message);
    var form = document.createElement("form");
    const { url, method, params } = message;
    const requestedMethod = method || 'GET'
    form.setAttribute("method", requestedMethod);
    let finalUrl = url;
    if (requestedMethod === 'GET' && url.indexOf('?') === -1) {
        finalUrl += "?"
    }
    if (params != null) {
        params
            .filter((p: LinkParameter) => p !== undefined && p.key !== undefined)
            .forEach((p: LinkParameter) => {
                if (requestedMethod == 'GET') {
                    finalUrl += `&${p.key}=${p.value}`;
                } else {
                    const hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", p.key!!);
                    hiddenField.setAttribute("value", p.value!!);
                    form.appendChild(hiddenField);
                }
            })
    }
    console.log("final url: ", finalUrl);
    console.log("method:", requestedMethod)
    if (requestedMethod == 'GET') {
        window.location = finalUrl;
        return;
    } else {
        form.setAttribute("action", finalUrl);
        document.body.appendChild(form);
        console.log("form: ", form);
        form.submit();
    }
};

chrome.runtime.onMessage.addListener(onMessageHandler);