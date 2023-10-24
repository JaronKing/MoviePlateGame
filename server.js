const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/getSteamData/:steamId', async (req, res) => {
  try {
    const apiKey = 'YOUR_STEAM_API_KEY'; // Replace with your Steam API key
    const steamId = req.params.steamId;

    // Make a request to the Steam Web API to get user data
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});