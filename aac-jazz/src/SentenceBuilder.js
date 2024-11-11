import React from 'react';
import './SentenceBuilder.css';
import './CommunicationBoard.css';

const SentenceBuilder = ({ selectedCards, onCardRemove, onClearAll, onCardDrop }) => {
  const handleDragOver = (event) => {
    event.preventDefault();  // Allows dropping
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    const card = JSON.parse(event.dataTransfer.getData('card'));
    onCardDrop(card);
  };

  const sentence = selectedCards.map(card => card.text).join(' ');

  return (
    <div className="sentence-container" onDrop={handleDrop} onDragOver={handleDragOver}>
      <h2 className="sentence-label">Sentence:</h2>
      <div className="sentence-output">
        {sentence.length > 0 ? sentence : 'Start selecting words to form a sentence.'}
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
      <button onClick={onClearAll} className="clear-all-button">
        {selectedCards.length > 0 ? 'Clear All' : 'Start Selecting'}
      </button>
    </div>
  );
};

export default SentenceBuilder;
