var Actions = {
    ACTION_START_GAME: "ACTION_START_GAME",
    ACTION_LOADED_GAME: "ACTION_LOADED_GAME",
    ACTION_ASK_TYPES: "ACTION_ASK_TYPES",
    ACTION_LOADED_TYPES: "ACTION_LOADED_TYPES",

  /**
   * @param  {integer} playersNumber
   */
  startGame: function(playersNumber) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_START_GAME,
        playersNumber: playersNumber,
    });
  },

  /**
   */
  askType: function() {
    AppDispatcher.dispatch({
        actionType: this.ACTION_ASK_TYPES,
    });
  },

};