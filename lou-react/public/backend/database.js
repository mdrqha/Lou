// backend/database.js
const { Sequelize } = require('sequelize');

// Créer une nouvelle instance Sequelize
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres', // Choisir le dialecte pour PostgreSQL
});

// Vérifier la connexion à la base de données
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL réussie.');
  } catch (error) {
    console.error('Impossible de se connecter à PostgreSQL :', error);
  }
})();

module.exports = sequelize;
