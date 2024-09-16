require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');         // Routes d'authentification

const app = express();

// Utiliser le middleware CORS
app.use(cors());

// Middleware pour parser les JSON
app.use(bodyParser.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 50005;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
