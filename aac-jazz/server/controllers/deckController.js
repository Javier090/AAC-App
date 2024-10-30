const db = require('../db/config');

// Fetch all decks
exports.getAllDecks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM decks'); // SELECT all decks from the database
    res.json(rows);
  } catch (err) {
    console.error('Error fetching decks:', err);
    res.status(500).json({ error: 'An error occurred while fetching decks.' });
  }
};

// Fetch cards for a specific deck
exports.getCardsByDeckId = async (req, res) => {
  const deckId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM cards WHERE deck_id = ?', [deckId]); // Check if the deck exists, and query's id from the database
    res.json(rows);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'An error occurred while fetching cards.' });
  }
};
