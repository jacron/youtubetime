/*
https://youtu.be/0r786YiL92Y?t=35
of
https://www.youtube.com/watch?v=0r786YiL92Y&t=32s
 */

import {currentTab, getSeconds, getTime, navigateToUrl} from "./lib.js";
import {bindToClick, bindToEnterKey} from "./bind.js";

const inputUrl = document.getElementById('inputUrl');
const inputTime = document.getElementById('inputTime');
const inputHtml = document.getElementById('inputHtml');
const inputOneNote = document.getElementById('inputOneNote');
const inputSubject = document.getElementById('inputSubject');

const buttonHtml = document.getElementById('buttonHtml');
const buttonGo = document.getElementById('buttonGo');
const buttonTime = document.getElementById('buttonTime');
const buttonCopy = document.getElementById('buttonCopy');
const buttonOneNote = document.getElementById('buttonOneNote');
const buttonCopyOneNote = document.getElementById('buttonCopyOneNote');
const buttonPaste = document.getElementById('buttonPaste');

const msgHtmlCopied = document.getElementById('msgHtmlCopied');
const msgOneNoteCopied = document.getElementById('msgOneNoteCopied');

const htmltext = "text/html";

function makeTime() {
    const pos = getTimeParm();
    if (pos !== -1) {
        inputTime.value = getTime(inputUrl.value.substring(pos + 3));
    }
}

function getTimeParm() {
    let pos = inputUrl.value.indexOf('&t=');
    if (pos === -1) {
        pos = inputUrl.value.indexOf('?t=');
    }
    return pos;
}

function makeHtml() {
    const pos = getTimeParm();
    if (pos !== -1) {
        inputHtml.value = inputUrl.value.substring(0, pos + 3) +
            getSeconds(inputTime.value) + 's';
    } else {
        inputHtml.value = '';
    }
}

function makeOneNote() {
    inputOneNote.value  = `
<p style="margin:0in;font-family:Calibri;font-size:12.0pt" lang="nl">
<!--StartFragment-->
<a href="${inputHtml.value}">${inputTime.value}</a> ${inputSubject.value}
<!--EndFragment--></p>`;
}

function copyToHtml(html, cb) {
    const blob = new Blob([html], {type: htmltext});
    const item = new ClipboardItem({
        [htmltext]: blob,
    });
    navigator.clipboard.write([item]).then(cb);
}

function copyOneNote() {
    if (inputOneNote.value.length > 0) {
        copyToHtml(inputOneNote.value, () => {
            msgOneNoteCopied.style.visibility = 'visible';
            msgHtmlCopied.style.visibility = 'hidden';
        });
    }
}

function copyHtml() {
    if (inputHtml.value.length > 0) {
        copyToHtml(inputHtml.value, () => {
            msgHtmlCopied.style.visibility = 'visible';
            msgOneNoteCopied.style.visibility = 'hidden';
        });
    }
}

function toUrl() {
    navigateToUrl(inputHtml.value);
}

function pasteUrl() {
    console.log('paste...')
    inputUrl.select();
    document.execCommand('paste');
}

function bind() {
    bindToClick([
        [buttonHtml, makeHtml],
        [buttonGo, toUrl],
        [buttonTime, makeTime],
        [buttonCopy, copyHtml],
        [buttonOneNote, makeOneNote],
        [buttonCopyOneNote, copyOneNote],
        [buttonPaste, pasteUrl]
    ])
    bindToEnterKey([
        [inputUrl, makeTime],
        [inputTime, makeHtml],
        [inputHtml, toUrl]
    ]);
}

function hideMessages() {
    msgOneNoteCopied.style.visibility = 'hidden';
    msgHtmlCopied.style.visibility = 'hidden';
}

function init(tab) {
    bind();
    hideMessages();
    if (tab) {
        inputUrl.value = tab.url;
        makeTime();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    currentTab((tab) => init(tab));
});
