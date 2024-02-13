const onMessageHandler = (message) => {
    // Ensure it is run only once, as we will try to message twice
    chrome.runtime.onMessage.removeListener(onMessageHandler);

    var form = document.createElement("form");
    const {url, method, data:{params}} = message
    form.setAttribute("action", url);
    form.setAttribute("method", method);
    if (params != null) {
        for (var key in params) {
            const hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    console.log(message);
    form.submit();
};

chrome.runtime.onMessage.addListener(onMessageHandler);