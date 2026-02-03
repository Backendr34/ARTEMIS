import React from 'react';
import './RecommendationPanel.css';

const RecommendationPanel = ({ recommendations, onSelect }) => {
    return (
        <div className="recommendation-panel">
            <h3>ARTEMIS Recommendations</h3>
            <div className="recommendation-list">
                {recommendations.map((rec, index) => (
                    <div
                        key={index}
                        className={`rec-card ${rec.type.toLowerCase()}`}
                        onClick={() => onSelect(rec)}
                    >
                        <div className="rec-header">
                            <span className="champion-name">{rec.name}</span>
                            <span className="score">{rec.score}</span>
                        </div>
                        <div className="rec-role">{rec.role}</div>
                        <div className="rec-reasoning">
                            <span className="tag">{rec.type}</span>
                            <p>{rec.reasoning}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationPanel;
