// backend/models/performanceCriterion.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const performanceCriterion = sequelize.define('performanceCriterion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'performance_criteria'
  });

  return performanceCriterion;
};