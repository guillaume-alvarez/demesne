var Actions = {
    ACTION_START_GAME: "ACTION_START_GAME",
    ACTION_SELECT_PLACE: "ACTION_SELECT_PLACE",
    ACTION_GET_PLACE: "ACTION_GET_PLACE",

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
   * @param  {string} id
   */
  selectPlace: function(id) {
    AppDispatcher.dispatch({
        actionType: this.ACTION_SELECT_PLACE,
        id: id,
    });
  },

};