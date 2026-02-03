import React from 'react';
import './DraftBoard.css';

const DraftBoard = ({ bluePicks, redPicks, blueBans, redBans, onSlotClick }) => {

    // Helper to render slots
    const renderSlots = (picks, side, count = 5) => {
        const slots = [];
        for (let i = 0; i < count; i++) {
            const pick = picks[i];
            slots.push(
                <div
                    key={`${side}-pick-${i}`}
                    className={`pick-slot ${side} ${!pick ? 'empty' : 'filled'}`}
                    onClick={() => !pick && onSlotClick(side, 'pick', i)}
                >
                    {pick ? (
                        <>
                            <div className="champion-image" style={{ backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick.name}_0.jpg)` }}></div>
                            <div className="champion-name">{pick.name}</div>
                            <div className="pick-role">{pick.role}</div>
                        </>
                    ) : (
                        <div className="empty-label">PICK {i + 1}</div>
                    )}
                </div>
            );
        }
        return slots;
    };

    const renderBans = (bans, side) => {
        return (
            <div className={`bans-container ${side}`}>
                {Array.from({ length: 5 }).map((_, i) => {
                    const ban = bans[i];
                    return (
                        <div key={`${side}-ban-${i}`} className="ban-slot">
                            {ban && <img src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${ban.name}.png`} alt={ban.name} />}
                        </div>
                    );
                })}
            </div>
        )
    }

    return (
        <div className="draft-board">
            <div className="team-side blue">
                <div className="team-header">BLUE TEAM</div>
                {renderBans(blueBans, 'blue')}
                <div className="picks-container">
                    {renderSlots(bluePicks, 'blue')}
                </div>
            </div>

            {/* Center area is left empty for the Thermometer in the parent layout */}

            <div className="team-side red">
                <div className="team-header">RED TEAM</div>
                {renderBans(redBans, 'red')}
                <div className="picks-container">
                    {renderSlots(redPicks, 'red')}
                </div>
            </div>
        </div>
    );
};

export default DraftBoard;
