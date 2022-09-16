const NOTIFY_ADJUST = 'onenoteadjustclipboard';

function isTimeLeading(text) {
    // console.log(text);
    const words = text.split(' ');
    const parts = words[0].split(':');
    return parts.length > 1;
}

function adjustToOneNote(text, timeLeading) {
    if (timeLeading) {
        text = text.replace(/<a class="yt-simple-endpoint/g,
            '<br><a class="yt-simple-endpoint');
    } else {
        text = text.replace(/(<a class="yt-simple-endpoint.*\/a>)/g, '$&<br>');
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

async function copyToHtml(html, rsp) {
    const blob = new Blob([html], {type: 'text/html'});
    const item = new ClipboardItem({
        ['text/html']: blob,
    });
    try {
        await navigator.clipboard.write([item]);
        rsp('list was adjusted');
    } catch (err) {
        console.error('Failed to copy: ', err);
        rsp(err);
    }
}

function adjustClipboard(text, rsp) {
    const html = getSelectionHTML(window.getSelection());
    const adjusted = adjustToOneNote(html, isTimeLeading(text));
    copyToHtml(adjusted, rsp).then();
}

function listener(req, snd, rsp) {
    if (req.notify && req.notify === NOTIFY_ADJUST) {
        adjustClipboard(req.text, rsp);
    }
}
chrome.runtime.onMessage.addListener(listener);
