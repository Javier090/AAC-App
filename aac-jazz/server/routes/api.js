const express = require('express');
const router = express.Router();
const deckController = require('../controllers/deckController');

// Route to get all decks
router.get('/decks', deckController.getAllDecks);

// Route to get cards for a specific deck
router.get('/decks/:id/cards', deckController.getCardsByDeckId);

module.exports = router;
