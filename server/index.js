require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuration
const CENTRAL_DATA_URL = 'https://api-op.grid.gg/central-data/graphql';
const STATS_DATA_URL = 'https://api-op.grid.gg/statistics-feed/graphql';
const API_KEY = process.env.GRID_API_KEY || 'XfPi0aihkbkuzU0ZGN1TdxMfeLh6vdDEIMPFs70W'; // User provided in prompt

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json'
};

// Helper for GraphQL requests
const headerWithAuth = { headers };

const fetchGraphQL = async (url, query, variables = {}) => {
  try {
    const response = await axios.post(url, { query, variables }, headerWithAuth);
    if (response.data.errors) {
      console.error('GraphQL Errors:', JSON.stringify(response.data.errors, null, 2));
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data;
  } catch (error) {
    console.error('API Request Failed:', error.message);
    if (error.response) {
      console.error('Data:', error.response.data);
    }
    throw error;
  }
};

// --- ROUTES ---

app.get('/', (req, res) => {
  res.send('ARTEMIS Backend is Running');
});

// 0. Core lists used by the Drafting Assistant (with safe fallback)
app.get('/api/tournaments', async (req, res) => {
  try {
    const query = `
      query GetTournaments($first: Int!) {
        tournaments(first: $first) {
          totalCount
          edges {
            node {
              id
              name
              nameShortened
            }
          }
        }
      }
    `;
    const data = await fetchGraphQL(CENTRAL_DATA_URL, query, { first: 15 });
    res.json({ tournaments: data.tournaments, isFallback: false });
  } catch (e) {
    res.json({
      isFallback: true,
      tournaments: {
        totalCount: 3,
        edges: [
          { node: { id: 'demo-worlds', name: 'Worlds 2024 (Demo)', nameShortened: 'WORLDS' } },
          { node: { id: 'demo-lcs', name: 'LCS Spring (Demo)', nameShortened: 'LCS' } },
          { node: { id: 'demo-lck', name: 'LCK Spring (Demo)', nameShortened: 'LCK' } }
        ]
      }
    });
  }
});

app.get('/api/players', async (req, res) => {
  try {
    const query = `
      query GetPlayers($first: Int!) {
        players(first: $first) {
          edges {
            node {
              id
              nickname
              title { name }
            }
          }
        }
      }
    `;
    const data = await fetchGraphQL(CENTRAL_DATA_URL, query, { first: 25 });
    res.json({ players: data.players, isFallback: false });
  } catch (e) {
    res.json({
      isFallback: true,
      players: {
        edges: [
          { node: { id: 'demo-top', nickname: 'Fudge', title: { name: 'League of Legends' } } },
          { node: { id: 'demo-jg', nickname: 'Blaber', title: { name: 'League of Legends' } } },
          { node: { id: 'demo-mid', nickname: 'Jojopyun', title: { name: 'League of Legends' } } },
          { node: { id: 'demo-bot', nickname: 'Berserker', title: { name: 'League of Legends' } } },
          { node: { id: 'demo-sup', nickname: 'Vulcan', title: { name: 'League of Legends' } } }
        ]
      }
    });
  }
});

// 1. Get today's matches (Live Schedule with Fallback)
app.get('/api/matches/today', async (req, res) => {
  // Try to get real data first
  try {
    const now = new Date();
    const next24 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dynamicQuery = `
            query GetAllSeriesInNext24Hours {
                allSeries(
                    filter:{
                      startTimeScheduled:{
                        gte: "${now.toISOString()}"
                        lte: "${next24.toISOString()}"
                      }
                    }
                    orderBy: StartTimeScheduled
                  ) {
                    totalCount,
                    edges{
                      node{
                        id
                        title { nameShortened }
                        tournament { nameShortened }
                        startTimeScheduled
                        format { nameShortened }
                        teams {
                            baseInfo { name }
                        }
                      }
                    }
                  }
            }
        `;
    const data = await fetchGraphQL(CENTRAL_DATA_URL, dynamicQuery);
    if (data.allSeries.totalCount > 0) {
      res.json(data);
    } else {
      throw new Error("No live matches found, using fallback.");
    }

  } catch (e) {
    console.log("Using Fallback Data (No live matches or API error)");
    // FALLBACK DEMO DATA
    res.json({
      allSeries: {
        totalCount: 1,
        edges: [
          {
            node: {
              id: "demo-g2-lev",
              title: { nameShortened: "VALORANT Champions Tour" },
              tournament: { nameShortened: "Alpha Group" },
              startTimeScheduled: new Date().toISOString(),
              format: { nameShortened: "Bo3" },
              teams: [
                { baseInfo: { name: "G2 Esports" } },
                { baseInfo: { name: "Leviatán" } }
              ]
            }
          },
          {
            node: {
              id: "demo-t1-gen",
              title: { nameShortened: "LCK Spring" },
              tournament: { nameShortened: "Regular Season" },
              startTimeScheduled: new Date(Date.now() + 3600000).toISOString(),
              format: { nameShortened: "Bo3" },
              teams: [
                { baseInfo: { name: "T1" } },
                { baseInfo: { name: "Gen.G" } }
              ]
            }
          }
        ]
      },
      isFallback: true
    });
  }
});

// 2. Get Team Insights (Mocked Analysis Layer)
app.get('/api/teams/:id/insights', (req, res) => {
  // Default to G2 context if not specified or random
  res.json({
    recentForm: ["W", "L", "W", "W", "L"],
    mapWinRates: [
      { map: "Bind", winRate: 67 },
      { map: "Haven", winRate: 45 },
      { map: "Ascent", winRate: 58 }
    ],
    avgRoundDuration: "1:42",
    playerSpotlight: {
      name: "Boaster",
      metric: "ACS",
      value: 245
    },
    winningPatterns: [
      { name: "Early Game Aggression", winRate: 73, champions: ["Lee Sin", "Lucian", "Leona"] },
      { name: "Late Game Scaling", winRate: 62, champions: ["Kayle", "Jinx", "Lulu"] }
    ]
  });
});

// 3. Generate Predictions (The "Brain") - DYNAMIC VERSION
app.post('/api/predict', (req, res) => {
  const { teamA, teamB } = req.body;
  const tA = teamA || "Team A";
  const tB = teamB || "Team B";

  // Simple hash function to generate consistent "random" numbers from team names
  const str = tA + tB;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash) % 100; // 0-99

  const winProbRaw = 0.4 + (seed / 200);
  const isTeamAFavored = seed > 40;

  const winner = isTeamAFavored ? tA : tB;
  const probability = isTeamAFavored ? winProbRaw : (1 - winProbRaw);
  const finalProb = isTeamAFavored ? winProbRaw : (winProbRaw + 0.1);
  const displayProb = Math.min(0.85, Math.max(0.52, finalProb));

  // Generate dynamic factors
  const factors = [
    { text: `${isTeamAFavored ? tA : tB} has superior objective control (+15%)`, type: "positive" },
    { text: `${isTeamAFavored ? tB : tA} struggling with early game tempo`, type: "positive" },
    { text: "Recent head-to-head favors " + winner, type: "neutral" }
  ];

  // Generate mock graph data
  const history = Array.from({ length: 10 }, (_, i) => {
    return 50 + (seed % 20) - 10 + (Math.sin(i) * 10);
  });

  res.json({
    winner: winner,
    probability: parseFloat(displayProb.toFixed(2)),
    keyFactors: factors,
    recommendedStrategy: {
      bans: ["Viper", "Raze", "Chamber"],
      picks: ["Jett", "Sova", "Omen"],
      playstyle: isTeamAFavored ? "Aggressive early invade" : "Scale for late game"
    },
    headToHead: {
      summary: `${isTeamAFavored ? tA : tB} leads ${seed % 5}-${seed % 3}`,
      lastMeeting: `2 months ago (${isTeamAFavored ? tA : tB} won)`
    },
    historicalWinRate: history
  });
});

