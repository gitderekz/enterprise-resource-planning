'use strict';
module.exports = (sequelize, DataTypes) => {
  const performanceReview = sequelize.define('performanceReview', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    scores: {
      type: DataTypes.JSON,
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'performance_reviews'
  });

  performanceReview.associate = function(models) {
    performanceReview.belongsTo(models.user, {
      foreignKey: 'employeeId',
      as: 'employee'
    });
    performanceReview.belongsTo(models.user, {
      foreignKey: 'reviewerId',
      as: 'reviewer'
    });
  };

  return performanceReview;
};