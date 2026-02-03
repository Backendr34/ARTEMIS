import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Components
import WarRoomLayout from './components/warroom/WarRoomLayout';
import MatchSelector from './components/dashboard/MatchSelector';
import TeamAnalyticsSidebar from './components/dashboard/TeamAnalyticsSidebar';
import MatchPredictionCard from './components/dashboard/MatchPredictionCard';
import MomentumTracker from './components/warroom/MomentumTracker';
import HistoricalGraph from './components/dashboard/HistoricalGraph';
import StrategyPanel from './components/dashboard/StrategyPanel';
import TeamChemistry from './components/warroom/TeamChemistry';
import HistoricalView from './components/warroom/HistoricalView'; // NEW

// LoL Drafting Assistant (Category 3)
import DraftCenter from './components/lol/DraftCenter';
import DraftStrategyDeck from './components/lol/DraftStrategyDeck';

// Use environment variable for backend URL, fallback to proxy for local development
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function App() {
    const [mode, setMode] = useState('LIVE');
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [insights, setInsights] = useState(null);
    const [momentum, setMomentum] = useState(null);

    // --- LoL Drafting Assistant state (PREP mode) ---
    const initialDraft = {
        bluePicks: [],
        redPicks: [],
        blueBans: [],
        redBans: [],
    };

    const [draft, setDraft] = useState(initialDraft);
    const [draftAnalysis, setDraftAnalysis] = useState({ winProbability: 0.5, shapValues: [] });
    const [draftRole, setDraftRole] = useState('JUNGLE');
    const [draftAction, setDraftAction] = useState({ side: 'red', phase: 'pick' }); // side: blue/red, phase: pick/ban
    const [draftRecs, setDraftRecs] = useState([]);

    const [timeline, setTimeline] = useState({
        index: 0,
        history: [initialDraft],
    });

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

    // Draft analysis/recommendations refresh (PREP mode)
    useEffect(() => {
        const run = async () => {
            try {
                const [pred, recs] = await Promise.all([
                    axios.post(`${API_BASE}/artemis/draft/predict`, {
                        bluePicks: draft.bluePicks,
                        redPicks: draft.redPicks,
                        blueBans: draft.blueBans,
                        redBans: draft.redBans,
                    }),
                    axios.post(`${API_BASE}/artemis/draft/recommend`, {
                        role: draftRole,
                        side: draftAction.side,
                        bluePicks: draft.bluePicks,
                        redPicks: draft.redPicks,
                    }),
                ]);

                setDraftAnalysis(pred.data);
                setDraftRecs(recs.data);
            } catch (e) {
                console.error(e);
            }
        };

        // Avoid hammering when user scrubs the timeline
        const t = setTimeout(run, 150);
        return () => clearTimeout(t);
    }, [draft, draftRole, draftAction.side]);

    const loadData = async () => {
        try {
            // 1. Matches
            const scheduleRes = await axios.get(`${API_BASE}/matches/today`);
            const matchList = scheduleRes.data.allSeries.edges;
            setMatches(matchList);

            // Default select
            const featured = matchList[0]?.node;
            if (featured) handleSelectMatch(featured);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectMatch = async (matchOrCustom) => {
        let tA, tB;
        if (matchOrCustom.isCustom) {
            tA = matchOrCustom.teamA;
            tB = matchOrCustom.teamB;
            setSelectedMatch({ custom: true, title: "Custom Matchup" });
        } else {
            tA = matchOrCustom.teams[0]?.baseInfo?.name;
            tB = matchOrCustom.teams[1]?.baseInfo?.name;
            setSelectedMatch(matchOrCustom);
        }

        const [predRes, insightsRes, momRes] = await Promise.all([
            axios.post(`${API_BASE}/predict`, { teamA: tA, teamB: tB }),
            axios.get(`${API_BASE}/teams/g2/insights`),
            axios.get(`${API_BASE}/match/momentum`)
        ]);

        setPrediction(predRes.data);
        setInsights(insightsRes.data);
        setMomentum(momRes.data);
    };

    const pushTimeline = (nextDraft) => {
        setTimeline((prev) => {
            const truncated = prev.history.slice(0, prev.index + 1);
            const history = [...truncated, nextDraft];
            return { history, index: history.length - 1 };
        });
        setDraft(nextDraft);
    };

    const applyDraftAction = (champName) => {
        const next = JSON.parse(JSON.stringify(draft));
        const side = draftAction.side;
        const phase = draftAction.phase;
        const role = draftRole;

        const pickObj = { name: champName, role };

        if (phase === 'ban') {
            const key = side === 'blue' ? 'blueBans' : 'redBans';
            if (next[key].length >= 5) return;
            next[key].push({ name: champName });
        } else {
            const key = side === 'blue' ? 'bluePicks' : 'redPicks';
            if (next[key].length >= 5) return;
            next[key].push(pickObj);
        }

        // Simple alternation (demo-friendly)
        const nextSide = side === 'blue' ? 'red' : 'blue';
        setDraftAction((prev) => ({ ...prev, side: nextSide }));

        pushTimeline(next);
    };

    const handlePickSlotClick = (side, type, index) => {
        if (type !== 'pick') return;
        setDraftAction((prev) => ({ ...prev, side, phase: 'pick' }));
    };

    const handleTimelineChange = (idx) => {
        setTimeline((prev) => {
            const clamped = Math.max(0, Math.min(idx, prev.history.length - 1));
            setDraft(prev.history[clamped]);
            return { ...prev, index: clamped };
        });
    };

    const handleExportStrategy = () => {
        const payload = {
            exportedAt: new Date().toISOString(),
            draft,
            analysis: draftAnalysis,
            recommendations: draftRecs,
            controls: { role: draftRole, action: draftAction },
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `artemis-strategy-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // --- RENDER CONTENT BASED ON MODE ---

    let LeftPanel, CenterPanel, RightPanel;

    if (mode === 'LIVE') {
        LeftPanel = (
            <div className="panel-stack">
                <MatchSelector matches={matches} onSelectMatch={handleSelectMatch} />
                {insights && <TeamAnalyticsSidebar insights={insights} />}
            </div>
        );
        CenterPanel = (
            <div className="panel-stack">
                {prediction && <MatchPredictionCard data={prediction} />}
                {momentum && <MomentumTracker data={momentum} />}
                {prediction && <HistoricalGraph data={prediction.historicalWinRate} />}
            </div>
        );
        RightPanel = (
            <div className="panel-stack">
                {prediction && <StrategyPanel strategy={prediction.recommendedStrategy} />}
            </div>
        );
    }
    else if (mode === 'PREP') {
        // PREP MODE LAYOUT (Category 3: LoL Drafting Assistant)
        LeftPanel = (
            <div className="panel-stack">
                <TeamChemistry />
                <div style={{ color: '#888', padding: 14, borderRadius: 12, background: 'rgba(10,17,40,0.55)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: 'Oswald', letterSpacing: 2, color: '#00C8FF' }}>COACH NOTES</div>
                    <div style={{ fontSize: '0.85rem', marginTop: 8, color: '#aaa' }}>
                        Click a recommendation to apply a pick/ban. Use the slider to rewind draft steps.
                    </div>
                </div>
            </div>
        );
        CenterPanel = (
            <div className="panel-stack" style={{ height: '100%' }}>
                <DraftCenter
                    draft={draft}
                    analysis={draftAnalysis}
                    timelineIndex={timeline.index}
                    timelineMax={Math.max(0, timeline.history.length - 1)}
                    onTimelineChange={handleTimelineChange}
                    onPickSlotClick={handlePickSlotClick}
                />
            </div>
        );
        RightPanel = (
            <div className="panel-stack">
                <DraftStrategyDeck
                    role={draftRole}
                    onRoleChange={setDraftRole}
                    action={draftAction}
                    onActionChange={setDraftAction}
                    recommendations={draftRecs}
                    onSelectRecommendation={(rec) => applyDraftAction(rec.name)}
                    onExport={handleExportStrategy}
                    analysis={draftAnalysis}
                />
            </div>
        );
    }
    else {
        // HISTORICAL MODE LAYOUT
        LeftPanel = (
            <div className="panel-stack">
                <div style={{ color: '#888', padding: 10, fontSize: '0.8rem', fontFamily: 'Oswald' }}>ARCHIVE SEARCH</div>
                <MatchSelector matches={[]} onSelectMatch={() => { }} /> {/* Empty for now or mock */}
            </div>
        );
        CenterPanel = (
            <div className="panel-stack" style={{ height: '100%' }}>
                <HistoricalView />
            </div>
        );
        RightPanel = (
            <div className="panel-stack">
                <div style={{ padding: 20, color: '#555' }}>
                    <h4 style={{ fontFamily: 'Oswald', color: '#00C8FF' }}>PERFORMANCE TRENDS</h4>
                    <HistoricalGraph data={[65, 62, 58, 60, 63, 68, 70, 65, 60, 55]} />
                </div>
            </div>
        );
    }

    const handleVoiceCommand = (text) => {
        const t = (text || '').toLowerCase();
        if (t.includes('switch') && t.includes('prep')) setMode('PREP');
        if (t.includes('switch') && t.includes('live')) setMode('LIVE');
        if (t.includes('switch') && (t.includes('history') || t.includes('historical'))) setMode('HISTORICAL');
    };

    return (
        <WarRoomLayout
            mode={mode}
            onModeChange={setMode}
            onVoiceCommand={handleVoiceCommand}
            leftPanel={LeftPanel}
            centerPanel={CenterPanel}
            rightPanel={RightPanel}
        />
    );
}

export default App;
