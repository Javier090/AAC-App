import React, {useEffect, useState} from 'react';
import './SettingsPanel.css';
import './CommunicationBoard.css'  
import { cardSound } from './CardSound.js';

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    colorBlindMode: false,
    screenReader: false,
    cardSound: false,
    volume: 50
  });

  // Effect to apply color blind mode to body element
  useEffect(() => {
    if (settings.colorBlindMode) {
      document.body.classList.add('color-blind-mode');
    } else {
      document.body.classList.remove('color-blind-mode');
    }
  }, [settings.colorBlindMode]);

  // Import card sound to update card sound settings
  useEffect(() => {
    cardSound.setEnabled(settings.cardSound);
    cardSound.setVolume(settings.volume);
  }, [settings.cardSound, settings.volume]);



  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className={`settings-panel ${settings.colorBlindMode ? 'color-blind-active' : ''}`}>
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