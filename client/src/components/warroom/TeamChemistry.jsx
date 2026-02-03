import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TeamChemistry.css';

const TeamChemistry = () => {
    const [chem, setChem] = useState(null);

    useEffect(() => {
        axios.get('/api/players/chemistry')
            .then(res => setChem(res.data))
            .catch(console.error);
    }, []);

    if (!chem) return <div>Loading Chemistry...</div>;

    return (
        <div className="team-chemistry">
            <div className="overall-score">
                <div className="score-ring">
                    <span className="val">{chem.teamScore}</span>
                    <span className="lbl">CHEMISTRY SCORE</span>
                </div>
            </div>

            <div className="chem-list">
                {chem.pairs.map((pair, i) => (
                    <div key={i} className={`chem-item ${pair.type.toLowerCase()}`}>
                        <div className="pair-names">{pair.p1} + {pair.p2}</div>
                        <div className="pair-status">
                            <span className="type-badge">{pair.type} {pair.score}%</span>
                            <span className="msg">{pair.msg}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hot-streak-card">
                <div className="fire-icon">🔥</div>
                <div className="streak-info">
                    <div className="s-player">{chem.hotStreak.player}</div>
                    <div className="s-val">{chem.hotStreak.streak} {chem.hotStreak.metric} Streak</div>
                </div>
            </div>
        </div>
    );
};

export default TeamChemistry;
