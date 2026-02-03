import React from 'react';
import './MatchPredictionCard.css';

const MatchPredictionCard = ({ data }) => {
    // Expects: { winner, probability, keyFactors: [ {text, type} ], headToHead }

    const isG2 = data.winner === 'G2 Esports';
    const blueTeam = "G2 Esports";
    const redTeam = "Leviatán";

    const blueProb = isG2 ? Math.round(data.probability * 100) : 100 - Math.round(data.probability * 100);
    const redProb = 100 - blueProb;

    return (
        <div className="match-prediction-card">
            <div className="card-header">
                <h2>MATCH PREDICTION</h2>
                <div className="live-badge">UPCOMING MATCH</div>
            </div>

            <div className="teams-vs-display">
                <div className="team blue">
                    <div className="team-logo">G2</div>
                    <div className="team-name">{blueTeam}</div>
                    <div className="win-prob">{blueProb}%</div>
                </div>

                <div className="vs-divider">
                    VS
                </div>

                <div className="team red">
                    <div className="team-logo">LEV</div>
                    <div className="team-name">{redTeam}</div>
                    <div className="win-prob">{redProb}%</div>
                </div>
            </div>

            <div className="prob-bar-container">
                <div className="prob-bar blue" style={{ width: `${blueProb}%` }}></div>
                <div className="prob-bar red" style={{ width: `${redProb}%` }}></div>
            </div>

            <div className="key-factors">
                <h3>KEY VICTORY FACTORS</h3>
                <ul>
                    {data.keyFactors.map((factor, idx) => (
                        <li key={idx} className={factor.type}>
                            <span className="icon">✓</span> {factor.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MatchPredictionCard;