// 4. War Room: What-If Analysis
app.post('/api/simulation/what-if', (req, res) => {
  // Mock logic: randomly generate a "better" or "worse" outcome
  const impact = Math.floor(Math.random() * 15) - 5; // -5% to +10%
  const isPositive = impact > 0;

  res.json({
    winProbabilityChange: isPositive ? `+${impact}%` : `${impact}%`,
    keyFactors: [
      isPositive ? "Counters enemy engage" : "Lower team synergy",
      isPositive ? "Better late game scaling" : "Vulnerable to early dive",
      "Coach Trust Score: " + (isPositive ? "High" : "Low")
    ]
  });
});

// 5. War Room: Team Chemistry
app.get('/api/players/chemistry', (req, res) => {
  res.json({
    teamScore: 84,
    pairs: [
      { p1: "Player A", p2: "Player B", score: 92, type: "Synergy", msg: "Excellent roam timing" },
      { p1: "Player C", p2: "Player D", score: 42, type: "Clash", msg: "Communication breakdown" }
    ],
    hotStreak: {
      player: "Player E",
      streak: 15,
      metric: "Kills"
    }
  });
});

// 6. War Room: Match Momentum
app.get('/api/match/momentum', (req, res) => {
  // Generate a swingy momentum curve
  const rounds = 12;
  const momentum = [];
  let current = 0;

  for (let i = 1; i <= rounds; i++) {
    // Random swing
    const swing = Math.floor(Math.random() * 20) - 8; // -8 to +12 (slight bias)
    current += swing;
    // Clamp
    current = Math.max(-100, Math.min(100, current));

    let label = "Even";
    if (current > 15) label = "G2 Adv";
    if (current < -15) label = "Lev Adv";
    if (Math.abs(swing) > 15) label = "CRITICAL MOMENT";

    momentum.push({
      round: i,
      value: current,
      label: label
    });
  }

  res.json({
    teamA: "G2 Esports",
    teamB: "Leviatán",
    currentMomentum: "+42%",
    trend: "Gaining fast",
    history: momentum
  });
});

