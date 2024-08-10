const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

// Utiliser CORS pour permettre les requêtes cross-origin
app.use(cors());

// Définir une route pour interagir avec l'API Figma
app.get('/figma', async (req, res) => {
  const { fileId, nodeId } = req.query;
  const apiToken = 'figd_M4Ny2Cr5tJDJ0fqdz05l2WGG1z8amcV2pNOkM6NO';

  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`,
      {
        headers: {
          'X-Figma-Token': apiToken
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des données Figma:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.listen(port, () => {
  console.log(`Serveur proxy à l'écoute sur http://localhost:${port}`);
});
