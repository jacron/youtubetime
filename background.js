let actionWinId = null;
let current = {};
let lastActiveTabId = null;
const NOTIFY_ADJUST = 'onenoteadjustclipboard';

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
function contextMenuClickListener(info, tab) {
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

function actionListener() {
    if (actionWinId === null) {
        queryActiveTab();
    } else {
        closeView();
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

function queryActiveTab() {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, onQuery);
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
    activationListener();
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

function activationListener(activeInfo) {
    if (activeInfo && activeInfo.tabId !== lastActiveTabId) {
        closeView();
    }
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, queryListener);
}

function updateListener(tabId) {
    lastActiveTabId = tabId;
    activationListener();
}

chrome.runtime.onInstalled.addListener(createContextMenus)
chrome.runtime.onMessage.addListener(listenClientRequest);
chrome.contextMenus.onClicked.addListener(contextMenuClickListener);
chrome.browserAction.onClicked.addListener(actionListener);
chrome.windows.onRemoved.addListener(onRemoval);
chrome.tabs.onActivated.addListener(activationListener);
chrome.tabs.onUpdated.addListener(updateListener);
