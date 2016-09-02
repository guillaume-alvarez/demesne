var Actions = {
    ACTION_START_GAME: "ACTION_START_GAME",
    ACTION_LOADED_GAME: "ACTION_LOADED_GAME",
    ACTION_ASK_TYPES: "ACTION_ASK_TYPES",
    ACTION_SELECT_TYPE: "ACTION_SELECT_TYPE",
    ACTION_LOADED_NODE: "ACTION_LOADED_NODE",
    ACTION_LOADED_PLAYER: "ACTION_LOADED_PLAYER",
    ACTION_END_TURN: "ACTION_END_TURN",
    ACTION_GAME_CREATED: "ACTION_GAME_CREATED",

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
   * @param  {string array} categories list the types categories expected here
   */
  askType: function(x, y, categories) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_ASK_TYPES,
        x: x,
        y: y,
        categories: categories,
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

  /**
   * @param  {integer} player the player that requested to end its turn
   */
  endTurn: function(player) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_END_TURN,
        player: player,
    });
  },

};