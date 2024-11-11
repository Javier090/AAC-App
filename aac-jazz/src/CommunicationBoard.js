import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardDeck from './CardDeck';
import SentenceBuilder from './SentenceBuilder';
import SettingsPanel from './SettingsPanel';
import './CommunicationBoard.css';

// CommunicationBoard useState from API  using axios and local API URL
const CommunicationBoard = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);

  // Fetch all decks on component mount
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/decks');
        setDecks(response.data);
        // Set the first deck as the current deck
        if (response.data.length > 0) {
          setCurrentDeck(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    fetchDecks();
  }, []);

  // Fetch cards whenever the current deck changes
  useEffect(() => {
    const fetchCards = async () => {
      if (currentDeck) {
        try {
          const response = await axios.get(`http://localhost:5000/api/decks/${currentDeck.id}/cards`); // GET all cards for the current deck
          setCards(response.data);
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      }
    };

    fetchCards();
  }, [currentDeck]);

  const handleCardSelect = (card) => {
    setSelectedCards([...selectedCards, card]);
  }; // Handler for card selection

  const handleCardRemove = (cardId) => {
    setSelectedCards(selectedCards.filter(card => card.id !== cardId));
  }; // Handler for card removal 

  const handleDeckChange = (deckId) => {
    const selectedDeck = decks.find(deck => deck.id === parseInt(deckId));
    setCurrentDeck(selectedDeck);
  }; // Handler for changing deck 

  const onClearAll = () => {
    setSelectedCards([]);
  };  // Handler for clearing all selected cards

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
          {/* Left: Settings Panel */}
          <SettingsPanel 
              isMobileView={isMobileView}
          />

          {/* Right: Card Deck and Sentence Builder */}
          <div>
            <CardDeck
              currentDeck={cards}
              decks={decks}
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
        </div>
      </main>
    </div>
  );
};

export default CommunicationBoard;
