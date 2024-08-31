// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Assurez-vous que le chemin est correct

const app = express();

// Middleware pour parser les JSON
app.use(bodyParser.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 50005;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
