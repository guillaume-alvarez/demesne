/**
 * Creates and stores the different places types.
 */
function TypesStore () {
    Store.call(this);
    this._types = {};
    this._remaining = {};
    this._askedNode = null;
};
TypesStore.prototype = Object.create(Store.prototype);
TypesStore.prototype.constructor = TypesStore;

TypesStore.prototype.asked = function () {
    return this._askedNode;
};

TypesStore.prototype.names = function () {
    return Object.keys(this._types);
};

TypesStore.prototype.remaining = function (name) {
    var nb = this._remaining[name];
    return (typeof nb == 'number') ? nb : 0;
};

TypesStore.prototype.typesArray = function () {
    return $.map(this._types,function(value,index){
        return value;
    });
};

TypesStore.prototype.type = function (name) {
    return this._types[name];
};

TypesStore.prototype.handle = function (event) {
    switch(event.actionType) {
        case Actions.ACTION_LOADED_GAME:
            TYPES_STORE._askedNode = null;
            TYPES_STORE._types = {};
            TYPES_STORE._remaining = {};
            for (i = 0; i<event.response.decks.length; i++) {
                var deck = event.response.decks[i];
                TYPES_STORE._remaining[deck.type.slug] = deck.nb;
                TYPES_STORE._types[deck.type.slug] = deck.type;
            }
            return true;

        case Actions.ACTION_ASK_TYPES:
            // user need the list of types, make sure it is up-to-date
            TYPES_STORE._askedNode = {x:event.x, y:event.y, categories:event.categories};
            break;

        case Actions.ACTION_SELECT_TYPE:
            TYPES_STORE._askedNode = null;
            TYPES_STORE._remaining[event.selected]--;
            break;

        default:
            // ignore by default
            return true;
    }
    TYPES_STORE.emitChange();
    return true;
};

var TYPES_STORE = new TypesStore();
AppDispatcher.register(TYPES_STORE.handle);