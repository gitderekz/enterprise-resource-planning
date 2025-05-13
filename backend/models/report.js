'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  report.associate = function(models) {
    report.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return report;
};