// 7. Category 3 (LoL) - Drafting Assistant (Predict + Recommend)
// These endpoints are deterministic and safe for demos: if GRID is unavailable, the demo still works.

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const champKey = (c) => {
  if (!c) return '';
  if (typeof c === 'string') return c;
  return c.name || '';
};

const scoreDraft = ({ bluePicks = [], redPicks = [], blueBans = [], redBans = [] }) => {
  const b = bluePicks.map(champKey).filter(Boolean);
  const r = redPicks.map(champKey).filter(Boolean);
  const bb = blueBans.map(champKey).filter(Boolean);
  const rb = redBans.map(champKey).filter(Boolean);

  // Tiny deterministic heuristic model (demo-friendly)
  let prob = 0.50;

  // Tempo from draft completion
  prob += clamp((b.length - r.length) * 0.01, -0.05, 0.05);

  // Simple synergy pairs (illustrative, not “true”)
  const synergyPairs = [
    { a: 'Ashe', b: 'Braum', delta: 0.03, label: 'Ashe+Braum synergy' },
    { a: 'Jinx', b: 'Lulu', delta: 0.03, label: 'Jinx+Lulu scaling' },
    { a: 'Orianna', b: 'JarvanIV', delta: 0.03, label: 'Shockwave+Cataclysm wombo' },
    { a: 'Sejuani', b: 'Ashe', delta: 0.02, label: 'Pick potential' }
  ];

  let synergy = 0;
  for (const p of synergyPairs) {
    if (b.includes(p.a) && b.includes(p.b)) synergy += p.delta;
    if (r.includes(p.a) && r.includes(p.b)) synergy -= p.delta;
  }

  // Counter example: if enemy has Jinx and you have hard engage
  let counters = 0;
  if (r.includes('Jinx') && (b.includes('JarvanIV') || b.includes('Malphite'))) counters += 0.02;
  if (b.includes('Jinx') && (r.includes('JarvanIV') || r.includes('Malphite'))) counters -= 0.02;

  // Ban leverage: banning a highly recommended champ gives a small bump
  const highValue = ['JarvanIV', 'Sejuani', 'Maokai', 'Orianna', 'Jinx', 'Rell'];
  let banEdge = 0;
  banEdge += rb.filter((x) => highValue.includes(x)).length * 0.005; // red banned => helps blue slightly
  banEdge -= bb.filter((x) => highValue.includes(x)).length * 0.005; // blue banned => helps red slightly
  banEdge = clamp(banEdge, -0.03, 0.03);

  prob = clamp(prob + synergy + counters + banEdge, 0.15, 0.85);

  const shapValues = [
    {
      feature: 'Synergy',
      value: clamp(synergy, -0.08, 0.08),
      description: 'How well the picks combine (engage chains, scaling, wombo).'
    },
    {
      feature: 'Counterpicks',
      value: clamp(counters, -0.06, 0.06),
      description: 'Draft answers to enemy carries / win conditions.'
    },
    {
      feature: 'Draft Tempo',
      value: clamp((b.length - r.length) * 0.01, -0.05, 0.05),
      description: 'Earlier power spikes and proactive options from draft order.'
    },
    {
      feature: 'Ban Leverage',
      value: clamp(banEdge, -0.04, 0.04),
      description: 'Removing opponent comfort / meta picks increases stability.'
    }
  ];

  return { winProbability: Number(prob.toFixed(2)), shapValues };
};

