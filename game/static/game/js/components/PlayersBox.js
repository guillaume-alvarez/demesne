
var players_dom = $('#players');

function playersChanged(event) {
    var players = PLAYERS_STORE.players();
    var active = PLAYERS_STORE.active();
    var activePlayer = getActivePlayer(active,players);
    var waitingTime = 10;
    var newPlayer = undefined;
    if(window.lastActive === undefined){
        window.lastActive = active;
        newPlayer = active;
    }else if(window.lastActive != active){
        window.lastActive = active;
        newPlayer = active;
        $("#endturn").hide();
        // change of active player
        // animate the divs
        var firstHeight = $("div[data-order='0']").height()+20;
        $("div[data-order='0']").removeClass("panel-info").addClass("panel-default");
        $("div[data-order='1']").removeClass("panel-default").addClass("panel-info");
        var totalHeight = 0;
        // move all up except first one
        $(".player-panel").each(function(){
            if($(this).data("order") != "0"){
                $(this).animate({
                    top: "-="+firstHeight+"px",
                  }, 600 );
                  totalHeight += $(this).height()+20;
            }
        });
        // move the first at then end
        $("div[data-order='0']").animate({
            top: "+="+totalHeight+"px",
          }, 600 );
        waitingTime = 1000;
    }
    setTimeout(function(){
        updatePlayersDom(players,active);
    },waitingTime);


    if(newPlayer && activePlayer.user == USER.id){
        // display modal to say whose turn it is
        displayYourTurnModal(activePlayer.name, active);
    }
}

function getActivePlayer(activeId,players){
    for(var i = 0;i<players.length;i++){
        if(players[i].id == activeId){
            return players[i];
        }
    }
}

function displayYourTurnModal(name,playerId){
    $("#yourTurnModalBody").html("<h1 class='modal-content' style='color:"+PLAYERS_STORE.darkColor(playerId)+"'>"+name+"'s turn !</h1>");
    $("#yourTurnModal").modal("show");
}

function updatePlayersDom(players,active){
    players_dom.empty();
    for (var i=0; i<players.length; i++) {
        var player = players[i];
        var order = (player.id - active + players.length)%players.length;
        var html =
             '<div class="player-panel panel '+(active==player.id ? 'panel-info':'panel-default')+'" data-order="'+order+'" data-player="'+player.id+'">'
            +  '<div class="panel-heading">'
            +    '<h3 class="panel-title" style="color:'+PLAYERS_STORE.darkColor(player.id)+'">'+player.name+'</h3>'
            +  '</div>'
            +    '<ul class="list-group">'
            +      '<li class="list-group-item gold">Gold: '+player.turn_gold+'/'+player.gold+' <i class="fa fa-money"></i></li>'
            +      '<li class="list-group-item victory">Victory points: '+player.points+'</li>'
            +      '<li class="list-group-item">Can buy '+player.turn_buy+' items this turn.</li>';
        if (active==player.id) {
            html += '<li class="list-group-item">';
            if (PLAYERS_STORE.isActivePlayer())
                 html += '<button class="btn btn-success" id="endturn" type="button" onclick="Actions.endTurn('+active+')">END TURN</button>';
            else
                 html += '<button class="btn btn-success disabled" id="endturn" type="button">END TURN</button>';
            html += '</li>';
        }
        html += '</ul>'
             +'</div>';
        var panel = $(html);
        panel.css("top","0");
        players_dom.append(panel);
    }
    // change order
    for (var i=0; i<players.length-1; i++) {
        $("div[data-order='"+(i+1)+"']").insertAfter("div[data-order='"+(i)+"']")
    }

}

PLAYERS_STORE.addListener(playersChanged);


