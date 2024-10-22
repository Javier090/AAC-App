import React from 'react';
import './CardDeck.css';

const CardDeck = ({ currentDeck, onCardSelect, onDeckChange, isMobileView }) => {
  const decks = ['nouns', 'verbs', 'adjectives', 'grammar'];

  return (
    <div className="mb-6">
      <div className="mb-4">
        {isMobileView ? (
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => onDeckChange(e.target.value)}
          >
            {decks.map(deck => (
              <option key={deck} value={deck}>
                {deck.charAt(0).toUpperCase() + deck.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex space-x-2">
            {decks.map(deck => (
              <button
                key={deck}
                onClick={() => onDeckChange(deck)}
                className="px-4 py-2 bg-white rounded shadow hover:bg-gray-100"
              >
                {deck.charAt(0).toUpperCase() + deck.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`card-deck ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {currentDeck.map(card => (
            <button
            key={card.id}
            onClick={() => onCardSelect(card)}
            className="card"
            >
            <img src={card.image} alt={card.text} className="card-img" />
            <p>{card.text}</p>
            </button>
        ))}
        </div>
    </div>
  );
};

export default CardDeck;