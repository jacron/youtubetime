import {copyToHtml, copyToText, currentTab, getSeconds} from "./lib.js";
import {bindToClick} from "./bind.js";

const inputUrl = document.getElementById('inputUrl');
const pTitle = document.getElementById('pTitle');
const textIndex = document.getElementById('textIndex')

const buttonCopyCode = document.getElementById('buttonCopyCode');
const buttonCopyOneNote = document.getElementById('buttonCopyOneNote');
const buttonCopyToHtml = document.getElementById('buttonCopyToHtml');

const msgCode = document.getElementById('msgCode');
const msgCodeCopied = document.getElementById('msgCodeCopied');
const msgOneNoteCopied = document.getElementById('msgOneNoteCopied');
const msgTimeQuoteCopied = document.getElementById('msgTextCopied');

function makeOneNoteLine(t, subject) {
    const url = urlWithTime(t);
    return `
<p style="margin:0;font-family:Calibri;font-size:12.0pt" lang="nl">
<!--StartFragment-->
<a href="${url}">${t}</a> ${subject}
<!--EndFragment--></p>
`;

}

function makeOneNote(indexText) {
    const lines = indexText.split('\n');
    let html = '';
    for (const line of lines) {
        if (line.length > 0) {
            const words = line.split(' ');
            if (words.length > 1) {
                const time = words[0];
                words.shift();
                html += makeOneNoteLine(time, words.join(' '));
            }
        }
    }
    return html;
}

function getTimeParmFromUrl() {
    let pos = inputUrl.value.indexOf('&t=');
    if (pos === -1) {
        pos = inputUrl.value.indexOf('?t=');
    }
    return pos;
}

function urlWithTime(time) {
    const urlValue = inputUrl.value;
    const seconds = getSeconds(time) + 's';
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

function copyText() {
    const indexText = textIndex.value;
    if (indexText.length > 0) {
        copyToText(indexText, showCopiedTextMessage);
    }
}

function show(element) {
    element.style.visibility = 'visible';
}

function showCopiedMessage() {
    msgOneNoteCopied.style.visibility = 'visible';
}

function showCopiedTextMessage() {
    msgTimeQuoteCopied.style.visibility = 'visible';
}

function showCopiedCodeMessage(code) {
    show(msgCodeCopied);
    msgCode.innerText = code;
    show(msgCode);
}

function codeFromUrl() {
    const regex = /\/watch\?v=(.*)&/;
    return inputUrl.value.match(regex)[1];
}

function copyCode() {
    const code = codeFromUrl();
    copyToText(code, () => showCopiedCodeMessage(code));
}

function copyOneNote() {
    const indexText = textIndex.value;  // content of the textarea (time-table)
    if (indexText.length > 0) {
        copyToHtml(makeOneNote(indexText), showCopiedMessage);
    }
}

function hide(element) {
    element.style.visibility = 'hidden';
}

function bind() {
    bindToClick([
        [buttonCopyCode, copyCode],
        [buttonCopyOneNote, copyOneNote],
        [buttonCopyToHtml, copyText]
    ]);
}

function hideMessages() {
    hide(msgOneNoteCopied);
    hide(msgTimeQuoteCopied);
    hide(msgCodeCopied);
    hide(msgCode);
}

function receiveActiveUrl(current) {
    inputUrl.value = current.url;
    pTitle.innerText = current.title;
}

function init() {
    chrome.runtime.sendMessage({
        request: 'getActiveUrl'
    }, receiveActiveUrl);
    bind();
    hideMessages();
}

document.addEventListener('DOMContentLoaded', function () {
    currentTab((tab) => init(tab));
});

init();

