import React from 'react';
import './QuickStatsBar.css';

const QuickStatsBar = ({ headToHead }) => {
    return (
        <div className="quick-stats-bar">
            <div className="stat-item">
                <span className="label">HEAD-TO-HEAD</span>
                <span className="value highlight">{headToHead.summary}</span>
            </div>
            <div className="divider">|</div>
            <div className="stat-item">
                <span className="label">LAST MEETING</span>
                <span className="value">{headToHead.lastMeeting}</span>
            </div>
            <div className="divider">|</div>
            <div className="stat-item">
                <span className="label">TOURNAMENT STAGE</span>
                <span className="value">Quarterfinals (G2) vs Groups (Lev)</span>
            </div>
        </div>
    );
};

export default QuickStatsBar;
