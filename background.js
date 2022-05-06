function createContextMenu() {
    chrome.contextMenus.create(
        {
            id: 'onenoteadjust',
            title: `Adjust selection for OneNote`,
            contexts: ["selection"],
            documentUrlPatterns: [
                "https://www.youtube.com/*"
            ]
        });
}

function clickListener(info, tab) {
    chrome.tabs.sendMessage(tab.id, {
        notify: 'copy_requested'
    }, (res) => console.log(res));
}

chrome.runtime.onInstalled.addListener(createContextMenu)
chrome.contextMenus.onClicked.addListener(clickListener);
