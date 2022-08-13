function adjustToOneNote(text, mode) {
    switch (mode) {
        case 'onenoteadjustLeading':
            text = text.replace(/<a class="yt-simple-endpoint/g,
                '<br><a class="yt-simple-endpoint');
            break;
        case 'onenoteadjustTrailing':
            text = text.replace(/(<a class="yt-simple-endpoint.*\/a>)/g, '$&<br>');
            break;
    }
    if (text.indexOf('https://') !== -1) {
        return text;
    } else {
        return text.replace(/\/watch\?/g, 'https://www.youtube.com/watch?');
    }
}

getSelectionHTML = function (userSelection) {
    const range = userSelection.getRangeAt(0);
    const clonedSelection = range.cloneContents ();
    const appendedDiv = document.createElement ('div');
    appendedDiv.appendChild (clonedSelection);
    return appendedDiv.innerHTML;
};

async function copyToHtml(html) {
    const blob = new Blob([html], {type: 'text/html'});
    const item = new ClipboardItem({
        ['text/html']: blob,
    });
    try {
        await navigator.clipboard.write([item]);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

function adjustClipboard(rsp, mode) {
    const html = getSelectionHTML(window.getSelection());
    const adjusted = adjustToOneNote(html, mode);
    // console.log(adjusted);
    copyToHtml(adjusted).then();
    rsp('list was adjusted');
}

function listener(req, snd, rsp) {
    if (req.notify) {
        // console.log(req.notify);
        adjustClipboard(rsp, req.notify);
    }
}
chrome.runtime.onMessage.addListener(listener);
