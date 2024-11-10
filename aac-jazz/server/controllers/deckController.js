const db = require('../db/config');
const NodeCache = require('node-cache');

// Initializes cache with a standard time to live of 1 hour 
const cache = new NodeCache({ stdTTL: 3600 });

// Fetches all decks
exports.getAllDecks = async (req, res) => {
  const cacheKey = 'allDecks';

  try {
    // Checks if the decks are in cache
    const cachedDecks = cache.get(cacheKey);
    if (cachedDecks) {
      console.log('Serving decks from cache');
      return res.json(cachedDecks);
    }

    // Fetches the decks from the database
    const [rows] = await db.query('SELECT * FROM decks');

    // Stores the decks in cache
    cache.set(cacheKey, rows);

    console.log('Serving decks from database and caching result');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching decks:', err);
    res.status(500).json({ error: 'An error occurred while fetching decks.' });
  }
};

// Fetches the cards for a specific deck with caching
exports.getCardsByDeckId = async (req, res) => {
  const deckId = req.params.id;
  const cacheKey = `deck_${deckId}`;

  try {
    // Checks if the cards for this deck are in cache
    const cachedCards = cache.get(cacheKey);
    if (cachedCards) {
      console.log(`Serving cards for deck ${deckId} from cache`);
      return res.json(cachedCards);
    }

    // Fetches the cards from the database
    const [rows] = await db.query('SELECT * FROM cards WHERE deck_id = ?', [deckId]);

    // Store cards in cache
    cache.set(cacheKey, rows);

    console.log(`Serving cards for deck ${deckId} from database and caching result`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'An error occurred while fetching cards.' });
  }
};

// Adds a new card to a deck and clears cache for that specific deck
exports.addCardToDeck = async (req, res) => {
  const deckId = req.params.id;
  const { text, image_url } = req.body;

  try {
    // Inserts the new card into the database
    await db.query('INSERT INTO cards (deck_id, text, image_url) VALUES (?, ?, ?)', [
      deckId,
      text,
      image_url,
    ]);

    // Clears the cache for this deck
    const cacheKey = `deck_${deckId}`;
    cache.del(cacheKey);

    console.log(`Added new card to deck ${deckId} and cleared cache`);
    res.status(201).json({ message: 'Card added successfully.' });
  } catch (err) {
    console.error('Error adding card:', err);
    res.status(500).json({ error: 'An error occurred while adding the card.' });
  }
};

// Updates a card and clear cache for that deck
exports.updateCard = async (req, res) => {
  const deckId = req.params.id;
  const cardId = req.params.cardId;
  const { text, image_url } = req.body;

  try {
    // Updates the card in the database
    await db.query(
      'UPDATE cards SET text = ?, image_url = ? WHERE id = ? AND deck_id = ?',
      [text, image_url, cardId, deckId]
    );

    // Clears the cache for this deck
    const cacheKey = `deck_${deckId}`;
    cache.del(cacheKey);

    console.log(`Updated card ${cardId} in deck ${deckId} and cleared cache`);
    res.json({ message: 'Card updated successfully.' });
  } catch (err) {
    console.error('Error updating card:', err);
    res.status(500).json({ error: 'An error occurred while updating the card.' });
  }
};

// Deletes a card from a deck and clear cache for that deck
exports.deleteCardFromDeck = async (req, res) => {
  const deckId = req.params.id;
  const cardId = req.params.cardId;

  try {
    // Deletes the card from the database
    await db.query('DELETE FROM cards WHERE id = ? AND deck_id = ?', [cardId, deckId]);

    // Clears the cache for this specific deck
    const cacheKey = `deck_${deckId}`;
    cache.del(cacheKey);

    console.log(`Deleted card ${cardId} from deck ${deckId} and cleared cache`);
    res.json({ message: 'Card deleted successfully.' });
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).json({ error: 'An error occurred while deleting the card.' });
  }
};

// Clears the cache for all decks
exports.clearAllCache = (req, res) => {
  cache.flushAll();
  console.log('Cleared all caches');
  res.json({ message: 'All caches cleared.' });
};
