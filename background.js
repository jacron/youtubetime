function createContextMenu() {
    chrome.contextMenus.create(
        {
            id: 'onenoteadjust',
            title: `Copy selection for OneNote (leading time stamp)`,
            contexts: ["selection"],
            documentUrlPatterns: [
                "https://www.youtube.com/*"
            ]
        });
    chrome.contextMenus.create(
        {
            id: 'onenoteadjust2',
            title: `Copy selection for OneNote (trailing time stamp)`,
            contexts: ["selection"],
            documentUrlPatterns: [
                "https://www.youtube.com/*"
            ]
        });
}

function clickListener(info, tab) {
    // console.log(info)
    let notify = 'copy_requested';
    switch (info.menuItemId) {
        case 'onenoteadjust':
            break;
        case 'onenoteadjust2':
            notify = 'copy_requested_2'
            break;

    }
    chrome.tabs.sendMessage(tab.id, {
        notify
    }, (res) => console.log(res));
}

chrome.runtime.onInstalled.addListener(createContextMenu)
chrome.contextMenus.onClicked.addListener(clickListener);
