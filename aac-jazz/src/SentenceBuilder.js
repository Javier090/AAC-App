import React from 'react';
import './SentenceBuilder.css';
import './CommunicationBoard.css';

const SentenceBuilder = ({selectedCards, onCardRemove, onClearAll}) => {
    // Create a sentence by joining the text from the selected cards
    const sentence = selectedCards.map(card => card.text).join(' '); // Join the text of the selected cards with in sentence builder
    return ( // Render the sentence builder component
      <div className="sentence-container">
        <h2 className="sentence-label">Sentence:</h2>
        <div className="sentence-output">
          {sentence.length > 0 ? sentence : 'Start selecting words to form a sentence.'} {/* Conditional rendering for sentence depending on sentence lenght */}
        </div>
        <div className="remove-buttons">
          {selectedCards.map(card => (
            <button
              key={card.id}
              onClick={() => onCardRemove(card.id)}
              className="remove-button"
            >
              Remove "{card.text}"
            </button>
          ))}
        </div>
        <button onClick={onClearAll} className="clear-all-button"> {/* Clear all button */}
          {selectedCards.length > 0 ? 'Clear All' : 'Start Selecting'}  {/* Conditional rendering for clear all depending on sentence lenght */}
        </button>
      </div>
    );
};

export default SentenceBuilder;