import React from 'react';
import './TeamAnalyticsSidebar.css';

const TeamAnalyticsSidebar = ({ insights }) => {
    // insights: { recentForm, mapWinRates, avgRoundDuration, playerSpotlight }

    return (
        <div className="team-analytics-sidebar">
            <div className="section-title">TEAM ANALYTICS</div>

            <div className="analytics-card">
                <h4>RECENT FORM (G2)</h4>
                <div className="form-display">
                    {insights.recentForm.map((result, idx) => (
                        <div key={idx} className={`form-badge ${result}`}>
                            {result}
                        </div>
                    ))}
                </div>
            </div>

            <div className="analytics-card">
                <h4>MAP WIN RATES</h4>
                <div className="map-list">
                    {insights.mapWinRates.map((mapData, idx) => (
                        <div key={idx} className="map-row">
                            <span className="map-name">{mapData.map}</span>
                            <div className="map-bar-bg">
                                <div className="map-bar-fill" style={{ width: `${mapData.winRate}%` }}></div>
                            </div>
                            <span className="map-pct">{mapData.winRate}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="analytics-card spotlight">
                <h4>PLAYER SPOTLIGHT</h4>
                <div className="spotlight-content">
                    <div className="player-avatar"></div>
                    <div className="player-info">
                        <div className="p-name">{insights.playerSpotlight.name}</div>
                        <div className="p-stat">
                            <span className="val">{insights.playerSpotlight.value}</span>
                            <span className="label">{insights.playerSpotlight.metric}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamAnalyticsSidebar;
