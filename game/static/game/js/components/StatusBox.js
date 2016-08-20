
var status_dom = $('#game-status');

function statusChanged(event) {
    var text = STATUS_STORE.text();
    status_dom.text(text);
}

STATUS_STORE.addListener(statusChanged);


