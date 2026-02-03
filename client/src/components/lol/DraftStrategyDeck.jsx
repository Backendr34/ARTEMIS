import React from 'react';
import RecommendationPanel from '../RecommendationPanel';
import './DraftStrategyDeck.css';

const ROLES = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FLEX'];

const DraftStrategyDeck = ({
    role,
    onRoleChange,
    action,
    onActionChange,
    recommendations,
    onSelectRecommendation,
    onExport,
    analysis,
}) => {
    const winProb = analysis?.winProbability ?? 0.5;

    return (
        <div className="draft-strategy-deck">
            <div className="deck-card">
                <div className="deck-title">DRAFT CONTROLS</div>

                <div className="control-row">
                    <label>Side</label>
                    <select value={action.side} onChange={(e) => onActionChange({ ...action, side: e.target.value })}>
                        <option value="blue">Blue (Enemy)</option>
                        <option value="red">Red (Us)</option>
                    </select>
                </div>

                <div className="control-row">
                    <label>Action</label>
                    <select value={action.phase} onChange={(e) => onActionChange({ ...action, phase: e.target.value })}>
                        <option value="pick">Pick</option>
                        <option value="ban">Ban</option>
                    </select>
                </div>

                <div className="control-row">
                    <label>Role</label>
                    <select value={role} onChange={(e) => onRoleChange(e.target.value)}>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div className="control-row">
                    <label>Win% (Blue)</label>
                    <div className="pill">{Math.round(winProb * 100)}%</div>
                </div>

                <button className="export-btn" onClick={onExport}>EXPORT STRATEGY</button>

                <div className="voice-hints">
                    <div className="hint-title">VOICE COMMANDS (MVP)</div>
                    <div className="hint">"switch to prep" / "switch to live" / "switch to historical"</div>
                </div>
            </div>

            <RecommendationPanel
                recommendations={recommendations}
                onSelect={onSelectRecommendation}
            />
        </div>
    );
};

export default DraftStrategyDeck;
