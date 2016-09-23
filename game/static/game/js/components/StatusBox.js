
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
    window.status_first = STATUS_STORE.text();
    if(window.status_full){
        window.status_full = window.status_first + "<br>" +  window.status_full;
    }else{
        window.status_full = window.status_first;
    }
    if(window.open){
        status_dom.html(window.status_full);
    }else{
        status_dom.html(window.status_first);
    }

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


