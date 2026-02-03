import React from 'react';
import './SHAPExplainer.css';

const SHAPExplainer = ({ shapValues }) => {
    if (!shapValues || shapValues.length === 0) return null;

    return (
        <div className="shap-explainer">
            <h4>Win Probability Factors</h4>
            <div className="shap-chart">
                {shapValues.map((item, index) => {
                    const isPositive = item.value > 0;
                    return (
                        <div key={index} className="shap-row">
                            <div className="shap-desc">{item.feature}</div>
                            <div className="shap-bar-container">
                                <div
                                    className={`shap-bar ${isPositive ? 'pos' : 'neg'}`}
                                    style={{ width: `${Math.abs(item.value) * 100 * 3}px` }} // Scale factor
                                />
                            </div>
                            <div className={`shap-val ${isPositive ? 'pos' : 'neg'}`}>
                                {isPositive ? '+' : ''}{(item.value * 100).toFixed(1)}%
                            </div>
                            <div className="shap-tooltip">{item.description}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SHAPExplainer;
