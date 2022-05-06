function bindToEnterKey(inputs) {
    for (const [input, listener] of inputs) {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                listener();
            }
        })
    }
}

function bindToClick(buttons) {
    for (const [button, listener] of buttons) {
        if (!button) {
            console.error('Undefined button for listener:', listener);
            continue;
        }
        button.addEventListener('click', listener)
    }
}

function bindToChange(inputs) {
    for (const [input, listener] of inputs) {
        input.addEventListener('change', listener);
    }
}

export {bindToEnterKey, bindToClick, bindToChange}
