import React from 'react';
import './HistoricalView.css';

const matches = [
    { id: 1, vs: "LOUD", result: "WON 2-0", date: "2 days ago", map: "Ascent" },
    { id: 2, vs: "Sentinels", result: "LOST 1-2", date: "5 days ago", map: "Lotus" },
    { id: 3, vs: "Paper Rex", result: "WON 2-1", date: "1 week ago", map: "Split" },
];

const mistakes = [
    { time: "04:12", type: "Economy", desc: "Forced buy when team was broke", severity: "High" },
    { time: "12:45", type: "Positioning", desc: "Overextended mid without support", severity: "Medium" },
    { time: "18:20", type: "Utility", desc: "Wasted Sova ult on empty site", severity: "Low" }
];

const HistoricalView = () => {
    return (
        <div className="historical-view">
            {/* LEFT: MATCH LIST */}
            <div className="hist-col list-col">
                <div className="h-header">RECENT MATCHES</div>
                {matches.map(m => (
                    <div key={m.id} className="hist-match-card">
                        <div className="hm-vs">vs {m.vs}</div>
                        <div className={`hm-result ${m.result.includes('WON') ? 'won' : 'lost'}`}>
                            {m.result}
                        </div>
                        <div className="hm-meta">{m.map} • {m.date}</div>
                    </div>
                ))}
            </div>

            {/* CENTER: VOD / TIMELINE */}
            <div className="hist-col vod-col">
                <div className="h-header">MISTAKE ANALYSIS (vs LOUD)</div>
                <div className="vod-placeholder">
                    <div className="play-icon">▶</div>
                    <span>REPLAY VOD</span>
                </div>

                <div className="mistake-timeline">
                    {mistakes.map((mis, i) => (
                        <div key={i} className="mistake-item">
                            <div className="m-time">{mis.time}</div>
                            <div className="m-content">
                                <div className={`m-type ${mis.severity.toLowerCase()}`}>{mis.type}</div>
                                <div className="m-desc">{mis.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: INSIGHTS */}
            <div className="hist-col notes-col">
                <div className="h-header">KEY TAKEAWAYS</div>
                <div className="note-card">
                    <h4>Pistol Rounds</h4>
                    <p>Won only 20% of pistol rounds last 3 games. Need to drill defensive setups.</p>
                </div>
                <div className="note-card">
                    <h4>Mid Control</h4>
                    <p>Struggling against double-controller comps. Recommend picking Kay/O to suppress.</p>
                </div>
            </div>
        </div>
    );
};

export default HistoricalView;
