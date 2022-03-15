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
        button.addEventListener('click', listener)
    }
}


export {bindToEnterKey, bindToClick}
