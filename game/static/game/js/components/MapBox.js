
var map = $("#map");

function mapChanged(event) {
    // update name
    $("#gameName").text(MAP_STORE.name());

    var table = $('<table class ="table table-bordered" >');
    for (var x = 0; x < MAP_STORE.size(); x++){
        var tr = $("<tr>");
        for (var y = 0; y < MAP_STORE.size(); y++){
            var td = $('<td>');
            var node = MAP_STORE.node(x, y);
            var text = node ?
                '<div class="node"><img src="'+window.staticUrl+'img/'+node.slug+'.jpg"></div>'
                : '<div class="node">empty</div>';
            td.html(text);
            tr.append(td);
            // add popover
            td.attr("title",node?node.name:'Empty tile');
            td.popover({
                toggle:"popover",
                trigger:"hover",
                container:"body",
                content:formatInfo(node),
                placement:"bottom",
                html:true
            });

            // let select a type for free nodes
            if (!node) {
                td.click(function(){
                    console.log('Ask type to set for node at (%d, %d)', x, y);
                    Actions.askType();
                });
            }
        }
        table.append(tr);
    }

    map.empty();
    map.append(table);
}

function formatInfo(node){
    if(node){
        var info = "<strong>"+(node.add_slot >0?"+"+node.add_slot+" SLOT<br>":"")
        +(node.add_gold >0?"+"+node.add_gold+" <i class='fa fa-money'></i><br>":"")
        +(node.add_buy >0?"+"+node.add_buy+" BUY<br>":"")
        +"<em>"+node.description+"</em>"
    }else{
        var info = "<em>This tile is free and does nothing.</em>";
    }
    return info;
}

function initButton() {
    var button = $("<button id='startgame'>START GAME</button>").addClass("btn btn-success btn-lg").attr("type","button");
    button.click(function() { // Note this is a function
        Actions.startGame(4);
    });
    map.empty();
    map.append(button);
}

initButton();
MAP_STORE.addListener(mapChanged);


