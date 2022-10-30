import {copyToHtml, copyToText, currentTab, googleUrlWithTime, makeTimeTable} from "./lib.js";
import {bindToAnyKey, bindToClick} from "./bind.js";

const inputUrl = document.getElementById('inputUrl');
const pTitle = document.getElementById('pTitle');
const textIndex = document.getElementById('textIndex')
const links = document.getElementById('links');

// const buttonCopyCode = document.getElementById('buttonCopyCode');
const buttonCopyOneNote = document.getElementById('buttonCopyOneNote');
const buttonCopyToHtml = document.getElementById('buttonCopyToHtml');
const buttonSave = document.getElementById('buttonSave');

const msgCode = document.getElementById('msgCode');
const msgCodeCopied = document.getElementById('msgCodeCopied');
const msgOneNoteCopied = document.getElementById('msgOneNoteCopied');
const msgTimeQuoteCopied = document.getElementById('msgTextCopied');

function makeOneNoteLine(t, subject) {
    const url = googleUrlWithTime(t, inputUrl.value);
    return `
<p style="margin:0;font-family:Calibri;font-size:12.0pt" lang="nl">
<!--StartFragment-->
<a href="${url}">${t}</a> ${subject}
<!--EndFragment--></p>
`;
}

function makeOneNote(indexText) {
    let html = '';
    for (const row of makeTimeTable(indexText)) {
        html += makeOneNoteLine(row.time, row.text);
    }
    return html;
}

function copyText() {
    const indexText = textIndex.value;
    if (indexText.length > 0) {
        copyToText(indexText, showCopiedTextMessage);
    }
}

function makeLinks() {
    let html = '';
    for (const row of makeTimeTable(textIndex.value)) {
        html += makeLink(row);
    }
    links.innerHTML = html;

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
    const regex = /\/watch\?v=(.*?)&/;  // non greedy
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

const KEY_TIMETABLE = 'youtubeTimeTable';

function save() {
    const indexText = textIndex.value;  // content of the textarea (time-table)
    console.log(indexText);
    const code = codeFromUrl();
    chrome.storage.sync.set({[code]: indexText});
    // localStorage.setItem(KEY_TIMETABLE, indexText);

}

function hide(element) {
    element.style.visibility = 'hidden';
}

function bind() {
    bindToClick([
        // [buttonCopyCode, copyCode],
        [buttonCopyOneNote, copyOneNote],
        [buttonCopyToHtml, copyText],
        [buttonSave, save],
        [document, linkClick]
    ]);
    bindToAnyKey([
        [textIndex, makeLinks]
    ])
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
    const code = codeFromUrl();
    console.log(code);
    chrome.storage.sync.get(code, items => {
        console.log(items)
        textIndex.value = items[code];
    });
}

function makeLink(row) {
    return `
<div>
    <a class="link" data-time="${row.time}">${row.time}</a>&nbsp;${row.text}
</div>
`;
}

/*
de link in de popup naar youtube with time
zal in de actuele pagina de locatie veranderen
via het background script
 */
function linkClick(e) {
    const target = e.target;
    const time = target.getAttribute('data-time');
    if (time) {
        e.preventDefault();
        chrome.runtime.sendMessage({
            request: 'changeLocation',
            time
        }, () => {
        })
    }
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

