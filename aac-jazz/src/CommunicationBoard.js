import React, { useState } from 'react';
import CardDeck from './CardDeck';
import SentenceBuilder from './SentenceBuilder';
import SettingsPanel from './SettingsPanel';
import './CommunicationBoard.css';

const CommunicationBoard = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentDeck, setCurrentDeck] = useState('nouns');
  const [isMobileView, setIsMobileView] = useState(false);

  const decks = {
    nouns: [
      { id: 1, text: 'I', image: '/api/placeholder/120/120' },
      { id: 2, text: 'water', image: '/api/placeholder/120/120' },
      { id: 3, text: 'food', image: '/api/placeholder/120/120' },
      { id: 4, text: 'bathroom', image: '/api/placeholder/120/120' },
    ],
    verbs: [
      { id: 5, text: 'want', image: '/api/placeholder/120/120' },
      { id: 6, text: 'need', image: '/api/placeholder/120/120' },
      { id: 7, text: 'like', image: '/api/placeholder/120/120' },
      { id: 8, text: 'go', image: '/api/placeholder/120/120' },
    ],
    adjectives: [
      { id: 9, text: 'hot', image: '/api/placeholder/120/120' },
      { id: 10, text: 'cold', image: '/api/placeholder/120/120' },
      { id: 11, text: 'happy', image: '/api/placeholder/120/120' },
      { id: 12, text: 'sad', image: '/api/placeholder/120/120' },
    ],
    grammar: [
      { id: 13, text: 'to', image: '/api/placeholder/120/120' },
      { id: 14, text: 'the', image: '/api/placeholder/120/120' },
      { id: 15, text: 'please', image: '/api/placeholder/120/120' },
      { id: 16, text: 'thank you', image: '/api/placeholder/120/120' },
    ]
  };

  const handleCardSelect = (card) => {
    setSelectedCards([...selectedCards, card]);
  };

  const handleCardRemove = (cardId) => {
    setSelectedCards(selectedCards.filter(card => card.id !== cardId));
  };

  const handleDeckChange = (deck) => {
    setCurrentDeck(deck);
  };

  const onClearAll = () => {
    setSelectedCards([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center relative">
        <h1 className="text-2xl font-bold">Communication Board</h1>
        {/* Mobile View Button positioned at the top-right */}
        <button
          onClick={() => setIsMobileView(!isMobileView)}
          className="mobile-toggle-button bg-blue-500 px-4 py-2 rounded absolute right-4 top-4"
        >
          {isMobileView ? 'Desktop View' : 'Mobile View'}
        </button>
      </header>

      <main className="container mx-auto p-4">
        <div className="communication-board">
          {/* Left: Card Deck and Sentence Builder */}
          <div>
            <CardDeck
              currentDeck={decks[currentDeck]}
              onCardSelect={handleCardSelect}
              onDeckChange={handleDeckChange}
              isMobileView={isMobileView}
            />
            <SentenceBuilder
              selectedCards={selectedCards}
              onCardRemove={handleCardRemove}
              onClearAll={onClearAll}
            />
          </div>

          {/* Right: Settings Panel */}
          <SettingsPanel />
        </div>
      </main>
    </div>
  );
};

export default CommunicationBoard;
