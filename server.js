// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();


// Connecter à MongoDB
connectDB();


// Routes
const homeRoutes = require('./routes/homeRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques depuis le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/home', homeRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
// Route de base
app.get('/', (req, res) => {
  res.send('API Portfolio en ligne');
});
console.log('Route de base configurée');
// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});