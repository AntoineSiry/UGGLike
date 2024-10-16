import express from 'express';
import fetch from 'node-fetch';

const app = express();
const apiKey = 'api_key=RGAPI-4d872bb3-e592-410e-a2d2-bf919619cc2c';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permettre toutes les origines (utilise '*' pour autoriser toutes les requêtes)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Autoriser certains types de méthodes HTTP
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/getPUUID/:pseudo/:id', async (req, res) => {
  const { pseudo, id } = req.params;
  const link = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${pseudo}/${id}?${apiKey}`;

  try {
    const response = await fetch(link);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la requête à l\'API de Riot Games.' });
  }
});

app.get('/getPlayerInfo/:puuid', async (req, res) => {
  const { puuid } = req.params;
  const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?${apiKey}`;
  
  try{
    const response = await fetch(link);
    const data = await response.json();
    res.json(data);
  } catch(error) {
    res.status(500).json({ error: 'Erreur lors de la requête à l\'API de Riot Games.' });
  }
});

app.get('/getPlayerRankedInfo/:summonerId', async (req, res) => {
  const { summonerId } = req.params;
  const link = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?${apiKey}`;
  
  try{
    const response = await fetch(link);
    const data = await response.json();
    res.json(data);
  } catch(error) {
    res.status(500).json({ error: 'Erreur lors de la requête à l\'API de Riot Games.' });
  }
});

app.get('/getPlayerAccount/:puuid', async (req, res) => {
  const { puuid } = req.params;
  const link = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}?${apiKey}`;

  try{
    const response = await fetch(link);
    const data = await response.json();
    res.json(data);
  } catch(error) {
    res.status(500).json({ error: 'Erreur lors de la requête à l\'API de Riot Games.' });
  }
});

app.get('/getMatchBypuuid/:puuid', async (req, res) => {
  const { puuid } = req.params;
  const link = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&${apiKey}`;

  try {
    const response = await fetch(link);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la requête à l\'API de Riot Games.' });
  }
});

app.get('/getMatchByMatchId/:matchId', async (req, res) => {
  const { matchId } = req.params;
  const link = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?${apiKey}`;

  try {
    const response = await fetch(link);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la requête à l\'API de Riot Games.' });
  }
});

app.listen(3000, () => {
  console.log('Le serveur tourne sur http://localhost:3000');
});