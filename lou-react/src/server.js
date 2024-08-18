// const express = require('express');
// const puppeteer = require('puppeteer');
// const cors = require('cors');

// const app = express();
// const port = 3002;

// // Définir un token en dur pour l'authentification Bearer
// const serverAuthToken = '1_HappyJames';

// // Définir les identifiants pour l'authentification HTTP basique
// const username = 'qha';
// const password = '1-happyJames';

// // Créer l'en-tête d'authentification basique
// const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

// // Utiliser CORS pour permettre les requêtes cross-origin
// app.use(cors());
// app.use(express.json());

// // Définir une route pour interagir avec l'API Figma
// app.get('/figma', async (req, res) => {
//   const { fileId, nodeId } = req.query;
//   const apiToken = 'figd_M4Ny2Cr5tJDJ0fqdz05l2WGG1z8amcV2pNOkM6NO';

//   try {
//     const response = await axios.get(
//       `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`,
//       {
//         headers: {
//           'X-Figma-Token': apiToken
//         }
//       }
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des données Figma:', error);
//     res.status(500).send('Erreur interne du serveur');
//   }
// });

// // Définir une route pour récupérer le DOM d'une page web avec Puppeteer
// app.post('/fetch-dom', async (req, res) => {
//   const url = req.body.url;

//   try {
//     // Lancer Puppeteer et ouvrir une nouvelle page
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Ajouter l'en-tête d'authentification HTTP basique si nécessaire
//     await page.setExtraHTTPHeaders({
//       'Authorization': authHeader
//     });

//     // Se rendre à l'URL et attendre que le réseau soit inactif pour s'assurer que tout est chargé
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Récupérer le contenu du DOM rendu
//     const domContent = await page.content();

//     // Fermer le navigateur
//     await browser.close();

//     // Envoyer le DOM récupéré en réponse
//     res.json({ dom: domContent });
//   } catch (error) {
//     console.error('Erreur lors de la récupération du DOM:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Serveur proxy à l'écoute sur http://localhost:${port}`);
// });

// const axios = require('axios');

// server.js
const puppeteer = require('puppeteer');

const getComputedStyles = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  const styles = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const computedStyles = Array.from(elements).map(element => {
      const styles = window.getComputedStyle(element);
      const styleObject = {};
      for (let i = 0; i < styles.length; i++) {
        styleObject[styles[i]] = styles.getPropertyValue(styles[i]);
      }
      return {
        tagName: element.tagName,
        styles: styleObject
      };
    });
    return computedStyles;
  });

  await browser.close();
  return styles;
};

module.exports = { getComputedStyles };
