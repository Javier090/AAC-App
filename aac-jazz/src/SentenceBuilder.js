import React from 'react';
import './SentenceBuilder.css';
import './CommunicationBoard.css';

const SentenceBuilder = ({ selectedCards, onCardRemove }) => {
  return (
    <div className="sentence-box">
      <h2 className="sentence-output">Sentence:</h2>
      <div className="min-h-16 p-2 border rounded">
        <div className="flex flex-wrap gap-2">
          {selectedCards.map((card) => (
            <div key={card.id} className="card">
              <span>{card.text}</span>
              <button
                onClick={() => onCardRemove(card.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentenceBuilder;
