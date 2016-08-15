var Actions = {
    ACTION_START_GAME: "ACTION_START_GAME",
    ACTION_GET_GAME: "ACTION_GET_GAME",

  /**
   * @param  {integer} playersNumber
   */
  startGame: function(playersNumber) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_START_GAME,
        playersNumber: playersNumber,
    });
  },

};