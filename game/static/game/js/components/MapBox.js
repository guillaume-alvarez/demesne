
var map = document.getElementById('map');

function mapChanged(event) {
    var table = document.createElement('table');
    for (var x = 0; x < MAP_STORE.size(); x++){
        var tr = document.createElement('tr');
        for (var y = 0; y < MAP_STORE.size(); y++){
            var td = document.createElement('td');
            var node = MAP_STORE.node(x, y);
            var text = node ? node : 'empty';
            td.appendChild(document.createTextNode(text));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    while (map.firstChild) {
        map.removeChild(map.firstChild);
    }
    map.appendChild(table);
}

function initButton() {
    var button = document.createElement("button");
    button.type = "button";
    button.class = "btn btn-default btn-lg";
    button.innerHTML = "Start game...";
    button.onclick = function() { // Note this is a function
        Actions.startGame(4);
    };

    while (map.firstChild) {
        map.removeChild(map.firstChild);
    }
    map.appendChild(button);
}

initButton();
MAP_STORE.addListener(mapChanged);


