
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
            var node = MAP_STORE.node(x, y);
            var places = node.places;

            var player = node.player;

            // add the color to the tile
            var color = "";
            var width = (100/MAP_STORE.size())+"%";
            if(player){
                color = PLAYERS_STORE.color(player.id);
                td.attr("style","background:"+color+";width:"+width+";");
            }else{
                td.attr("style","width:"+width+";");
            }

            // calculate slots and total gold
            var nbBuildings = 0;
            var nbPrestige = 0;
            var maxBuildings = 1;
            var maxPrestige = 1;
            var totalPrestigeGold = 0;
            var totalBuildingGold = 0;
            var totalVictory = 0;
            var prestigeType = null;
            var buildingType = null;
            if (places) {
                $.each(places, function(index,type){
                    maxBuildings += type.add_building;
                    maxPrestige += type.add_prestige;

                    if (type.category == 'B'){
                        nbBuildings++;
                        totalBuildingGold += type.add_gold + type.add_node_gold;
                        if(!buildingType) buildingType = type;
                    }
                    else if (type.category == 'P') {
                        nbPrestige++;
                        totalPrestigeGold += type.add_gold + type.add_node_gold;
                        if(!prestigeType) prestigeType = type;
                    }


                    totalVictory += type.add_points;
                });
            }

            var buildingNodeClasses = "node node-right";
            var prestigeNodeClasses = "node node-left";
            if (nbBuildings > 1) buildingNodeClasses += " multiple";
            if (nbPrestige > 1) prestigeNodeClasses += " multiple";
            if (!node.active) {
                prestigeNodeClasses += " greyout";
                buildingNodeClasses += " greyout";
            }
            var prestigeDiv = prestigeType ?
                '<div class="'+prestigeNodeClasses+'"><img src="'+window.staticUrl+'img/'+prestigeType.slug+'.jpg"></div>'
                : '<div class="'+prestigeNodeClasses+'"><img src="'+window.staticUrl+'img/blank.jpg"><p class="image-overlay">Prestige</p></div>';
            var buildingDiv = buildingType ?
                '<div class="'+buildingNodeClasses+'"><img src="'+window.staticUrl+'img/'+buildingType.slug+'.jpg"></div>'
                : '<div class="'+buildingNodeClasses+'"><img src="'+window.staticUrl+'img/blank.jpg"><p class="image-overlay">Buildings</p></div>';
            td.html(prestigeDiv + buildingDiv);
            tr.append(td);
            // add popover
            var title = (prestigeType || buildingType)?((places && places.length > 1) ?'Multiple cards':places[0].name):'Empty tile';
            td.attr("title",title);

            td.popover({
                toggle:"popover",
                trigger:"hover",
                container:"body",
                content:formatInfo(places),
                placement:"left",
                html:true
            });


            td.children(".node-right").append("<span class='bottom-right"+(nbBuildings == maxBuildings?" no-more":"")+"'>"+(maxBuildings-nbBuildings)+"/"+maxBuildings+"</span>");
            td.children(".node-left").append("<span class='bottom-left"+(nbPrestige == maxPrestige?" no-more":"")+"'>"+(maxPrestige-nbPrestige)+"/"+maxPrestige+"</span>");
            if (prestigeType) {
                if (totalPrestigeGold != 0) td.children(".node-left").append("<span class='up-right gold'>+"+totalPrestigeGold+"<i class='fa fa-money'></i></span>");
                if (totalVictory != 0) td.children(".node-left").append("<span class='up-left victory'>+"+totalVictory+"<i class='fa fa-shield'></i></span>");
            }
            if (buildingType) {
                if (totalBuildingGold != 0) td.children(".node-right").append("<span class='up-right gold'>+"+totalBuildingGold+"<i class='fa fa-money'></i></span>");
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
        + (type.add_building >0?"<span class='slot'>+"+type.add_building+"&nbspbuildings</span><br>":"")
        + (type.add_prestige >0?"<span class='slot'>+"+type.add_prestige+"&nbspprestige</span><br>":"")
        + (type.add_gold >0?"<span class='gold'>Player&nbsp+"+type.add_gold+"&nbsp<i class='fa fa-money'></i></span><br>":"")
        + (type.add_node_gold >0?"<span class='gold'>Node&nbsp+"+type.add_node_gold+"&nbsp<i class='fa fa-money'></i></span><br>":"")
        + (type.add_buy >0?"<span class='buy'>+"+type.add_buy+"&nbspBUY</span><br>":"")
        + (type.add_points >0?"<span class='victory'>+"+type.add_points+"&nbsp<i class='fa fa-shield'></i></span><br>":"");
    if (type.description) info += "<em>"+type.description+"</em>";
    info = info + "</strong>"
    return info;

}

function formatInfo(places){
   var info ="";
   var infoLeft = "";
   var infoRight = "";
   if (places && places.length > 1) {
        // on concatène l'affichage de chaque carte en rappelant la méthode avec un tableau de 1
        $.each(places, function(index,type) {
            if(type.category == "P"){
                infoLeft += "<div class='place-description'>";
                infoLeft += "<em>"+type.name+"</em><br>";
                infoLeft += formatType(type);
                infoLeft += "</div>";
            }else{
                infoRight += "<div class='place-description'>";
                infoRight += "<em>"+type.name+"</em><br>";
                infoRight += formatType(type);
                infoRight += "</div>";
            }
        });
        info = "<div class='col-xs-6'>"+infoLeft+"</div><div class='col-xs-6'>"+infoRight+"</div>";
    } else if (places && places.length == 1) {
        var type = places[0];
        info += type ? formatType(type) : "<em>This tile is free and does nothing.</em>";
    } else {
        info += "<em>This tile is free and does nothing.</em>";
    }

    return info;
}

MAP_STORE.addListener(mapChanged);


