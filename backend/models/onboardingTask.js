module.exports = (sequelize, DataTypes) => {
  const onboardingtask = sequelize.define('onboardingtask', {
    onboardingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'onboardings',
        key: 'id'
      }
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    dueDate: DataTypes.DATEONLY,
    completedDate: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'overdue'),
      defaultValue: 'pending'
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    }
  });

  onboardingtask.associate = function(models) {
    onboardingtask.belongsTo(models.onboarding, {
      foreignKey: 'onboardingId',
      as: 'onboarding'
    });
    onboardingtask.belongsTo(models.user, {
      foreignKey: 'assignedTo',
      as: 'assignedUser'
    });
  };

  return onboardingtask;
};