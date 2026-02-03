import React, { useState } from 'react';
import './MatchSelector.css';

const MatchSelector = ({ matches, onSelectMatch }) => {
    // matches: array of match objects
    // onSelectMatch: function(matchData or {isCustom, teamA, teamB})

    const [mode, setMode] = useState('list'); // 'list' or 'custom'
    const [customTeamA, setCustomTeamA] = useState('');
    const [customTeamB, setCustomTeamB] = useState('');

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customTeamA && customTeamB) {
            onSelectMatch({
                isCustom: true,
                teamA: customTeamA,
                teamB: customTeamB
            });
        }
    };

    return (
        <div className="match-selector-panel">
            <div className="selector-header">
                <button
                    className={`mode-btn ${mode === 'list' ? 'active' : ''}`}
                    onClick={() => setMode('list')}
                >
                    LIVE MATCHES
                </button>
                <button
                    className={`mode-btn ${mode === 'custom' ? 'active' : ''}`}
                    onClick={() => setMode('custom')}
                >
                    CUSTOM MATCHUP
                </button>
            </div>

            <div className="selector-content">
                {mode === 'list' ? (
                    <div className="match-list">
                        {matches.length === 0 && <div className="no-matches">No live matches found.</div>}
                        {matches.map((edge, idx) => {
                            const match = edge.node;
                            const t1 = match.teams[0]?.baseInfo?.name || "TBD";
                            const t2 = match.teams[1]?.baseInfo?.name || "TBD";
                            const time = new Date(match.startTimeScheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={match.id} className="match-item" onClick={() => onSelectMatch(match)}>
                                    <div className="match-time">{time}</div>
                                    <div className="match-teams">
                                        <span className="t-name">{t1}</span>
                                        <span className="vs">vs</span>
                                        <span className="t-name">{t2}</span>
                                    </div>
                                    <div className="arrow">→</div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <form className="custom-form" onSubmit={handleCustomSubmit}>
                        <div className="input-group">
                            <label>TEAM A</label>
                            <input
                                type="text"
                                placeholder="e.g. Cloud9"
                                value={customTeamA}
                                onChange={(e) => setCustomTeamA(e.target.value)}
                            />
                        </div>
                        <div className="vs-badge">VS</div>
                        <div className="input-group">
                            <label>TEAM B</label>
                            <input
                                type="text"
                                placeholder="e.g. Fnatic"
                                value={customTeamB}
                                onChange={(e) => setCustomTeamB(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="analyze-btn">
                            ANALYZE MATCHUP
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MatchSelector;
