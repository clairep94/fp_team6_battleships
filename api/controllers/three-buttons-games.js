const ThreeButtonsGame = require("../models/three-buttons-game");
const TokenGenerator = require("../lib/token_generator");

// Import game logic function
const handleGameAction = require("../lib/game-logic/three-buttons-game");

const ThreeButtonsGamesController = {
  Create: (req, res) => {
    const creatorId = req.user_id;
    const threeButtonsGame = new ThreeButtonsGame({
      progressState: {
        code: "waiting for players",
        playersJoinedCount: 0,
      },
      players: [null, null],
      queuedMessages: [],
    });
    threeButtonsGame.save((err) => {
      if (err) {
        throw err;
      }
      const token = TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: 'OK', game: threeButtonsGame, token: token });
    });
  },
  Index: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      } else {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(400).json({ message: 'Not implemented yet', token: token });
      }
    });
  },
  FindByID: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      } else {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(400).json({ message: 'Not implemented yet', token: token });
      }
    });
  },
  DoGameAction: (req, res) => {
    ThreeButtonsGame
    .find()
    .exec((err, games) => {
      if (err) {
        throw err;
      } else {
        const token = TokenGenerator.jsonwebtoken(req.user_id);
        res.status(400).json({ message: 'Not implemented yet', token: token });
      }
    });
  },

};

module.exports = ThreeButtonsGamesController;
