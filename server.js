const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Load college data
let universities;
try {
  const dataPath = path.join(__dirname, 'data.json');
  const data = fs.readFileSync(dataPath, 'utf-8');
  universities = JSON.parse(data).universities; // Access the 'universities' array
} catch (err) {
  console.error('Error loading or parsing data.json:', err);
  universities = []; // Default to empty array if file load fails
}

// Get all universities
app.get('/api/universities', (req, res) => {
  res.json(universities);
});

// Get institutions by university name and state
app.get('/api/universities/:state', (req, res) => {
  const state = req.params.state.toLowerCase();
  const universityState = universities.find((u) => u.state.toLowerCase() === state);

  if (universityState) {
    res.json(universityState.institutions);
  } else {
    res.status(404).json({ message: 'State not found' });
  }
});

// Get institution by name
app.get('/api/institution/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  let foundInstitution = null;

  universities.forEach((university) => {
    const institution = university.institutions.find((i) =>
      i.name.toLowerCase().includes(name)
    );
    if (institution) {
      foundInstitution = institution;
    }
  });

  if (foundInstitution) {
    res.json(foundInstitution);
  } else {
    res.status(404).json({ message: 'Institution not found' });
  }
});

// Search institutions by state
app.get('/api/institutions/state/:state', (req, res) => {
  const state = req.params.state.toLowerCase();
  const institutionsInState = [];
  
  universities.forEach((university) => {
    university.institutions.forEach((institution) => {
      if (institution.location.toLowerCase().includes(state)) {
        institutionsInState.push(institution);
      }
    });
  });

  res.json(institutionsInState);
});

// Search institutions by trade
app.get('/api/institutions/trade/:trade', (req, res) => {
  const trade = req.params.trade.toLowerCase();
  const institutionsByTrade = [];

  universities.forEach((university) => {
    university.institutions.forEach((institution) => {
      if (institution.trades.some((t) => t.toLowerCase().includes(trade))) {
        institutionsByTrade.push(institution);
      }
    });
  });

  res.json(institutionsByTrade);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
