/**
 * Creates and stores the map data.
 */
function PlayersStore () {
    Store.call(this);
    this._players = {};
    this._active = null;
};
PlayersStore.prototype = Object.create(Store.prototype);
PlayersStore.prototype.constructor = PlayersStore;

PlayersStore.prototype.player = function (id) {
    return this._players[id];
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
            for (var i=0; i<players.length; i++) {
                var player = players[i];
                console.log('Loading player: '+JSON.stringify(player))
                PLAYERS_STORE._players[player.id] = player;
                // at the moment have a default active player... should be managed on server side
                if (!PLAYERS_STORE._active) PLAYERS_STORE._active = player.id;
            }
            break;

        default:
            // ignore by default
            return true;
    }
    PLAYERS_STORE.emitChange();
    return true;
};

var PLAYERS_STORE = new PlayersStore();
AppDispatcher.register(PLAYERS_STORE.handle);