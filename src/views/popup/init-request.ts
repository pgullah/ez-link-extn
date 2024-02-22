const onMessageHandler = (message: any) => {
    // Ensure it is run only once, as we will try to message twice
    chrome.runtime.onMessage.removeListener(onMessageHandler);
    alert("test");
    var form = document.createElement("form");
    const { url, method, data: { params } } = message;
    form.setAttribute("method", method);
    let finalUrl = url;
    if (method === 'GET' && url.indexOf('?') === -1) {
        finalUrl += "?"
    }
    if (params != null) {
        for (var key in params) {
            const value = params[key];
            if (method == 'GET') {
                finalUrl += `&${key}=${value}`;
            } else {

            }
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
        }
    }
    form.setAttribute("action", finalUrl);
    document.body.appendChild(form);
    console.log(message);
    // form.submit();
};

chrome.runtime.onMessage.addListener(onMessageHandler);