const { Sequelize } = require('sequelize');

// Créer une nouvelle instance Sequelize avec PostgreSQL
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    port: process.env.PG_PORT,
  }
);

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
