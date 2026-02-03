import React, { useState } from 'react';
import axios from 'axios';
import './SimulatorView.css';

const API_BASE = '/api';

const SimulatorView = () => {
    // State for draft
    const [bluePicks, setBluePicks] = useState([]);
    const [redPicks, setRedPicks] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock Pool
    const champions = ["Jett", "Raze", "Sova", "Omen", "Viper", "Chamber", "Kay/O", "Skye", "Killjoy", "Fade"];

    const handlePick = async (champ, side) => {
        if (side === 'blue') setBluePicks([...bluePicks, champ]);
        else setRedPicks([...redPicks, champ]);

        // Trigger automatic "What If" analysis
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/simulation/what-if`, {
                originalPick: "None",
                alternativePick: champ
            });
            setAnalysis(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUndo = () => {
        if (bluePicks.length > redPicks.length) setBluePicks(bluePicks.slice(0, -1));
        else setRedPicks(redPicks.slice(0, -1));
        setAnalysis(null);
    };

    // Play / FastFwd Logic
    const [isPlaying, setIsPlaying] = useState(false);

    const availablePool = champions.filter(c => !bluePicks.includes(c) && !redPicks.includes(c));

    const makeRandomPick = () => {
        // Determine whose turn it is
        const isBlueTurn = bluePicks.length <= redPicks.length;
        if (bluePicks.length === 5 && redPicks.length === 5) return false;

        // Pick random
        const available = champions.filter(c => !bluePicks.includes(c) && !redPicks.includes(c));
        if (available.length === 0) return false;

        const randomChamp = available[Math.floor(Math.random() * available.length)];

        if (isBlueTurn) setBluePicks(prev => [...prev, randomChamp]);
        else setRedPicks(prev => [...prev, randomChamp]);

        return true;
    };

    const handlePlay = () => {
        if (isPlaying) return;
        setIsPlaying(true);
        const interval = setInterval(() => {
            const continued = makeRandomPick();
            if (!continued || (bluePicks.length === 5 && redPicks.length === 5)) {
                clearInterval(interval);
                setIsPlaying(false);
            }
        }, 1000);
    };

    const handleFastFwd = () => {
        // Fill all remaining slots immediately
        let b = [...bluePicks];
        let r = [...redPicks];
        let pool = champions.filter(c => !b.includes(c) && !r.includes(c));

        while (b.length < 5 || r.length < 5) {
            if (pool.length === 0) break;

            if (b.length <= r.length && b.length < 5) {
                const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
                b.push(pick);
            } else if (r.length < 5) {
                const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
                r.push(pick);
            }
        }
        setBluePicks(b);
        setRedPicks(r);
    };

    return (
        <div className="simulator-view">
            <div className="sim-toolbar">
                <div className="sim-title">STRATEGIC TIME MACHINE</div>
                <div className="sim-controls">
                    <button className="sim-btn" onClick={handleUndo}>⏪ REWIND</button>
                    <button className="sim-btn" onClick={handlePlay} disabled={isPlaying}>
                        {isPlaying ? '...PLAYING...' : '▶ PLAY'}
                    </button>
                    <button className="sim-btn" onClick={handleFastFwd}>⏩ FAST FWD</button>
                </div>
            </div>

            <div className="draft-stage">
                <div className="team-side blue">
                    <h3>BLUE TEAM</h3>
                    <div className="pick-list">
                        {bluePicks.map((p, i) => <div key={i} className="pick-slot filled">{p}</div>)}
                        {[...Array(5 - bluePicks.length)].map((_, i) => <div key={i} className="pick-slot empty"></div>)}
                    </div>
                </div>

                <div className="pool-area">
                    <h4>AVAILABLE AGENTS</h4>
                    <div className="agent-grid">
                        {champions.map(c => (
                            <button
                                key={c}
                                className="agent-btn"
                                onClick={() => handlePick(c, bluePicks.length <= redPicks.length ? 'blue' : 'red')}
                                disabled={bluePicks.includes(c) || redPicks.includes(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="team-side red">
                    <h3>RED TEAM</h3>
                    <div className="pick-list">
                        {redPicks.map((p, i) => <div key={i} className="pick-slot filled">{p}</div>)}
                        {[...Array(5 - redPicks.length)].map((_, i) => <div key={i} className="pick-slot empty"></div>)}
                    </div>
                </div>
            </div>

            {/* POPUP ANALYSIS */}
            {analysis && (
                <div className="what-if-popup">
                    <div className="popup-header">SIMULATION RESULT</div>
                    <div className="win-delta">{analysis.winProbabilityChange} Win Probability</div>
                    <ul>
                        {analysis.keyFactors.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SimulatorView;
