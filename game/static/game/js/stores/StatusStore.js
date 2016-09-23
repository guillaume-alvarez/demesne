/**
 * Creates and stores the current game status.
 */
function StatusStore () {
    Store.call(this);
    this._text = 'In progress';
    this._errors = null;
};
StatusStore.prototype = Object.create(Store.prototype);
StatusStore.prototype.constructor = StatusStore;

StatusStore.prototype.text = function () {
    return this._text;
};

StatusStore.prototype.errors = function () {
    return this._errors;
};

StatusStore.prototype.checkError = function (event, text) {
    var now = new Date();
    this._text = "["+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+"] : "+text;
    if (event.error) {
        if($.type(event.error) === "string")
            this._errors = [event.error];
        else {
            function get(field) { return this[field]; }
            this._errors = ['rule', 'error', 'text', 'reason', 'msg', 'message', 'status']
                            .filter(get, event.error).map(get, event.error);
        }
    } else {
        this._errors = null;
    }
};

StatusStore.prototype.handle = function (event) {

    switch(event.actionType) {
		case Actions.ACTION_START_GAME:
		    STATUS_STORE.checkError(event, 'Starting game...');
			break;

		case Actions.ACTION_LOADED_GAME:
		    if(!window.loadedGame){
                STATUS_STORE.checkError(event, 'Loaded game.');
                window.loadedGame = true;
		    }else{
		        return true;
		    }
			break;

		case Actions.ACTION_ASK_TYPES:
		    STATUS_STORE.checkError(event, 'Loading types for selection.');
			break;

		case Actions.ACTION_SELECT_TYPE:
		    STATUS_STORE.checkError(event, 'Selected type.');
			break;

		case Actions.ACTION_LOADED_NODE:
		    STATUS_STORE.checkError(event, 'Node updated.');
			break;

		case Actions.ACTION_END_TURN:
            STATUS_STORE.checkError(event, 'End player turn.');
			break;

        default:
            // when it happens new status should be added
		    STATUS_STORE.checkError(event, event.actionType);
			break;
    }
    console.log(STATUS_STORE._text);
    if (STATUS_STORE._error) console.log(STATUS_STORE._error);
    STATUS_STORE.emitChange();
    return true;
};

var STATUS_STORE = new StatusStore();
AppDispatcher.register(STATUS_STORE.handle);
