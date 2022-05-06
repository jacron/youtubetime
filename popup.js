import {adjustToOneNote, copyToHtml, currentTab, getSeconds, getTime, navigateToUrl, reformatTime} from "./lib.js";
import {bindToChange, bindToClick, bindToEnterKey} from "./bind.js";

const inputUrl = document.getElementById('inputUrl');
const inputTitle = document.getElementById('inputTitle');
const inputTime = document.getElementById('inputTime');
const inputUrlWithTime = document.getElementById('inputUrlWithTime');
const inputSubject = document.getElementById('inputSubject');

const buttonWithTime = document.getElementById('buttonWithTime');
const buttonGo = document.getElementById('buttonGo');
const buttonMakeTime = document.getElementById('buttonMakeTime');
const buttonCopyOneNote = document.getElementById('buttonCopyOneNote');
const buttonAdjustClipboard = document.getElementById('buttonAdjustClipboard');

const msgOneNoteCopied = document.getElementById('msgOneNoteCopied');
const msgHtmlGone = document.getElementById('msgHtmlGone');
const msgClipboardAdjusted = document.getElementById('msgClipboardAdjusted');

function makeOneNote() {
    return  `
<p style="margin:0;font-family:Calibri;font-size:12.0pt" lang="nl">
<!--StartFragment-->
<a href="${inputUrlWithTime.value}">${inputTime.value}</a> ${inputSubject.value}
<!--EndFragment--></p>`;
}

function makeTime() {
    const pos = getTimeParmFromUrl();
    if (pos !== -1) {
        inputTime.value = getTime(inputUrl.value.substring(pos + 3));
    }
}

function getTimeParmFromUrl() {
    let pos = inputUrl.value.indexOf('&t=');
    if (pos === -1) {
        pos = inputUrl.value.indexOf('?t=');
    }
    return pos;
}

function urlWithTime() {
    const urlValue = inputUrl.value;
    const seconds = getSeconds(inputTime.value) + 's';
    const pos = getTimeParmFromUrl();
    if (pos !== -1) {
        return urlValue.substring(0, pos + 3) + seconds;
    } else {
        const qpos = urlValue.indexOf('?');
        if (qpos !== -1) {
            return urlValue + '&t=' + seconds;
        } else {
            return urlValue + '?t=' + seconds;
        }
    }
}

function withTime() {
    inputUrlWithTime.value = urlWithTime();
    disableGo();
}

function copyOneNote() {
    if (inputUrlWithTime.value.length > 0) {
        copyToHtml(makeOneNote(), () => {
            msgOneNoteCopied.style.visibility = 'visible';
        });
    }
}

function toUrl() {
    navigateToUrl(inputUrlWithTime.value);
}

function adjustClipboard() {
    navigator.clipboard.read().then(content => {
        for (const item of content) {
            if (item.types.includes('text/html')) {
                item.getType('text/html').then(
                    blob => blob.text().then(
                        text => {
                            copyToHtml(adjustToOneNote(text));
                            msgClipboardAdjusted.style.visibility = 'visible';
                        }
                    )
                )
            }
        }
    })
}

function disableMakeTime() {
    if (inputUrl.value.indexOf('t=') === -1) {
        buttonMakeTime.setAttribute('disabled', 'disabled');
    } else {
        buttonMakeTime.removeAttribute('disabled');
    }
}

function disableGo() {
    if (inputUrlWithTime.value.length === 0) {
        buttonGo.setAttribute('disabled', 'disabled');
        buttonCopyOneNote.setAttribute('disabled', 'disabled');
    } else {
        buttonGo.removeAttribute('disabled');
        buttonCopyOneNote.removeAttribute('disabled');
    }
}

function tidyTime() {
    inputTime.value = reformatTime(inputTime.value);
}

function bind() {
    bindToClick([
        [buttonWithTime, withTime],
        [buttonGo, toUrl],
        [buttonMakeTime, makeTime],
        [buttonCopyOneNote, copyOneNote],
        [buttonAdjustClipboard, adjustClipboard]
    ]);
    bindToChange([
        [inputUrl, disableMakeTime],
        [inputUrlWithTime, disableGo],
        [inputTime, tidyTime]
    ])
    bindToEnterKey([
        [inputUrl, makeTime],
        [inputTime, withTime],
    ]);
}

function hideMessages() {
    msgOneNoteCopied.style.visibility = 'hidden';
    msgHtmlGone.style.visibility = 'hidden';
    msgClipboardAdjusted.style.visibility = 'hidden';
}

function init(tab) {
    bind();
    hideMessages();
    if (tab) {
        inputUrl.value = tab.url;
        inputTitle.value = tab.title;
        makeTime();
    } else {
        inputUrl.value = 'https://www.youtube.com/watch?v=FRyE7kN0rlk'; // testing
    }
    disableMakeTime();
    disableGo();
}

document.addEventListener('DOMContentLoaded', function () {
    currentTab((tab) => init(tab));
});

// standalone
init();

