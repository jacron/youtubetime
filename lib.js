function getTime(seconds) {
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

function navigateToUrl(url) {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        const tab = tabs[0];
        chrome.tabs.update(tab.id, {url});
    });
}

function currentTab(cb) {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        cb(tabs[0]);
    });
}

function sepLines(s) {
    return s.replace(/<a class="yt-/g, '<br><a class="yt-');
}

export {getSeconds, getTime, navigateToUrl, currentTab, sepLines}