app.post('/api/artemis/draft/predict', (req, res) => {
  const { bluePicks = [], redPicks = [], blueBans = [], redBans = [] } = req.body || {};
  const scored = scoreDraft({ bluePicks, redPicks, blueBans, redBans });
  res.json(scored);
});

app.post('/api/artemis/draft/recommend', (req, res) => {
  const { role = 'FLEX', side = 'blue', bluePicks = [], redPicks = [] } = req.body || {};
  const b = bluePicks.map(champKey);
  const r = redPicks.map(champKey);

  // Small curated pool with correct Data Dragon keys (demo-safe)
  const poolByRole = {
    TOP: ['Renekton', 'Gnar', 'Ornn', 'Camille', 'Malphite'],
    JUNGLE: ['Sejuani', 'Maokai', 'JarvanIV', 'Viego', 'LeeSin'],
    MID: ['Orianna', 'Azir', 'Syndra', 'Ryze', 'Ahri'],
    ADC: ['Jinx', 'Ashe', 'KaiSa', 'Aphelios', 'Ezreal'],
    SUPPORT: ['Braum', 'Rell', 'Nautilus', 'Lulu', 'Leona'],
    FLEX: ['Sejuani', 'Maokai', 'Orianna', 'Ashe', 'Braum']
  };

  const pool = poolByRole[role] || poolByRole.FLEX;

  const taken = new Set([...b, ...r].filter(Boolean));

  const recs = pool
    .filter((c) => !taken.has(c))
    .map((name) => {
      let score = 78;
      let type = 'Comfort';
      let reasoning = 'Stable blind pick with consistent teamfight value.';

      // illustrative counters/synergy
      if (r.includes('Jinx') && ['JarvanIV', 'Malphite', 'Rell'].includes(name)) {
        score += 12;
        type = 'Counter';
        reasoning = 'Strong engage to punish immobile hyper-carries.';
      }
      if (b.includes('Ashe') && ['Braum', 'Sejuani'].includes(name)) {
        score += 10;
        type = 'Synergy';
        reasoning = 'CC chain and pick tools amplify Ashe utility.';
      }
      if (role === 'JUNGLE' && ['Sejuani', 'Maokai'].includes(name)) {
        score += 6;
        type = 'Synergy';
        reasoning = 'Reliable frontline + engage improves draft stability.';
      }

      score = clamp(score, 60, 98);
      return { name, score, type, role, reasoning, side };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  res.json(recs);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
