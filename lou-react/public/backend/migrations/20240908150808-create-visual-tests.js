'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisualTests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      figmaUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      productUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stringArray1: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Tableau de chaînes de caractères
        allowNull: true,
      },
      stringArray2: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Deuxième tableau de chaînes
        allowNull: true,
      },
      jsonArray: {
        type: Sequelize.ARRAY(Sequelize.JSON), // Tableau contenant des objets JSON
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Nom de la table liée
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE', // Si l'utilisateur est supprimé, ses visual-tests sont également supprimés
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VisualTests');
  },
};
