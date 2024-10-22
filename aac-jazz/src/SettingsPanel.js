import React, { useState } from 'react';
import './SettingsPanel.css';
import './CommunicationBoard.css'  // Ensure this file matches the class names below

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    colorBlindMode: false,
    screenReader: false,
    cardSound: true,
    volume: 50
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="settings-panel"> 
      <h2 className="settings-title">Settings</h2>
      
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
            Color Blind Mode
          </label>
          <label className="option-label">
            <input
              type="checkbox"
              checked={settings.screenReader}
              onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
              className="option-checkbox"
            />
            Screen Reader
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
            Card Sound
          </label>
          <div className="volume-control">
            <label className="volume-label">Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => handleSettingChange('volume', parseInt(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
