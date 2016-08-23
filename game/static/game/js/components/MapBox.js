
var map = $("#map");

function mapChanged(event) {
    // update name
    $("#gameName").text(MAP_STORE.name());

    function onclick(x, y) {
        return function() {
            console.log('Ask type to set for node at (%d, %d)', x, y);
            Actions.askType(x, y);
        };
    }

    var table = $('<table class ="table table-bordered" >');
    for (var x = 0; x < MAP_STORE.size(); x++){
        var tr = $("<tr>");
        for (var y = 0; y < MAP_STORE.size(); y++){
            var td = $('<td>');
            var places = MAP_STORE.node(x, y).places;
            var node = places ? places[0] : null;


            var nodeClasses = "node "+((places && places.length > 1)?"multiple":"");
            var text = node ?
                '<div class="'+nodeClasses+'"><img src="'+window.staticUrl+'img/'+node.slug+'.jpg"></div>'
                : '<div class="node">empty</div>';
            td.html(text);
            tr.append(td);
            // add popover
            var title = node?((places && places.length > 1) ?'Multiple cards':node.name):'Empty tile';
            td.attr("title",title);
            td.popover({
                toggle:"popover",
                trigger:"hover",
                container:"body",
                content:formatInfo(places),
                placement:"bottom",
                html:true
            });

            // calculate slots
            var slotsRemaining = 1;
            var maxSlots = 1;
            if(places){
                $.each(places,function(index,type){
                    maxSlots = maxSlots + type.add_slot;
                    slotsRemaining = slotsRemaining - 1 + type.add_slot;
                });
            }
            td.children(".node").append("<span class='bottom-right"+(slotsRemaining == 0?" no-more":"")+"'>"+slotsRemaining+"/"+maxSlots+"</span>");

            // let select a type for free nodes
            td.click(onclick(x, y));
        }
        table.append(tr);
    }

    map.empty();
    map.append(table);
}

function formatType(type){
    if(type){
        var info = "<strong>"
            +(type.add_slot >0?"<span class='slot'>+"+type.add_slot+" SLOT</span><br>":"")
            +(type.add_gold >0?"<span class='gold'>+"+type.add_gold+" <i class='fa fa-money'></i></span><br>":"")
            +(type.add_buy >0?"<span class='buy'>+"+type.add_buy+" BUY</span><br>":"");
        if (type.description) info += "<em>"+type.description+"</em>";
        info = info + "</strong>"
    }else{
        var info = "<em>This tile is free and does nothing.</em>";
    }
    return info;

}

function formatInfo(places){

        if(places && places.length > 1){
            var info ="";
            // on concatène l'affichage de chaque carte en rappelant la méthode avec un tableau de 1
            $.each(places,function(index,type){
                info = info + "<div class='place-description'>";
                info = info + "<em>"+type.name+"</em><br>";
                info = info + formatType(type);
                info = info + "</div>";
            });
        }else if(places && places.length == 1){
            info = formatType(places[0]);
        }

    return info;
}

function initButton() {
    var button = $("<button id='startgame'>START GAME</button>").addClass("btn btn-success btn-lg").attr("type","button");
    button.click(function() { // Note this is a function
        Actions.startGame(4, 'some game at ' + Date.now());
    });
    map.empty();
    map.append(button);
}

initButton();
MAP_STORE.addListener(mapChanged);


