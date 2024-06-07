import React, { useState } from 'react';
import './ThemeToggler.css'; // Import your custom CSS for styling

interface ToggleInterface{
    feature_name: String,
    isEnabled: Boolean,
    setIsEnabled: Function
}

function ThemeToggler({
    feature_name,
    isEnabled,
    setIsEnabled,
}:ToggleInterface) {
  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="custom-theme-toggler">
        <div
          className={`theme-toggler-slider ${isEnabled ? 'enabled' : 'disabled'}`}
          onClick={handleToggle}
        >
          <div className={`theme-toggler-thumb ${isEnabled ? 'enabled' : 'disabled'}`} />
        </div>
      <div className="theme-toggle-instruction-text">{isEnabled ? `Click to switch to light mode` : 
      `Click to switch to dark mode`}</div>
    </div>
  );
}

export default ThemeToggler;