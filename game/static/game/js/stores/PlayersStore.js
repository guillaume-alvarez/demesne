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

PlayersStore.prototype.players = function () {
    return Object.keys(this._players).map(
        function(key){return PLAYERS_STORE._players[key];}
    );
};

PlayersStore.prototype.active = function () {
    return this._active;
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
            break;

        case Actions.ACTION_LOADED_NODE:
            // we also receive the player state in the node
            var player = event.response.player;
            PLAYERS_STORE._players[player.id] = player;
            if (player.active) PLAYERS_STORE._active = player.id;
            break;

        case Actions.ACTION_LOADED_PLAYER:
            var player = event.response;
            PLAYERS_STORE._players[player.id] = player;
            if (player.active) PLAYERS_STORE._active = player.id;
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