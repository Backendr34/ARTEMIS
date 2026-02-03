import React from 'react';
import './WinThermometer.css';

const WinThermometer = ({ winProbability }) => {
    // 0.5 is 50%.
    const percentage = Math.round(winProbability * 100);

    // Determine color based on favor
    // > 50% favors Blue (Teal/Blue), < 50% favors Red (Red/Orange)
    const isBlueFavored = winProbability >= 0.5;

    return (
        <div className="win-thermometer-container">
            <div className="thermometer-label top">
                <span className="team-name">BLUE</span>
                <span className="percentage">{isBlueFavored ? percentage : 100 - percentage}%</span>
            </div>

            <div className="thermometer-bar">
                <div
                    className="fill"
                    style={{
                        height: `${percentage}%`,
                        backgroundColor: isBlueFavored ? '#00A9E0' : '#FF4655' // C9 Blue vs Valorant Red style
                    }}
                />
                <div className="midline" />
            </div>

            <div className="thermometer-label bottom">
                <span className="percentage">{!isBlueFavored ? percentage : 100 - percentage}%</span>
                <span className="team-name">RED</span>
            </div>
        </div>
    );
};

export default WinThermometer;
