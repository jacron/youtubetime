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

function getTimeParmFromUrl(url) {
    let pos = url.indexOf('&t=');
    if (pos === -1) {
        pos = url.indexOf('?t=');
    }
    return pos;
}

function googleUrlWithTime(time, url) {
    const seconds = getSeconds(time) + 's';
    const pos = getTimeParmFromUrl(url);
    if (pos !== -1) {
        return url.substring(0, pos + 3) + seconds;
    } else {
        const qpos = url.indexOf('?');
        if (qpos !== -1) {
            return url + '&t=' + seconds;
        } else {
            return url + '?t=' + seconds;
        }
    }
}

function makeTimeTable(text) {
    const lines = text.split('\n');
    const timeTable = [];
    for (const line of lines) {
        if (line.length > 0) {
            const words = line.split(' ');
            if (words.length > 1) {
                const time = words[0];
                words.shift();
                timeTable.push({
                    time,
                    text: words.join(' ')
                })
            }
        }
    }
    return timeTable;
}

export {getSeconds, currentTab, copyToHtml, copyToText,
    googleUrlWithTime, makeTimeTable}
