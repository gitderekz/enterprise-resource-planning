'use strict';
module.exports = (sequelize, DataTypes) => {
  const performanceSetting = sequelize.define('performanceSetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1
    },
    reviewFrequency: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'biannually', 'annually'),
      defaultValue: 'quarterly'
    },
    ratingScale: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    selfAssessment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    peerAssessment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    managerAssessment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'performance_settings'
  });

  return performanceSetting;
};