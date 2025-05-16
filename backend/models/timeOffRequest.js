'use strict';
module.exports = (sequelize, DataTypes) => {
  const timeOffRequest = sequelize.define('timeOffRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  timeOffRequest.associate = function(models) {
    timeOffRequest.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return timeOffRequest;
};