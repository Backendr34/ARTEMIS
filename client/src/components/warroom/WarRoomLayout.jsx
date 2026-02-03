import React, { useState } from 'react';
import './WarRoomLayout.css';

const WarRoomLayout = ({
    leftPanel,
    centerPanel,
    rightPanel,
    mode,
    onModeChange,
    onVoiceCommand,
}) => {
    const [voiceActive, setVoiceActive] = useState(false);
    const [lastVoiceCmd, setLastVoiceCmd] = useState("");

    const handleVoiceClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        // Fallback to the old demo animation if not supported.
        if (!SpeechRecognition) {
            setVoiceActive(true);
            setLastVoiceCmd("Listening...");
            setTimeout(() => {
                setLastVoiceCmd("Voice not supported in this browser.");
                setTimeout(() => setVoiceActive(false), 1800);
            }, 800);
            return;
        }

        setVoiceActive(true);
        setLastVoiceCmd("Listening...");

        const rec = new SpeechRecognition();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;

        rec.onresult = (event) => {
            const transcript = event?.results?.[0]?.[0]?.transcript || '';
            setLastVoiceCmd(transcript || '...');
            if (onVoiceCommand) onVoiceCommand(transcript);
        };

        rec.onerror = () => {
            setLastVoiceCmd('Voice error.');
        };

        rec.onend = () => {
            setTimeout(() => setVoiceActive(false), 900);
        };

        try {
            rec.start();
        } catch (e) {
            setLastVoiceCmd('Voice busy.');
            setTimeout(() => setVoiceActive(false), 900);
        }
    };

    return (
        <div className="war-room-container">
            {/* TOP BAR / HUD */}
            <header className="war-room-header">
                <div className="brand">
                    <span className="logo-text">ARTEMIS 2.0</span>
                    <span className="version-badge">COMMANDER MODE</span>
                </div>

                <div className="mode-switcher">
                    {['LIVE', 'PREP', 'HISTORICAL'].map(m => (
                        <button
                            key={m}
                            className={`mode-tab ${mode === m ? 'active' : ''}`}
                            onClick={() => onModeChange(m)}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                <div className="status-indicators">
                    <div className="status-item">
                        <span className="dot online"></span> SYSTEM ONLINE
                    </div>
                </div>
            </header>

            {/* MAIN 3-COLUMN GRID */}
            <main className="war-room-grid">
                <div className="col col-left border-right">
                    <div className="panel-header">COMMAND CENTER</div>
                    <div className="panel-content scrub-scroll">
                        {leftPanel}
                    </div>
                </div>

                <div className="col col-center">
                    <div className="panel-header center-header">
                        <span>
                            {mode === 'PREP' ? 'DRAFT SIMULATOR' : mode === 'HISTORICAL' ? 'VOD REVIEW' : 'LIVE MATCH FEED'}
                        </span>
                        <span className="live-pulse">● {mode === 'PREP' ? 'SIM' : mode === 'HISTORICAL' ? 'ARCHIVE' : 'LIVE'}</span>
                    </div>
                    <div className="panel-content">
                        {centerPanel}
                    </div>
                </div>

                <div className="col col-right border-left">
                    <div className="panel-header">STRATEGY DECK</div>
                    <div className="panel-content scrub-scroll">
                        {rightPanel}
                    </div>
                </div>
            </main>

            {/* VOICE COMMAND OVERLAY */}
            <div className={`voice-widget ${voiceActive ? 'active' : ''}`} onClick={handleVoiceClick}>
                <div className="mic-icon">🎤</div>
                <div className="voice-text">
                    {voiceActive ? lastVoiceCmd : "VOICE COMMANDS"}
                </div>
            </div>
        </div>
    );
};

export default WarRoomLayout;
