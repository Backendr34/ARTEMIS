import React from 'react';
import './MomentumTracker.css';

const MomentumTracker = ({ data }) => {
    // data: { currentMomentum, trend, history: [{round, value, label}] }

    if (!data) return <div className="momentum-loading">Analyzing Momentum...</div>;

    return (
        <div className="momentum-tracker">
            <div className="momentum-header">
                <div className="momentum-title">MATCH MOMENTUM</div>
                <div className="momentum-value">{data.currentMomentum} ⚡</div>
            </div>

            <div className="momentum-graph">
                <div className="zero-line"></div>
                {data.history.map((point, idx) => {
                    const height = Math.abs(point.value);
                    const isPositive = point.value > 0;

                    return (
                        <div key={idx} className="momentum-bar-wrapper" title={`Round ${point.round}: ${point.label}`}>
                            <div
                                className={`momentum-bar ${isPositive ? 'pos' : 'neg'}`}
                                style={{ height: `${height * 0.8}%` }} // Scale factor
                            ></div>
                        </div>
                    );
                })}
            </div>

            <div className="momentum-status">
                TREND: <span className="highlight">{data.trend}</span>
            </div>
        </div>
    );
};

export default MomentumTracker;
