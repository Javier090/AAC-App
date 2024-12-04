import React, { useEffect, useState } from 'react';
import './SettingsPanel.css';
import './CommunicationBoard.css';  
import { cardSound } from './CardSound.js';

// SettingsPanel component for all settings
const SettingsPanel = ({ isMobileView }) => {
  const [settings, setSettings] = useState({
    colorBlindMode: false,
    screenReader: false,
    cardSound: false,
    volume: 50
  });
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // UseEffect to apply color blind mode to body element
  useEffect(() => {
    if (settings.colorBlindMode) {
      document.body.classList.add('color-blind-mode');
    } else {
      document.body.classList.remove('color-blind-mode');
    }
  }, [settings.colorBlindMode]);

  // UseEffect to toggle a simple screen reader.
  useEffect(() => {
    if (settings.screenReader) {
      let type;
      for (type in readTypes) {
        let readables = document.querySelectorAll(readTypes[type]);
        readables.forEach(elm => {
          elm.classList.add('screen-reader');

          elm.onmouseenter = function (e) {
            e.stopPropagation()
            elm.classList.add("highlight");
            let tag = elm.tagName.toLowerCase();
        
            let toRead = elm.innerText;
            if (tag === "img") {
              toRead = elm.getAttribute('alt') + " card";
              speechSynthesis.speak(new SpeechSynthesisUtterance(toRead));
              return;
            }

            speechSynthesis.speak(new SpeechSynthesisUtterance(toRead));
          }

          elm.addEventListener('mouseleave', function (e) {
            elm.classList.remove("highlight");
            speechSynthesis.cancel();
          })
        })
      }
    } else {
      let type;
      for (type in readTypes) {
        let readables = document.querySelectorAll(readTypes[type]);
        readables.forEach(elm => {
          elm.classList.remove('screen-reader');
        })
      }
    }
  }, [settings.screenReader]);


  // Import card sound js file to update card sound settings
  useEffect(() => {
    cardSound.setEnabled(settings.cardSound);
    cardSound.setVolume(settings.volume);
  }, [settings.cardSound, settings.volume]);

  // Function to handle setting changes
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption === 'colorBlindMode' || selectedOption === 'screenReader' || selectedOption === 'cardSound') {
      handleSettingChange(selectedOption, !settings[selectedOption]);
      setShowVolumeSlider(false);
    }

    // Show the volume slider if 'volume' is selected
    if (selectedOption === 'volume') {
      setShowVolumeSlider(true);
    }
  };

  return (
    <div className={`settings-container ${isMobileView ? 'mobile-view' : ''}`}>
      <div className={`settings-panel ${settings.colorBlindMode ? 'color-blind-active' : ''}`}>
        <h2 className="settings-title">Settings</h2>

        {isMobileView ? (
        <>
          <select className="w-full p-2 border rounded" onChange={handleSelectChange}>
            <option value="">Select Setting</option>
            <option value="colorBlindMode">Toggle Color Blind Mode</option>
            <option value="screenReader">Toggle Screen Reader</option>
            <option value="cardSound">Toggle Card Sound</option>
            <option value="volume">Adjust Volume</option>
          </select>
          {showVolumeSlider && (
          <div className="volume-control">
            <br></br>
            <label className="volume-label">Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
              className="volume-slider"
            />
          </div>)}
        </>
      ) : (
          // Desktop view: checkboxes and slider
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;
