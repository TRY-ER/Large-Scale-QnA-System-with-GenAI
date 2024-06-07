import React from 'react';
import './BlurredCircle.css'; // Create a CSS file for styling

interface BackgroundProps{
  isDark: boolean; 
}

const BackgroundBlurredCircles = ({isDark}:BackgroundProps) => {
return (
    <div className={`blurred-circle-background ${isDark? "dark" : ""}`}>
      <div className="circle-container">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <div className="circle circle4"></div>
      </div>
    </div>
  );
};

export default BackgroundBlurredCircles;