import React, { useEffect, useState } from 'react';
import './SettingsPanel.css';
import './CommunicationBoard.css';  
import { cardSound } from './CardSound.js';

const SettingsPanel = ({ isMobileView }) => {
  const [settings, setSettings] = useState({
    colorBlindMode: false,
    screenReader: false,
    cardSound: false,
    volume: 50,
    selectedVoice: '',
    rate: 1,
    pitch: 1
  });

  const [voices, setVoices] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState(''); // New state variable

  // Fetches the available voices on users device
  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const savedVoice = localStorage.getItem('selectedVoice');
      if (availableVoices.length > 0) {
        setSettings(prev => ({
          ...prev,
          selectedVoice: savedVoice || availableVoices[0].name
        }));
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    // Cleanup on page unload 
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Load in other settings from localStorage on mount
  useEffect(() => {
    const savedColorBlindMode = localStorage.getItem('colorBlindMode') === 'true';
    const savedScreenReader = localStorage.getItem('screenReader') === 'true';
    const savedCardSound = localStorage.getItem('cardSound') === 'true';
    const savedVolume = parseInt(localStorage.getItem('volume'), 10) || 50;
    const savedRate = parseFloat(localStorage.getItem('speechRate')) || 1;
    const savedPitch = parseFloat(localStorage.getItem('speechPitch')) || 1;

    setSettings(prev => ({
      ...prev,
      colorBlindMode: savedColorBlindMode,
      screenReader: savedScreenReader,
      cardSound: savedCardSound,
      volume: savedVolume,
      rate: savedRate,
      pitch: savedPitch
    }));
  }, []);

  // Apply color blind mode
  useEffect(() => {
    if (settings.colorBlindMode) {
      document.body.classList.add('color-blind-mode');
    } else {
      document.body.classList.remove('color-blind-mode');
    }
    localStorage.setItem('colorBlindMode', settings.colorBlindMode);
  }, [settings.colorBlindMode]);

  // Update card sound settings
  useEffect(() => {
    cardSound.setEnabled(settings.cardSound);
    cardSound.setVolume(settings.volume);
    localStorage.setItem('cardSound', settings.cardSound);
    localStorage.setItem('volume', settings.volume);
  }, [settings.cardSound, settings.volume]);

  // Save voice settings to localStorage
  useEffect(() => {
    if (settings.selectedVoice) {
      localStorage.setItem('selectedVoice', settings.selectedVoice);
    }
  }, [settings.selectedVoice]);

  useEffect(() => {
    localStorage.setItem('speechRate', settings.rate);
    localStorage.setItem('speechPitch', settings.pitch);
  }, [settings.rate, settings.pitch]);

  // Function to handle setting changes
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedSetting(selectedOption); // Update selectedSetting
  };

  // Handle voice selection
  const handleVoiceChange = (voiceName) => {
    setSettings(prev => ({
      ...prev,
      selectedVoice: voiceName
    }));
  };

  // Handle rate change
  const handleRateChange = (newRate) => {
    setSettings(prev => ({
      ...prev,
      rate: newRate
    }));
  };

  // Handle pitch change
  const handlePitchChange = (newPitch) => {
    setSettings(prev => ({
      ...prev,
      pitch: newPitch
    }));
  };

  // Handle toggling checkboxes in mobile view
  const handleToggleSetting = (setting) => {
    handleSettingChange(setting, !settings[setting]);
    setSelectedSetting(''); // Reset selectedSetting after toggling
  };

  return (
    <div className={`settings-panel ${settings.colorBlindMode ? 'color-blind-active' : ''}`}>
      <h2 className="settings-title">Settings</h2>

      {isMobileView ? (
        // Mobile view: dropdown for selecting settings
        <div className="mobile-settings-container">
          <select 
            className="settings-dropdown" 
            value={selectedSetting} 
            onChange={handleSelectChange}
          >
            <option value="">Select Setting</option>
            <option value="colorBlindMode">Toggle Color Blind Mode</option>
            <option value="screenReader">Toggle Screen Reader</option>
            <option value="cardSound">Toggle Card Sound</option>
            <option value="volume">Adjust Volume</option>
            <option value="selectedVoice">Select Voice</option>
            <option value="rate">Adjust Rate</option>
            <option value="pitch">Adjust Pitch</option>
          </select>

          {/* Conditionally render the selected settings control */}
          {selectedSetting === 'colorBlindMode' && (
            <div className="mobile-control">
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={settings.colorBlindMode}
                  onChange={() => handleToggleSetting('colorBlindMode')}
                  className="option-checkbox"
                />
                <span className="checkbox-text">Color Blind Mode</span>
              </label>
            </div>
          )}

          {selectedSetting === 'screenReader' && (
            <div className="mobile-control">
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={settings.screenReader}
                  onChange={() => handleToggleSetting('screenReader')}
                  className="option-checkbox"
                />
                <span className="checkbox-text">Screen Reader</span>
              </label>
            </div>
          )}

          {selectedSetting === 'cardSound' && (
            <div className="mobile-control">
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={settings.cardSound}
                  onChange={() => handleToggleSetting('cardSound')}
                  className="option-checkbox"
                />
                <span className="checkbox-text">Card Sound</span>
              </label>
            </div>
          )}

          {selectedSetting === 'volume' && (
            <div className="mobile-control">
              <label className="volume-label">Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => handleSettingChange('volume', parseInt(e.target.value, 10))}
                className="volume-slider"
              />
              <span className="volume-value">{settings.volume}</span>
            </div>
          )}

          {selectedSetting === 'selectedVoice' && voices.length > 0 && (
            <div className="mobile-control">
              <label htmlFor="voice-select" className="voice-label">Select Voice:</label>
              <select
                id="voice-select"
                value={settings.selectedVoice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="voice-select-dropdown"
              >
                {voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSetting === 'rate' && (
            <div className="mobile-control">
              <label htmlFor="rate-slider" className="rate-label">Rate:</label>
              <input
                id="rate-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="rate-slider"
              />
              <span className="rate-value">{settings.rate}</span>
            </div>
          )}

          {selectedSetting === 'pitch' && (
            <div className="mobile-control">
              <label htmlFor="pitch-slider" className="pitch-label">Pitch:</label>
              <input
                id="pitch-slider"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="pitch-slider"
              />
              <span className="pitch-value">{settings.pitch}</span>
            </div>
          )}
        </div>
      ) : (
        // Desktop view: checkboxes and sliders
        <>
          <div className="settings-section">
            <h3 className="section-heading">Accessibility</h3>
            <div className="settings-options">
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={settings.colorBlindMode}
                  onChange={(e) => handleSettingChange('colorBlindMode', e.target.checked)}
                  className="option-checkbox"
                />
                <span className="checkbox-text">Color Blind Mode</span>
              </label>
              
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={settings.screenReader}
                  onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
                  className="option-checkbox"
                />
                <span className="checkbox-text">Screen Reader</span>
              </label>
            </div>
          </div>

          <div className="settings-section audio-settings">
            <h3 className="section-heading">Audio</h3>
            <div className="settings-options">
              <label className="option-label">
                <input
                  type="checkbox"
                  checked={settings.cardSound}
                  onChange={(e) => handleSettingChange('cardSound', e.target.checked)}
                  className="option-checkbox"
                />
                <span className="checkbox-text">Card Sound</span>
              </label>
              
              <div className="volume-control">
                <label className="volume-label">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => handleSettingChange('volume', parseInt(e.target.value, 10))}
                  className="volume-slider"
                />
                <span className="volume-value">{settings.volume}</span>
              </div>

              {/* Voice Selection Dropdown */}
              {voices.length > 0 && (
                <div className="voice-selection">
                  <label htmlFor="voice-select" className="voice-label">Select Voice:</label>
                  <select
                    id="voice-select"
                    value={settings.selectedVoice}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="voice-select-dropdown"
                  >
                    {voices.map(voice => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rate Control */}
              <div className="rate-control">
                <label htmlFor="rate-slider" className="rate-label">Rate:</label>
                <input
                  id="rate-slider"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                  className="rate-slider"
                />
                <span className="rate-value">{settings.rate}</span>
              </div>

              {/* Pitch Control */}
              <div className="pitch-control">
                <label htmlFor="pitch-slider" className="pitch-label">Pitch:</label>
                <input
                  id="pitch-slider"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.pitch}
                  onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                  className="pitch-slider"
                />
                <span className="pitch-value">{settings.pitch}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPanel;
