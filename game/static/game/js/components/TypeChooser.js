/**
 * Activate a modal dialog to choose a type.
 */

function typeChanged(event) {
    var asked = TYPES_STORE.asked();
    if (!asked) {
        $('#modal-box').modal('hide');
        return false;
    }

    function onclick(type) {
        return function() {
            console.log('Selected type %s for node at (%d, %d)', type.slug, asked.x, asked.y);
            Actions.selectType(asked.x, asked.y, type.slug);
        };
    }

    // suivant si on cherche a poser une carte sur un noeud ou pas
    // les cartes ne sont pas les mêmes
    // suppression des cartes avec need_slot = false si asked pointe sur quelque chose
    // sinon l'inverse
    var types = TYPES_STORE.typesArray()
    .filter(function (value) {
        return (asked.x === undefined && asked.y === undefined) != value.need_slot;
    }).sort(function (t1, t2) {
        return t1.cost - t2.cost;
    });

    var table = $('<table class="table table-bordered" >');
    var trBuildings = $.inArray('B', asked.categories) >= 0 ? $("<tr>") : $('<tr class="greyout">');
    var trPrestige = $.inArray('P', asked.categories) >= 0 ? $("<tr>") : $('<tr class="greyout">');
    for (var i = 0; i < types.length; i++) {
        var td = $('<td>');
        var type = types[i];
        var remaining = TYPES_STORE.remaining(type.slug);
        var text = '<div class="type"><img src="'+window.staticUrl+'img/'+type.slug+'.jpg"></div>';
        var cost = "<span class='gold'>"+type.cost+"&nbsp;<i class='fa fa-money'></i></span>";

        // add popover
        td.attr("title",type.name +'&nbsp;<strong>'+cost+'</strong> '+remaining+'/'+type.start_number);
        td.popover({
            toggle:"popover",
            trigger:"hover",
            container:"body",
            content:formatType(type), // function from MapBox
            placement:"bottom",
            html:true
        });
        if (remaining > 0
            && PLAYERS_STORE.isActivePlayer()
            && type.cost <= PLAYERS_STORE.getActivePlayer().turn_gold + MAP_STORE.node(asked.x, asked.y).turn_gold) {
            td.html(text + "<p>"+cost+' '+remaining+'/'+type.start_number+"</p>");
            td.click(onclick(type));
        } else {
            td.html('<div class="greyout">'+text+'<p>'+cost+' '+remaining+'/'+type.start_number+'</p></div>');
        }

        if (type.category == 'P')
            trPrestige.append(td);
        else if (type.category == 'B')
            trBuildings.append(td);
    }
    var width = Math.max(trBuildings.children().length, trPrestige.children().length);
    table.append($('<tr><td colspan="'+width+'"><strong>Buildings</strong></td></tr>'));
    table.append(trBuildings);
    table.append($('<tr><td colspan="'+width+'"><strong>Prestige</strong></td></tr>'));
    table.append(trPrestige);

    $("#modal-body").empty().append(table);
    $("#modal-title").text('Which type do you want to use?');

    // can let user choose
    $('#modal-box').modal('show');
}

TYPES_STORE.addListener(typeChanged);