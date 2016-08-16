var Actions = {
    ACTION_START_GAME: "ACTION_START_GAME",
    ACTION_LOADED_GAME: "ACTION_LOADED_GAME",
    ACTION_ASK_TYPES: "ACTION_ASK_TYPES",
    ACTION_LOADED_TYPES: "ACTION_LOADED_TYPES",
    ACTION_SELECT_TYPE: "ACTION_SELECT_TYPE",
    ACTION_UPDATED_NODE: "ACTION_UPDATED_NODE",

  /**
   * @param  {integer} playersNumber number of players for the game
   * @param  {string} name game's unique name
   */
  startGame: function(playersNumber, name) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_START_GAME,
        playersNumber: playersNumber,
        name: name,
    });
  },

  /**
   * @param  {integer} x coordinate of the node player must choose a type for
   * @param  {integer} y coordinate of the node player must choose a type for
   */
  askType: function(x, y) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_ASK_TYPES,
        x: x,
        y: y,
    });
  },

  /**
   * @param  {integer} x coordinate of the node player must choose a type for
   * @param  {integer} y coordinate of the node player must choose a type for
   * @param  {object} selected type selected by user
   */
  selectType: function(x, y, selected) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_SELECT_TYPE,
        x: x,
        y: y,
        selected: selected,
    });
  },

};