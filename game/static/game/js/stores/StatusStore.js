/**
 * Creates and stores the current game status.
 */
function StatusStore () {
    Store.call(this);
    this._text = 'In progress';
};
StatusStore.prototype = Object.create(Store.prototype);
StatusStore.prototype.constructor = StatusStore;

StatusStore.prototype.text = function () {
    return this._text;
};


StatusStore.prototype.handle = function (event) {

    switch(event.actionType) {
		case Actions.ACTION_START_GAME:
		    STATUS_STORE._text = 'Starting game...';
			break;

		case Actions.ACTION_LOADED_GAME:
		    STATUS_STORE._text = 'Loaded game.';
			break;

		case Actions.ACTION_ASK_TYPES:
		    STATUS_STORE._text = 'Loading types for selection.';
			break;

		case Actions.ACTION_LOADED_TYPES:
		    STATUS_STORE._text = 'Loaded types, can select one.';
			break;

		case Actions.ACTION_SELECT_TYPE:
		    STATUS_STORE._text = 'Selected type.';
			break;

		case Actions.ACTION_UPDATED_NODE:
		    STATUS_STORE._text = 'Node updated.';
			break;

        default:
            // when it happens new status should be added
		    STATUS_STORE._text = event.actionType;
			break;
    }
    console.log(STATUS_STORE._text);
    STATUS_STORE.emitChange();
    return true;
};

var STATUS_STORE = new StatusStore();
AppDispatcher.register(STATUS_STORE.handle);