let actionWinId = null;
let current = {};

function createContextMenus() {
    chrome.contextMenus.create(
        {
            id: 'onenoteadjustLeading',
            title: `Copy selection for OneNote (leading time stamp)`,
            contexts: ["selection"],
            documentUrlPatterns: [
                "https://www.youtube.com/*"
            ]
        });
    chrome.contextMenus.create(
        {
            id: 'onenoteadjustTrailing',
            title: `Copy selection for OneNote (trailing time stamp)`,
            contexts: ["selection"],
            documentUrlPatterns: [
                "https://www.youtube.com/*"
            ]
        });
}

function contextMenuClickListener(info, tab) {
    chrome.tabs.sendMessage(tab.id, {
        notify: info.menuItemId
    }, (res) => console.log(res));
}

function initView() {
    chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 660,
        height: 400
    }, win => {
        actionWinId = win.id;
    })
}

function actionListener() {
    if (actionWinId === null) {
        queryActiveTab();
    }
}

function queryActiveTab(sendResponse) {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function (tabs) {
        if (tabs[0]) {
            const {url, title} = tabs[0];
            current.url = url;
            current.title = title;
            initView();
        }
    });
}

function listenClientRequest(req, sender, sendResponse) {
    if (req.request && req.request === 'getActiveUrl') {
        sendResponse(current);
    } else {
        sendResponse('invalid request');
    }
}

function onRemoval(windowId) {
    if (windowId === actionWinId) {
        actionWinId = null;
    }
}

chrome.runtime.onInstalled.addListener(createContextMenus)
chrome.runtime.onMessage.addListener(listenClientRequest);
chrome.contextMenus.onClicked.addListener(contextMenuClickListener);
chrome.browserAction.onClicked.addListener(actionListener);
chrome.windows.onRemoved.addListener(onRemoval);
