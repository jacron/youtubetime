function createContextMenu() {
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

function clickListener(info, tab) {
    chrome.tabs.sendMessage(tab.id, {
        notify: info.menuItemId
    }, (res) => console.log(res));
}

chrome.runtime.onInstalled.addListener(createContextMenu)
chrome.contextMenus.onClicked.addListener(clickListener);
