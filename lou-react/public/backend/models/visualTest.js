'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VisualTest extends Model {
    static associate(models) {
      // Associer le visual-test à l'utilisateur (Many-to-One)
      VisualTest.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }

  VisualTest.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Nom du test, obligatoire
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Description du test, optionnelle
    },
    figmaUrl: {
      type: DataTypes.STRING,
      allowNull: true, // URL Figma
    },
    productUrl: {
      type: DataTypes.STRING,
      allowNull: true, // URL du produit
    },
    stringArray1: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Premier tableau de chaînes de caractères
      allowNull: true,
    },
    stringArray2: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Deuxième tableau de chaînes de caractères
      allowNull: true,
    },
    jsonArray: {
      type: DataTypes.ARRAY(DataTypes.JSON), // Tableau où chaque ligne contient un JSON
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Nom de la table liée
        key: 'id',
      },
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'VisualTest',
  });

  return VisualTest;
};
