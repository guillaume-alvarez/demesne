/**
 * Creates and stores the different places types.
 */
function TypesStore () {
    Store.call(this);
    this._types = {};
    this._asked = false;
};
TypesStore.prototype = Object.create(Store.prototype);
TypesStore.prototype.constructor = TypesStore;

TypesStore.prototype.asked = function () {
    return this._asked;
};

TypesStore.prototype.names = function () {
    return Object.keys(this._types);
};

TypesStore.prototype.type = function (name) {
    return this._types[name];
};

TypesStore.prototype.handle = function (event) {
    switch(event.actionType) {
        case Actions.ACTION_START_GAME:
            TYPES_STORE._asked = false;
            TYPES_STORE._types = {};
            // always try to load at game start
            Api.getData('types', null, Actions.ACTION_LOADED_TYPES, {});
            return true;

        case Actions.ACTION_LOADED_TYPES:
            for (i = 0; i<event.response.length; i++) {
                var type = event.response[i];
                console.log('Received type ' + JSON.stringify(type));
                TYPES_STORE._types[type.slug] = type;
            }
            break;

        case Actions.ACTION_ASK_TYPES:
            // user need the list of types, make sure it is up-to-date
            TYPES_STORE._asked = true;
            if (jQuery.isEmptyObject(TYPES_STORE._types)) {
                // loop once found
                Api.getData('types', null, Actions.ACTION_LOADED_TYPES, {});
                return true;
            } // else we have data: emit change
            break;

        default:
            return true;
    }
    TYPES_STORE.emitChange();
    return true;
};

var TYPES_STORE = new TypesStore();
AppDispatcher.register(TYPES_STORE.handle);