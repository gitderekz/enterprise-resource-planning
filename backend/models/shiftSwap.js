'use strict';
module.exports = (sequelize, DataTypes) => {
  const shiftSwap = sequelize.define('shiftSwap', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    fromShiftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    toShiftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedToId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  shiftSwap.associate = function(models) {
    shiftSwap.belongsTo(models.shift, { 
      as: 'fromShift',
      foreignKey: 'fromShiftId'
    });
    shiftSwap.belongsTo(models.shift, { 
      as: 'toShift',
      foreignKey: 'toShiftId'
    });
    shiftSwap.belongsTo(models.user, { 
      as: 'requester',
      foreignKey: 'requesterId'
    });
    shiftSwap.belongsTo(models.user, { 
      as: 'requestedTo',
      foreignKey: 'requestedToId'
    });
  };

  return shiftSwap;
};