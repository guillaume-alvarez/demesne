
var status_dom = $('#game-status');

var status_dialog = $('<ul class="list-group"></ul>');
status_dialog.dialog({
        autoOpen: false,
        modal: true,
        minWidth: 480,
        title: 'Cannot execute your order!',
        buttons: {
            Ok: function() {
                status_dialog.dialog("close");
            }
        }
    });

function statusChanged(event) {
    var text = STATUS_STORE.text();
    status_dom.text(text);

    // in case there was some error to notify
    var errors = STATUS_STORE.errors();
    if (errors) {
        status_dialog.empty();
        for (var i=0;i<errors.length;i++) {
            status_dialog.append($('<li class="list-group-item">'+errors[i]+'</li>'))
        }
        status_dialog.dialog("open");
    }
}

STATUS_STORE.addListener(statusChanged);


