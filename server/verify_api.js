const axios = require('axios');

const test = async () => {
    try {
        console.log("Testing GET /api/matches/today...");
        const res1 = await axios.get('http://localhost:3001/api/matches/today');
        console.log("Status:", res1.status);
        console.log("Data keys:", Object.keys(res1.data));

        console.log("\nTesting POST /api/simulation/what-if...");
        const res2 = await axios.post('http://localhost:3001/api/simulation/what-if', {
            originalPick: "None",
            alternativePick: "Omen"
        });
        console.log("Status:", res2.status);
        console.log("Data:", JSON.stringify(res2.data));

    } catch (e) {
        console.error("FAILED:", e.message);
        if (e.response) console.error("Response:", e.response.data);
    }
};

test();
