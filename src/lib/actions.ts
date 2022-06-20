export const requestActions = {
  getTableList: "GET_TABLE_LIST",
  createTable: "CREATE_TABLE",
  joinTable: "JOIN_TABLE",
  leaveTable: "LEAVE_TABLE",
  updateWord: "UPDATE_WORD",
  confirmWord: "CONFIRM_WORD",
  startGame: "START_GAME",
  ping: "PING",
  deleteTable: "DELETE_TABLE",
  getMyTable: "GET_MY_TABLE",
} as const;

export const replyActions = {
  playerJoined: "PLAYER_JOINED",
  playerLeft: "PLAYER_LEFT",
  gameStarted: "GAME_STARTED",
  wordUpdated: "WORD_UPDATED",
  wordAccepted: "WORD_ACCEPTED",
  wordRejected: "WORD_REJECTED",
  timeHasRunOut: "TIME_HAS_RUN_OUT",
  lifeEarned: "LIFE_EARNED",
  tableDeleted: "TABLE_DELETED",
} as const;

export const instantReplyActions = {
  tableList: "TABLE_LIST",
  createTableSuccess: "CREATE_TABLE_SUCCESS",
  createTableFailure: "CREATE_TABLE_FAILURE",
  joinTableSuccess: "JOIN_TABLE_SUCCESS",
  joinTableFailure: "JOIN_TABLE_FAILURE",
  pong: "PONG",
  myTable: "MY_TABLE",
  noMyTable: "NO_MY_TABLE",
};
