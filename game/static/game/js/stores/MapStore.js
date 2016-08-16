/**
 * Creates and stores the map data.
 */
function MapStore () {
    Store.call(this);
    this._nodes = new Array(0);
    this._size = 0;
    this._name = null;
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


MapStore.prototype.handle = function (event) {

    switch(event.actionType) {
        case Actions.ACTION_START_GAME:
            var size = event.playersNumber * 2;
            MAP_STORE._init(size);
            var data = {
                name: event.name,
                nb_players: event.playersNumber,
                map_height: size,
                map_width: size,
            }
            Api.postData('games', data, Actions.ACTION_LOADED_GAME, {});
            // then wait until answer to start the game, do not update the store now
            return true;

        case Actions.ACTION_LOADED_GAME:
            if (event.error) {
                console.log('Could not get GAME data: ' + event.error);
                return true;
            }
            MAP_STORE._init(event.response.map_height, event.response.name);
            break;

        default:
            return true;
    }
    MAP_STORE.emitChange();
    return true;
};

var MAP_STORE = new MapStore();
AppDispatcher.register(MAP_STORE.handle);