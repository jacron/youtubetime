function copyToHtml(html, cb) {
    const blob = new Blob([html], {type: 'text/html'});
    const item = new ClipboardItem({
        ['text/html']: blob,
    });
    navigator.clipboard.write([item]).then(cb);
}

function adjustToOneNote(text, mode) {
    switch (mode) {
        case 1:
            return text.replace(/<a class="yt-simple-endpoint/g,
                '<br><a class="yt-simple-endpoint');
        case 2:
            return text.replace(/(<a class="yt-simple-endpoint.*\/a>)/g, '$&<br>');
    }
}

getSelectionHTML = function (userSelection) {
    const range = userSelection.getRangeAt(0);
    const clonedSelection = range.cloneContents ();
    const div = document.createElement ('div');
    div.appendChild (clonedSelection);
    return div.innerHTML;
};

function adjustClipboard(rsp, mode) {
    const html = getSelectionHTML(window.getSelection());
    copyToHtml(adjustToOneNote(html, mode));
    rsp('list was adjusted');
}

function listener(req, snd, rsp) {
    if (req.notify) {
        console.log(req.notify);
        switch(req.notify) {
            case 'copy_requested':
                adjustClipboard(rsp, 1);
                break;
            case 'copy_requested_2':
                adjustClipboard(rsp, 2);
                break;
        }
    }
}
chrome.runtime.onMessage.addListener(listener);
