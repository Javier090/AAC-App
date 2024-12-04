import React, { useState, useEffect } from 'react';
import './SentenceBuilder.css';
import './CommunicationBoard.css';
import { sentenceSpeech } from './SentenceSpeech.js'; 

const SentenceBuilder = ({ selectedCards, onCardRemove, onClearAll, onCardDrop }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Fetch voices to ensure they are loaded
  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    // Cleanup on unmount
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Create a sentence by joining the text from the selected cards
  const sentence = selectedCards.map(card => card.text).join(' ');

  // Cancel speech when selectedCards is cleared
  useEffect(() => {
    if (selectedCards.length === 0 && isSpeaking) {
      sentenceSpeech.cancel();
      setIsSpeaking(false);
    }
  }, [selectedCards, isSpeaking]);

  // Speak or stop the sentence
  const speakSentence = () => {
    if (!window.speechSynthesis) {
      alert('Sorry, your browser does not support Speech Synthesis.');
      return;
    }

    if (isSpeaking) {
      sentenceSpeech.cancel();
      setIsSpeaking(false);
      return;
    }

    if (sentence.trim() === '') {
      alert('Please select words to form a sentence.');
      return;
    }

    // Retrieve settings from localStorage
    const selectedVoiceName = localStorage.getItem('selectedVoice');
    const rate = parseFloat(localStorage.getItem('speechRate')) || 1;
    const pitch = parseFloat(localStorage.getItem('speechPitch')) || 1;

    const voice = voices.find(v => v.name === selectedVoiceName);

    sentenceSpeech.speak(sentence, {
      voice: voice,
      rate: rate,
      pitch: pitch,
      volume: 1.0, // Adjust volume as needed or make it dynamic
    });

    setIsSpeaking(true);

    // Event listeners for speech synthesis
    const handleEnd = () => {
      setIsSpeaking(false);
      sentenceSpeech.speechSynthesis.removeEventListener('end', handleEnd);
    };

    const handleError = (e) => {
      console.error('Sentence speech synthesis error:', e);
      setIsSpeaking(false);
      sentenceSpeech.speechSynthesis.removeEventListener('error', handleError);
    };

    sentenceSpeech.speechSynthesis.addEventListener('end', handleEnd);
    sentenceSpeech.speechSynthesis.addEventListener('error', handleError);
  };

  // Pause speech
  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  // Resume speech
  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  // Handle drag over event to allow dropping
  const handleDragOver = (event) => {
    event.preventDefault(); // Allows dropping
  };

  // Handle drop event to add a card to the sentence
  const handleDrop = (event) => {
    event.preventDefault();
    const card = JSON.parse(event.dataTransfer.getData('card'));
    onCardDrop(card);
  };

  return (
    <div className="sentence-container" onDrop={handleDrop} onDragOver={handleDragOver}>
      <h2 className="sentence-label">Sentence:</h2>
      <div className="sentence-output">
        {sentence.length > 0 ? sentence : 'Start selecting words to form a sentence.'}
      </div>
      <div className="remove-buttons">
        {selectedCards.map(card => (
          <button
            key={card.instanceId}
            onClick={() => onCardRemove(card.instanceId)}
            className="remove-button"
            aria-label={`Remove ${card.text}`}
          >
            Remove "{card.text}"
          </button>
        ))}
      </div>
      
      <div className="controls">
        {/* Clear All Button */}
        <button onClick={onClearAll} className="clear-all-button">
          {selectedCards.length > 0 ? 'Clear All' : 'Start Selecting'}
        </button>

        {/* Read Sentence Button */}
        <button
          onClick={speakSentence}
          className={`read-button ${isSpeaking ? 'speaking' : ''}`}
          disabled={sentence.trim() === ''}
          aria-label={isSpeaking ? 'Stop reading sentence' : 'Read sentence'}
        >
          {isSpeaking ? 'Stop' : 'Read Sentence'}
        </button>

        {/* Pause and Resume Buttons */}
        {isSpeaking && (
          <>
            <button
              onClick={pauseSpeech}
              className="pause-button"
              aria-label="Pause reading sentence"
            >
              Pause
            </button>
            <button
              onClick={resumeSpeech}
              className="resume-button"
              aria-label="Resume reading sentence"
            >
              Resume
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SentenceBuilder;
