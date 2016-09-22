/**
 * Creates and stores the player data.
 */
function PlayersStore () {
    Store.call(this);
    this._players = {};
    this._colors = {};
    this._active = null;
};
PlayersStore.prototype = Object.create(Store.prototype);
PlayersStore.prototype.constructor = PlayersStore;

PlayersStore.prototype.player = function (id) {
    return this._players[id];
};

PlayersStore.prototype.color = function (id) {
    return this._colors[id];
};

PlayersStore.prototype.darkColor = function (id) {
    var color = this._colors[id];
    if(color.length == 7 && color.substring(0,1) == "#"){
        var r = parseInt(color.substring(1,3),16);
        var g = parseInt(color.substring(3,5),16);
        var b = parseInt(color.substring(5,7),16);
        var rDark = Math.floor(r / 1.5);
        var gDark = Math.floor(g / 1.5);
        var bDark = Math.floor(b / 1.5);
        color = "#"+(rDark.toString(16).length == 1 ? "0"+rDark.toString(16):rDark.toString(16) )+
            (gDark.toString(16).length == 1 ? "0"+gDark.toString(16):gDark.toString(16) )+
            (bDark.toString(16).length == 1 ? "0"+bDark.toString(16):bDark.toString(16) );
    }
    return color;
};

PlayersStore.prototype.players = function () {
    return Object.keys(this._players).map(
        function(key){return PLAYERS_STORE._players[key];}
    );
};

PlayersStore.prototype.active = function () {
    return this._active;
};

PlayersStore.prototype.isActivePlayer = function () {
    var player = this._players[this._active];
    return player.user == null || player.user == USER.id;
};

PlayersStore.prototype._updatePlayer = function (player) {
    this._players[player.id] = player;
    if (player.active) {
        this._active = player.id;
        if (player.turn_buy <= 0) {
            Api.updateData('games', player.game + '/end_turn', {player: player.id}, Actions.ACTION_LOADED_GAME, {});
            return true;
        }
    }
    return false;
};

PlayersStore.prototype.handle = function (event) {

    switch(event.actionType) {
        case Actions.ACTION_LOADED_GAME:
            if (!event.response) {
                return true;
            }
            var players = event.response.player_set;
            PLAYERS_STORE._players = {};
            PLAYERS_STORE._colors = {};
            for (var i=0; i<players.length; i++) {
                var player = players[i];
                console.log('Loading player: '+JSON.stringify(player))
                PLAYERS_STORE._players[player.id] = player;
                PLAYERS_STORE._colors[player.id] = window.colors[i % window.colors.length];
                // at the moment have a default active player... should be managed on server side
                PLAYERS_STORE._active = event.response.current_player;
            }

            var winner = PLAYERS_STORE._players[event.response.winner];
            if (winner) {
                alert('Player '+winner.name+" has won the game with "+winner.points+" victory points!");
            }

            break;

        case Actions.ACTION_LOADED_NODE:
            if (event.error) return true;
            // we also receive the player state in the node
            if (PLAYERS_STORE._updatePlayer(event.response.player)) return true;
            break;

        case Actions.ACTION_LOADED_PLAYER:
            if (event.error) return true;
            if (PLAYERS_STORE._updatePlayer(event.response)) return true;
            break;

        case Actions.ACTION_END_TURN:
            // notify end of turn and ask to reload game
            Api.updateData('games', PLAYERS_STORE._players[event.player].game + '/end_turn', {player: event.player}, Actions.ACTION_LOADED_GAME, {});
            return true;

        default:
            // ignore by default
            return true;
    }
    PLAYERS_STORE.emitChange();
    return true;
};

var PLAYERS_STORE = new PlayersStore();
AppDispatcher.register(PLAYERS_STORE.handle);