import React from 'react';
import './HistoricalGraph.css';

const HistoricalGraph = ({ data }) => {
    // data: array of numbers (e.g. [50, 55, 60...])

    // Normalize for height (assuming 0-100 range)

    return (
        <div className="historical-graph">
            <div className="graph-header">
                <h3>WIN % OVER LAST 10 MATCHES</h3>
                <span className="legend"><span className="dot blue"></span> G2 Trend</span>
            </div>

            <div className="chart-area">
                <div className="y-axis">
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                </div>
                <div className="bars-container">
                    {data.map((val, idx) => (
                        <div key={idx} className="bar-wrapper" title={`Match ${idx + 1}: ${val}%`}>
                            <div
                                className="bar"
                                style={{
                                    height: `${val}%`,
                                    backgroundColor: val > 50 ? '#00C8FF' : '#FF4655',
                                    opacity: 0.5 + (idx / 20) // Fade in effect
                                }}
                            ></div>
                            <span className="bar-label">{idx + 1}</span>
                        </div>
                    ))}
                    <div className="guideline"></div>
                </div>
            </div>
        </div>
    );
};

export default HistoricalGraph;
