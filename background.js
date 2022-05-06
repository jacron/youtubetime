chrome.contextMenus.create(
    {
        id: 'onenoteadjust',
        title: `Adjust selection for OneNote`,
        contexts: ["selection"],
        documentUrlPatterns: [
            "https://www.youtube.com/*"
        ]
    });

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
        notify: 'copy_requested'
    }, (res) => console.log(res));
});
