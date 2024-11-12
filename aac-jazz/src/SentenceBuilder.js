// src/components/SentenceBuilder.js
import React, { useState, useEffect } from 'react';
import './SentenceBuilder.css';
import './CommunicationBoard.css';
import { sentenceSpeech } from './SentenceSpeech.js'; 

const SentenceBuilder = ({ selectedCards, onCardRemove, onClearAll }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  // Creates a sentence by joining the text from the selected cards
  const sentence = selectedCards.map(card => card.text).join(' ');

  // Fetches available voices on component mount
  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices(); // Gets available voices from the browser that user can choose from
      setVoices(availableVoices);
      const savedVoice = localStorage.getItem('selectedVoice'); // Fetches selected voice from local storage
      if (availableVoices.length > 0) {
        setSelectedVoice(savedVoice || availableVoices[0].name);
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }, []);

  // Fetch rate and pitch from localStorage if available
  useEffect(() => {
    const savedRate = localStorage.getItem('speechRate');
    const savedPitch = localStorage.getItem('speechPitch'); 
    if (savedRate) setRate(parseFloat(savedRate));
    if (savedPitch) setPitch(parseFloat(savedPitch));
  }, []);

  // Cancel speech when selectedCards is cleared
  useEffect(() => {
    if (selectedCards.length === 0 && isSpeaking) {
      sentenceSpeech.cancel(); // Stop any ongoing speech
      setIsSpeaking(false);    // Reset the speaking state
    }
  }, [selectedCards, isSpeaking]);

  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName);
    localStorage.setItem('selectedVoice', voiceName);
  }; // Handler for voice change

  const handleRateChange = (newRate) => {
    setRate(newRate);
    localStorage.setItem('speechRate', newRate);
  }; // Handler for rate change

  const handlePitchChange = (newPitch) => {
    setPitch(newPitch);
    localStorage.setItem('speechPitch', newPitch);
  }; // Handler for pitch change

  const speakSentence = () => {
    if (!window.speechSynthesis) {
      alert('Sorry, your browser does not support Speech Synthesis.'); // Error handling for browsers that do not support speech synthesis
      return;
    }

    if (isSpeaking) {
      // If already speaking, cancel the speech
      sentenceSpeech.cancel();
      setIsSpeaking(false);
      return;
    }

    if (sentence.trim() === '') {
      alert('Please select words to form a sentence.'); // Default error message for empty sentence
      return;
    }

    // Find the selected voice object
    const voice = voices.find(v => v.name === selectedVoice);

    // Initiate speaking
    sentenceSpeech.speak(sentence, {
      voice: voice,
      rate: rate,
      pitch: pitch,
      volume: 1.0, // Adjust volume as needed or make it dynamic
    });

    setIsSpeaking(true); // Set speaking state to true

    // Event listeners for speech synthesis
    const handleEnd = () => {
      setIsSpeaking(false);
      sentenceSpeech.speechSynthesis.removeEventListener('end', handleEnd); // Removes event listener after speech ends
    };

    const handleError = (e) => {
      console.error('Sentence speech synthesis error:', e);
      setIsSpeaking(false);
      sentenceSpeech.speechSynthesis.removeEventListener('error', handleError); // Removes event listener after error
    };

    sentenceSpeech.speechSynthesis.addEventListener('end', handleEnd);
    sentenceSpeech.speechSynthesis.addEventListener('error', handleError); // Adds event listener for error handling
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) { // Pauses speech if it is speaking and not paused
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  return (
    <div className="sentence-container">
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
        {/* Voice Selection Dropdown */}
        {voices.length > 0 && (
          <select
            value={selectedVoice}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="voice-select"
            aria-label="Select voice"
          >
            {voices.map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        )}

        {/* Clear All Button */}
        <button onClick={onClearAll} className="clear-all-button">
          {selectedCards.length > 0 ? 'Clear All' : 'Start Selecting'}
        </button>

        {/* Read Sentence Button placed below "Clear All" */}
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

      {/* Rate and Pitch Controls */}
      <div className="rate-pitch-controls">
        <label>
          Rate:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => handleRateChange(parseFloat(e.target.value))}
            className="slider"
            aria-label="Speech rate" // Aria label for speech rate slider
          />
          <span>{rate}</span>
        </label>
        <label>
          Pitch:
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
            className="slider"
            aria-label="Speech pitch" // Aria label for speech pitch slider
          />
          <span>{pitch}</span>
        </label>
      </div>
    </div>
  );
};

export default SentenceBuilder;
