var Actions = {
    ACTION_START_GAME: "ACTION_START_GAME",
    ACTION_LOADED_GAME: "ACTION_LOADED_GAME",
    ACTION_ASK_TYPES: "ACTION_ASK_TYPES",
    ACTION_LOADED_TYPES: "ACTION_LOADED_TYPES",

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
   */
  askType: function() {
    AppDispatcher.dispatch({
        actionType: this.ACTION_ASK_TYPES,
    });
  },

  /**
   * @param  {type} type selected type
   */
  selectType: function(type) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_ASK_TYPES,
    });
  },

};