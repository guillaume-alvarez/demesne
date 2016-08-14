/**
 * Creates and stores the map data.
 */
function MapStore () {
    Store.call(this);
    this._nodes = new Array(0);
    this._size = 0;
};
MapStore.prototype = Object.create(Store.prototype);
MapStore.prototype.constructor = MapStore;

MapStore.prototype.node = function (x, y) {
    return this._nodes[x][y];
};

MapStore.prototype.size = function () {
    return this._size;
};

MapStore.prototype.handle = function (event) {
    switch(event.actionType) {
        case Actions.ACTION_START_GAME:
            MAP_STORE._size = event.playersNumber;
            MAP_STORE._nodes = new Array(MAP_STORE._size);
            for (var i = 0; i < MAP_STORE._size; i++) {
                MAP_STORE._nodes[i] = new Array(MAP_STORE._size);
            }
            break;
        default:
            return true;
    }
    MAP_STORE.emitChange();
    return true;
};

var MAP_STORE = new MapStore();
AppDispatcher.register(MAP_STORE.handle);