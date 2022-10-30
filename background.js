let actionWinId = null;
let current = {};
let lastActiveTabId = null;
const NOTIFY_ADJUST = 'onenoteadjustclipboard';
let requestedUrl = '';


function createContextMenus() {
    chrome.contextMenus.create(
        {
            id: 'onenoteadjusttable',
            title: `Copy selection for OneNote`,
            contexts: ["selection"],
            documentUrlPatterns: [
                "https://www.youtube.com/*"
            ]
        });
}

/**
 * notify client (content.js) with onenoteadjusttable
 * @param info
 * @param tab
 */
function contextMenuListener(info, tab) {
    // console.log(info);
    chrome.tabs.sendMessage(tab.id, {
        notify: NOTIFY_ADJUST,
        text: info.selectionText
    }, (res) => console.log(res));
}

function initView() {
    chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 610,
        height: 400
    }, win => actionWinId = win.id)
}

function closeView() {
    if (actionWinId) {
        chrome.windows.remove(actionWinId,
            () => actionWinId = null);
    }
}

function browserActionListener() {
    if (actionWinId === null) {
        queryActiveTab(onQuery);
    } else {
        closeView();
    }
}

function changeLocation(tabs) {
    console.log(tabs);
    if (tabs[0]) {
        chrome.tabs.update(tabs[0].id, {url: requestedUrl}).then(r => {});
    }
}

function onQuery(tabs) {
    if (tabs[0]) {
        const {url, title} = tabs[0];
        current.url = url;
        current.title = title;
        initView();
    }
}

function queryActiveTab(cb) {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, cb);
}

function clientRequestListener(req, sender, sendResponse) {
    if (req.request) {
        switch(req.request) {
            case 'getActiveUrl':
                sendResponse(current);
                break;
            case 'changeLocation':
                console.log(req.url);
                requestedUrl = req.url;
                queryActiveTab(changeLocation)
                break;
            default:
                sendResponse('invalid request');
                break;
        }
    }
}

function windowRemovalListener(windowId) {
    if (windowId === actionWinId) {
        actionWinId = null;
    }
    tabActivationListener();
}

function queryListener(tabs) {
    // set badge text to 'time' if on YouTube.com, watching a video
    if (tabs[0]) {
        const {url, id} = tabs[0];
        let text = '';
        if (url.indexOf("youtube.com/watch?") !== -1) {
            chrome.browserAction.enable(id);
            text = 'time';
        }
        else {
            chrome.browserAction.disable(id);
        }
        chrome.browserAction.setBadgeText({text});
    }
}

function tabActivationListener(activeInfo) {
    if (activeInfo && activeInfo.tabId !== lastActiveTabId) {
        closeView();
    }
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, queryListener);
}

function tabUpdateListener(tabId) {
    lastActiveTabId = tabId;
    tabActivationListener();
}

chrome.runtime.onInstalled.addListener(createContextMenus)
chrome.runtime.onMessage.addListener(clientRequestListener);
chrome.contextMenus.onClicked.addListener(contextMenuListener);
chrome.browserAction.onClicked.addListener(browserActionListener);
chrome.windows.onRemoved.addListener(windowRemovalListener);
chrome.tabs.onActivated.addListener(tabActivationListener);
chrome.tabs.onUpdated.addListener(tabUpdateListener);
