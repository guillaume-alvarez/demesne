
var map = $("#map");

function mapChanged(event) {
    // update name
    $("#gameName").text(MAP_STORE.name());

    function onclick(x, y, categories) {
        return function() {
            console.log('Ask type to set for node at (%d, %d): %s', x, y, categories);
            Actions.askType(x, y, categories);
        };
    }

    var table = $('<table class ="table table-bordered" >');
    for (var x = 0; x < MAP_STORE.size(); x++){
        var tr = $("<tr>");
        for (var y = 0; y < MAP_STORE.size(); y++){
            var td = $('<td>');
            var places = MAP_STORE.node(x, y).places;
            var node = places ? places[0] : null;
            var player = MAP_STORE.node(x,y).player;

            var nodeClasses = "node "+((places && places.length > 1)?"multiple":"");
            // add the color to the tile
            var color = "";
            if(player){
                color = PLAYERS_STORE.color(player.id);
                td.attr("style","background:"+color+";");
            }

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

            // calculate slots and total gold
            var nbBuildings = 0;
            var nbPrestige = 0;
            var maxBuildings = 1;
            var maxPrestige = 1;
            var totalGold = 0;
            if(places){
                $.each(places,function(index,type){
                    maxBuildings += type.add_building;
                    maxPrestige += type.add_prestige;

                    if (type.category == 'B') nbBuildings++;
                    else if (type.category == 'P') nbPrestige++;

                    totalGold = totalGold + type.add_gold;
                });
            }
            td.children(".node").append("<span class='bottom-right"+(nbBuildings == maxBuildings?" no-more":"")+"'>"+(maxBuildings-nbBuildings)+"/"+maxBuildings+"</span>");
            td.children(".node").append("<span class='bottom-left"+(nbPrestige == maxPrestige?" no-more":"")+"'>"+(maxPrestige-nbPrestige)+"/"+maxPrestige+"</span>");
            if(node){
                td.children(".node").append("<span class='up-right gold'>+"+totalGold+"<i class='fa fa-money'></i></span>");
            }

            // let select a type for free nodes
            var categories = [];
            if (nbBuildings < maxBuildings) categories.push('B');
            if (nbPrestige < maxPrestige) categories.push('P');
            if (categories.length > 0 && (!player || player.id == PLAYERS_STORE.active())) {
                td.click(onclick(x, y, categories));
            }
        }
        table.append(tr);
    }

    map.empty();
    map.append(table);
}

function formatType(type) {
    var info = "<strong>"
        + (type.add_building >0?"<span class='slot'>+"+type.add_building+" buildings</span><br>":"")
        + (type.add_prestige >0?"<span class='slot'>+"+type.add_prestige+" prestige</span><br>":"")
        + (type.add_gold >0?"<span class='gold'>+"+type.add_gold+" <i class='fa fa-money'></i></span><br>":"")
        + (type.add_buy >0?"<span class='buy'>+"+type.add_buy+" BUY</span><br>":"")
        + (type.add_points >0?"<span class='victory'>+"+type.add_points+" POINTS</span><br>":"");
    if (type.description) info += "<em>"+type.description+"</em>";
    info = info + "</strong>"
    return info;

}

function formatInfo(places){
   var info ="";
   if (places && places.length > 1) {
        // on concatène l'affichage de chaque carte en rappelant la méthode avec un tableau de 1
        $.each(places, function(index,type) {
            info += "<div class='place-description'>";
            info += "<em>"+type.name+"</em><br>";
            info += formatType(type);
            info += "</div>";
        });
    } else if (places && places.length == 1) {
        var type = places[0];
        info += type ? formatType(type) : "<em>This tile is free and does nothing.</em>";
    } else {
        info += "<em>This tile is free and does nothing.</em>";
    }

    return info;
}

MAP_STORE.addListener(mapChanged);


