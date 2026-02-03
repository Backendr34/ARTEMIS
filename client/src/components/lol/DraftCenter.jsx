import React from 'react';
import DraftBoard from '../DraftBoard';
import WinThermometer from '../WinThermometer';
import SHAPExplainer from '../SHAPExplainer';
import './DraftCenter.css';

const DraftCenter = ({
    draft,
    analysis,
    timelineIndex,
    timelineMax,
    onTimelineChange,
    onPickSlotClick,
}) => {
    const winProb = analysis?.winProbability ?? 0.5;

    return (
        <div className="draft-center">
            <div className="draft-toolbar">
                <div className="draft-title">LIVE DRAFT SIMULATION</div>

                <div className="time-machine">
                    <div className="tm-label">STRATEGIC TIME MACHINE</div>
                    <input
                        className="tm-slider"
                        type="range"
                        min={0}
                        max={timelineMax}
                        value={timelineIndex}
                        onChange={(e) => onTimelineChange(Number(e.target.value))}
                    />
                    <div className="tm-meta">Step {timelineIndex} / {timelineMax}</div>
                </div>
            </div>

            <div className="draft-stage">
                <div className="draft-board-wrap">
                    <DraftBoard
                        bluePicks={draft.bluePicks}
                        redPicks={draft.redPicks}
                        blueBans={draft.blueBans}
                        redBans={draft.redBans}
                        onSlotClick={onPickSlotClick}
                    />
                </div>

                <div className="draft-metrics">
                    <WinThermometer winProbability={winProb} />
                    <div className="shap-wrap">
                        <SHAPExplainer shapValues={analysis?.shapValues || []} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DraftCenter;
