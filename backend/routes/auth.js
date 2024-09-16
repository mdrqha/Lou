// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, VisualTest } = require('../models'); // Assurez-vous que le chemin est correct

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  const { username, email, password, lang } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, lang });
    res.status(201).json({ message: 'Utilisateur créé avec succès !', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id, lang: user.lang }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route pour récupérer les informations de l'utilisateur
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'lang']  // Sélectionnez les champs nécessaires
    });
    // console.log(user)
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour mettre à jour la langue de l'utilisateur
router.put('/me/language', authenticateToken, async (req, res) => {
  const { language } = req.body;
  try {
    const user = await User.findByPk(req.user.id);  // Récupérer l'utilisateur à partir de l'ID du token
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.lang = language;  // Mettre à jour la langue
    await user.save();  // Enregistrer dans la base de données

    res.status(200).json({ message: 'Langue mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Créer un visual-test pour l'utilisateur authentifié
router.post('/visual-tests', authenticateToken, async (req, res) => {
  const { title, description, figmaUrl, productUrl, stringArray1, stringArray2, jsonArray } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const visualTest = await VisualTest.create({
      title,
      description,
      figmaUrl,
      productUrl,
      stringArray1,
      stringArray2,
      jsonArray,
      userId: user.id,
    });

    res.status(201).json(visualTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du visual-test' });
  }
});


router.get('/visual-tests', authenticateToken, async (req, res) => {
  try {
    const visualTests = await VisualTest.findAll({
      where: { userId: req.user.id }
    });

    if (!visualTests) {
      return res.status(404).json({ message: 'Aucun test visuel trouvé' });
    }

    res.status(200).json(visualTests);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des visual-tests' });
  }
});

router.put('/visual-tests/:id', authenticateToken, async (req, res) => {
  try {
      const { id } = req.params;
      const { title, figmaUrl, productUrl, stringArray1, stringArray2, jsonArray, percent } = req.body;

      const visualTest = await VisualTest.findOne({
          where: { id, userId: req.user.id }
      });

      if (!visualTest) {
          return res.status(404).json({ message: 'Visual test non trouvé' });
      }

      if (title !== undefined) visualTest.title = title;
      if (figmaUrl !== undefined) visualTest.figmaUrl = figmaUrl;
      if (productUrl !== undefined) visualTest.productUrl = productUrl;
      if (stringArray1 !== undefined) visualTest.stringArray1 = stringArray1;
      if (stringArray2 !== undefined) visualTest.stringArray2 = stringArray2;
      if (jsonArray !== undefined) visualTest.jsonArray = jsonArray;
      if (percent !== undefined) visualTest.percent = percent;

      await visualTest.save(); 
      
      res.status(200).json({ message: 'Visual test mis à jour avec succès', visualTest });
  } catch (error) {
      console.error('Erreur lors de la mise à jour du visual test:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du visual test' });
  }
});

router.delete('/visual-tests/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const visualTest = await VisualTest.findOne({
      where: { id, userId: req.user.id }
    });

    if (!visualTest) {
      return res.status(404).json({ message: 'Visual test non trouvé' });
    }

    await visualTest.destroy(); // Delete the visual test

    res.status(200).json({ message: 'Visual test supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du visual test:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du visual test' });
  }
});


module.exports = router;
