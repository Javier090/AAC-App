import React from 'react';
import './CardDeck.css';
import { cardSound } from './CardSound.js'; // Import the cardSound service

const CardDeck = ({ currentDeck, decks, onCardSelect, onDeckChange, isMobileView }) => {

  const handleCardClick = (card) => {
    onCardSelect(card);
    cardSound.speak(card.text); // Speak the card's text
  };

  return (
    <div className="mb-6">
      <div className="mb-4">
        {isMobileView ? (
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => onDeckChange(e.target.value)}
          >
            {decks.map(deck => (
              <option key={deck.id} value={deck.id}>
                {deck.name.charAt(0).toUpperCase() + deck.name.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex space-x-2">
            {decks.map(deck => (
              <button
                key={deck.id}
                onClick={() => onDeckChange(deck.id)}
                className="px-4 py-2 bg-white rounded shadow hover:bg-gray-100"
              >
                {deck.name.charAt(0).toUpperCase() + deck.name.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`card-deck ${isMobileView ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {currentDeck.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)} // Uses the new handleCardClick function
            className="card"
          >
            <img src={card.image_url} alt={card.text} className="card-img" />
            <p>{card.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardDeck;