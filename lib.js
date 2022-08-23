function getTime(seconds) {
    const extra = seconds.indexOf('&');
    if (extra !== -1) {
        seconds = seconds.substring(0, extra);
    }
    if (seconds.substring(seconds.length-1) === 's') {
        seconds = seconds.substring(0, seconds.length-1);
    }
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    const hours = Math.floor(minutes / 60);
    if (hours) {
        minutes = minutes % 60;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return `${hours}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

function getSeconds(time) {
    const parts = time.split(':');
    let seconds;
    if (parts.length > 2) {
        seconds = parts[0] * 60 * 60;
        seconds += parts[1] * 60;
        seconds += parseInt(parts[2]);
    } else if (parts.length > 1) {
        seconds = parts[0] * 60;
        seconds += parseInt(parts[1]);
    } else {
        seconds = parts[0];
    }
    return seconds;
}

function currentTab(cb) {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        cb(tabs[0]);
    });
}

function reformatTime(time) {
    const parts = time.split(':');
    if (parts.length < 2) {
        return time;
    }
    for (let i = 1; i < parts.length; i++) {
        if (parts[i].length === 1) {
            parts[i] = '0' + parts[i];
        }
    }
    return parts.join(':');
}

function copyToHtml(html, cb) {
    const blob = new Blob([html], {type: 'text/html'});
    const item = new ClipboardItem({
        ['text/html']: blob,
    });
    navigator.clipboard.write([item]).then(cb);
}

function copyToText(text, cb) {
    const blob = new Blob([text], {type: 'text/plain'});
    const item = new ClipboardItem({
        ['text/plain']: blob,
    });
    navigator.clipboard.write([item]).then(cb);
}

export {getSeconds, getTime, currentTab, reformatTime, copyToHtml, copyToText}
