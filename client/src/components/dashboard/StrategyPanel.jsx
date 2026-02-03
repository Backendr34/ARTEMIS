import React from 'react';
import './StrategyPanel.css';

const StrategyPanel = ({ strategy }) => {
    // strategy: { bans: [], picks: [], playstyle }

    return (
        <div className="strategy-panel">
            <div className="section-title">RECOMMENDED STRATEGY</div>

            <div className="strategy-card">
                <div className="strat-group">
                    <h4>PRIORITY BANS</h4>
                    <div className="champ-icons">
                        {strategy.bans.map((champ, idx) => (
                            <div key={idx} className="champ-icon ban" title={`Ban ${champ}`}>
                                <div className="ban-overlay">X</div>
                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${champ}.png`} alt={champ}
                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#333' }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="strat-group">
                    <h4>CORE PICK ROTATION</h4>
                    <div className="champ-icons">
                        {strategy.picks.map((champ, idx) => (
                            <div key={idx} className="champ-icon pick" title={`Pick ${champ}`}>
                                <div className="pick-overlay">✓</div>
                                <img src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${champ}.png`} alt={champ}
                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#333' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="strategy-card playstyle">
                <h4>SUGGESTED PLAYSTYLE</h4>
                <p>"{strategy.playstyle}"</p>
            </div>
        </div>
    );
};

export default StrategyPanel;
