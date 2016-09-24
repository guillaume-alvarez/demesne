/**
 * Creates and stores the map data.
 */
function MapStore () {
    Store.call(this);
    this._nodes = new Array(0);
    this._size = 0;
    this._name = null;
    this._reloadToken = null;
    this._gameId = null;
};
MapStore.prototype = Object.create(Store.prototype);
MapStore.prototype.constructor = MapStore;

MapStore.prototype.node = function (x, y) {
    return this._nodes[x][y];
};

MapStore.prototype.size = function () {
    return this._size;
};

MapStore.prototype.name = function () {
    return this._name;
};


MapStore.prototype._init = function (size, name) {
    this._name = name;
    this._size = size;
    this._nodes = new Array(size);
    for (var i = 0; i < size; i++) {
        this._nodes[i] = new Array(size);
    }
}

MapStore.prototype._autoReload = function () {
    if (this._reloadToken) clearInterval(this._reloadToken);
    if (this._gameId) {
        this._reloadToken = setInterval(function(){
            console.log('Ask to reload game '+MAP_STORE._gameId)
            Api.getData('games', MAP_STORE._gameId, Actions.ACTION_LOADED_GAME, {});
        }, 5000);
    }
}

MapStore.prototype.handle = function (event) {

    switch(event.actionType) {
        case Actions.ACTION_START_GAME:
            var size = event.playersNumber + 2;
            MAP_STORE._init(size);
            var data = {
                name: event.name,
                nb_players: event.playersNumber,
                map_height: size,
                map_width: size,
                multiplayer: event.multiplayer,
            }
            Api.createData('games', data, Actions.ACTION_GAME_CREATED, {});
            // then wait until answer to start the game, do not update the store now
            return true;

        case Actions.ACTION_GAME_CREATED:
            window.location.href = "/games/"+event.response.id;
            MAP_STORE._gameId = event.response.id;
            return true;

        case Actions.ACTION_LOADED_GAME:
            if (event.error) {
                console.log('Could not get GAME data: ' + event.error);
                return true;
            }
            var game = event.response;
            MAP_STORE._gameId = game.id;
            MAP_STORE._autoReload();
            MAP_STORE._init(game.map_height, game.name);
            for (var i = 0; i<game.node_set.length; i++) {
                var node = game.node_set[i];
                MAP_STORE._nodes[node.x][node.y] = node;
            }
            break;

        case Actions.ACTION_SELECT_TYPE:
            if (event.x !== undefined) {
                var node = MAP_STORE._nodes[event.x][event.y];
                var data = {type: event.selected, player: PLAYERS_STORE.active()};
                var params = {type: event.selected};
                Api.updateData('nodes', node.id + '/add_type', data, Actions.ACTION_LOADED_NODE, params);
            } else {
                // add gold or VP
                var data = {type: event.selected};
                var params = {type: event.selected};
                Api.updateData('players', PLAYERS_STORE.active() + '/add_type', data, Actions.ACTION_LOADED_PLAYER, params);
            }
            MAP_STORE._askedNode = null;
            return true;

        case Actions.ACTION_LOADED_NODE:
            if (event.error) {
                console.log('Could not update node: ' + JSON.stringify(event.error));
                return true;
            }
            var node = event.response;
            MAP_STORE._nodes[node.x][node.y] = node;
            // in case there is a special effect, other nodes may be updated
            if (TYPES_STORE.type(event.queryParams.type).special_effects) {
                Api.getData('games', MAP_STORE._gameId, Actions.ACTION_LOADED_GAME, {});
            }
            break;

        default:
            // ignore by default
            return true;
    }
    MAP_STORE.emitChange();
    return true;
};

var MAP_STORE = new MapStore();
AppDispatcher.register(MAP_STORE.handle);