// Rock Paper Scissors game logic

// Things this file should export:
// object RESPONSE_CODES
// function getNewGame() -> game
// function handleGameAction(game, action) -> game, response
// function makeGameSnapshot(game, playerId) -> gameSnapshot
// (See /template_documentation/ROCK_PAPER_SCISSORS_DESIGN.md for details)


// ================================ CONSTANTS ===============================

const OPS = {
  JOIN: "join",
  SETUP: "setup", // args: (settings)
  READY: "ready",
  // QUIT: "quit", // QUIT and KICK don't need to be implemented yet
  // KICK: "kick", // args: (playerId)
  THROW: "throw", // args: (roundNumber, handSign)
  RESIGN: "resign",
};

const STATE_CODES = {
  AWAITING_HOST: "awaiting-host",
  AWAITING_GAME: "awaiting-game",
  PLAYING_GAME: "playing-game",
  CONCLUDED: "concluded",
};

const RESPONSE_CODES = {
  OK: "ok",
  INVALID: "invalid",
  UNKNOWN_TOKEN: "unknown-token",
};

const HAND_SIGNS = {
  NONE: "none", // i.e. pending
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
};


// =============================== VALIDATION ===============================

const validateRequestedOperation = (action) => {
  if (!Object.values(OPS).includes(action.op)) {
    throw new Error(`Operation <${action.op}> is undefined`);
  }
};

const validateProgressState = (game) => {
  if (!Object.values(STATE_CODES).includes(game.progressState.code)) {
    throw new Error(`State <${game.progressState.code}> is undefined`);
  }
};



// Utility functions

const findPlayerIndex = (game, playerId) => {
  if (game.players.length === 0) { return -1; }
  // Autodetect if `game.players` was populated
  if (game.players[0].username === undefined) {
    // Not populated
    return game.players.indexOf(playerId);
  } else {
    // Populated
    return game.players.map((player) => player.id).indexOf(playerId);
  }
};

const getNewGame = () => {
  // Refer to schema & docs for info on what this should return.
  const now = Date.now();
  const newGame = {
    progressState: STATE_CODES.AWAITING_HOST,
    title: "Rock Paper Scissors",
    createdAt: now,
    updatedAt: now,
    players: [],
    actionLog: [],
    hostId: null,
    settings: {
      gameLength: null,
    },
    isReady: null,
    currentRound: null,
    signsThrown: null,
    scores: null,
    concludedAt: null,
    conclusionType: null,
    playerResults: null,
  };
  return newGame;
};

// IMPORTANT: The `players` property of `game` passed to `makeGameSnapshot`
// will have been populated, so must use e.g. `game.players[0].id`
// instead of `game.players[0]`.
const makeGameSnapshot = (game, playerId) => {
  // Private information in this game:
  // - During the game, while in round X, you shouldn't be able to see
  //   any other player's choices for round X (previous rounds are OK to see).
  // - During the game, if you're not part of the game, you should only
  //   be able to see hand signs for round X after round X has finished.
  // - Because it's for development purposes, the actionLog is private to
  //   all players until the game has concluded. (This isn't final!)
  if (game.progressState === STATE_CODES.PLAYING_GAME) {
    const playerIndex = findPlayerIndex(game, playerId);
    if (playerIndex === -1) { // Player is spectator
      game.signsThrown[game.currentRound - 1] = [HAND_SIGNS.NONE, HAND_SIGNS.NONE];
    } else {
      if (playerIndex === 0) { // First player; redact second player's sign
        game.signsThrown[game.currentRound - 1][1] = HAND_SIGNS.NONE;
      } else if (playerIndex === 1) { // Second player; redact first player's sign
        game.signsThrown[game.currentRound - 1][0] = HAND_SIGNS.NONE;
      }
    }
  }
  if (game.progressState !== STATE_CODES.CONCLUDED) {
    game.actionLog = null;
  }
  return game;
};



// const handleGameAction = (game, action) => {
//   return { game: game, response: {code: RESPONSE_CODES.OK } };
// };

const handleGameAction = (game, action) => {
  try {
    validateProgressState(game);
    validateRequestedOperation(action);
  } catch (e) {
    return { game: game, response: {
      code: RESPONSE_CODES.UNKNOWN_TOKEN, error: e,
    }};
  }
  try {
    getStateManager(game.progressState)(game, action);
  } catch (e) {
    return { game: game, response: {
      code: RESPONSE_CODES.INVALID, error: e,
    }};
  }
  return { game: game, response: { code: RESPONSE_CODES.OK }};
};





module.exports = {
  RESPONSE_CODES,
  getNewGame,
  handleGameAction,
  makeGameSnapshot,
};
