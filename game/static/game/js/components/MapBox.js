
var map = $("#map");

function mapChanged(event) {
    var table = $('<table class ="table table-bordered" >');
    for (var x = 0; x < MAP_STORE.size(); x++){
        var tr = $("<tr>");
        for (var y = 0; y < MAP_STORE.size(); y++){
            var td = $('<td>');
            var node = MAP_STORE.node(x, y);
            var text = node ? node : 'empty';
            td.text(text);
            tr.append(td);
        }
        table.append(tr);
    }

    map.empty();
    map.append(table);
}

function initButton() {
    var button = $("<button>START GAME</button>").addClass("btn btn-success btn-lg").attr("type","button");
    button.click(function() { // Note this is a function
        Actions.startGame(4);
    });

    map.empty();
    map.append(button);
}

initButton();
MAP_STORE.addListener(mapChanged);


