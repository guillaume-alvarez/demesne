
var players_dom = $('#players');

function playersChanged(event) {
    var players = PLAYERS_STORE.players();
    var active = PLAYERS_STORE.active();

    players_dom.empty();
    for (var i=0; i<players.length; i++) {
        var player = players[i];
        var html =
             '<div class="panel '+(active==player.id ? 'panel-info':'panel-default')+'">'
            +  '<div class="panel-heading">'
            +    '<h3 class="panel-title">'+player.name+'</h3>'
            +  '</div>'
            +    '<ul class="list-group">'
            +      '<li class="list-group-item gold">Gold: '+player.gold+' <i class="fa fa-money"></i></li>'
            +      '<li class="list-group-item victory">Victory points: '+player.points+'</li>';
        if (active==player.id) {
            html += '<li class="list-group-item">'
                 +    '<button class="btn btn-success" id="endturn" type="button" onclick="Actions.endTurn('+active+')">END TURN</button>'
                 +  '</li>';
        }
        html += '</ul>'
             +'</div>';
        var panel = $(html);
        players_dom.append(panel);
    }

}

PLAYERS_STORE.addListener(playersChanged);


