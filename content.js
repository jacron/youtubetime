function copyToHtml(html, cb) {
    const blob = new Blob([html], {type: 'text/html'});
    const item = new ClipboardItem({
        ['text/html']: blob,
    });
    navigator.clipboard.write([item]).then(cb);
}

function adjustToOneNote(text) {
    return text.replace(/<a class="yt-simple-endpoint/g,
        '<br><a class="yt-simple-endpoint');
}

getSelectionHTML = function (userSelection) {
    const range = userSelection.getRangeAt(0);
    const clonedSelection = range.cloneContents ();
    const div = document.createElement ('div');
    div.appendChild (clonedSelection);
    return div.innerHTML;
};

function adjustClipboard(rsp) {
    const html = getSelectionHTML(window.getSelection());
    copyToHtml(adjustToOneNote(html));
    rsp('list was adjusted');
}

function listener(req, snd, rsp) {
    if (req.notify && req.notify === 'copy_requested') {
        console.log('copy requested');
        adjustClipboard(rsp);
    }
}
chrome.runtime.onMessage.addListener(listener);
