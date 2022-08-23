import {copyToHtml, copyToText, currentTab, getSeconds, getTime, reformatTime} from "./lib.js";
import {bindToChange, bindToClick, bindToEnterKey} from "./bind.js";

const inputUrl = document.getElementById('inputUrl');
const inputTitle = document.getElementById('inputTitle');
const inputTime = document.getElementById('inputTime');
const spanUrlWithTime = document.getElementById('spanUrlWithTime');
const inputSubject = document.getElementById('inputSubject');

const buttonWithTime = document.getElementById('buttonWithTime');
const buttonCopyOneNote = document.getElementById('buttonCopyOneNote');
const buttonCopyToHtml = document.getElementById('buttonCopyToHtml');

const msgOneNoteCopied = document.getElementById('msgOneNoteCopied');
const msgTimeQuoteCopied = document.getElementById('msgTextCopied');

function makeOneNote() {
    return  `
<p style="margin:0;font-family:Calibri;font-size:12.0pt" lang="nl">
<!--StartFragment-->
<a href="${spanUrlWithTime.innerText}">${inputTime.value}</a> ${inputSubject.value}
<!--EndFragment--></p>`;
}

function makeTimeQuote() {
    return inputTime.value + ' ' + inputSubject.value;
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
    urlWithTime();
    spanUrlWithTime.innerText = urlWithTime();
    inputSubject.select();
}

function copyHtml() {
    if (spanUrlWithTime.innerText.length > 0) {
        copyToText(makeTimeQuote(), showCopiedTextMessage());
    }
}

function showCopiedMessage() {
    msgOneNoteCopied.style.visibility = 'visible';
}

function showCopiedTextMessage() {
    msgTimeQuoteCopied.style.visibility = 'visible';
}

function copyOneNote() {
    if (spanUrlWithTime.innerText.length > 0) {
        copyToHtml(makeOneNote(), showCopiedMessage);
    }
}

function hide(element) {
    element.style.visibility = 'hidden';
}

function tidyTime() {
    inputTime.value = reformatTime(inputTime.value);
}

function bind() {
    bindToClick([
        [buttonWithTime, withTime],
        [buttonCopyOneNote, copyOneNote],
        [buttonCopyToHtml, copyHtml]
    ]);
    bindToChange([
        [inputTime, tidyTime]
    ])
    bindToEnterKey([
        [inputUrl, makeTime],
        [inputTime, withTime],
        // [inputSubject, copyOneNote]
    ]);
}

function hideMessages() {
    hide(msgOneNoteCopied);
    hide(msgTimeQuoteCopied);
}

function init(tab) {
    bind();
    hideMessages();
    if (tab) {
        inputUrl.value = tab.url;
        inputTitle.value = tab.title;
        makeTime();
        inputTime.select();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    currentTab((tab) => init(tab));
});

// standalone
init();

