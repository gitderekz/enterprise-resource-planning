module.exports = (sequelize, DataTypes) => {
  const onboarding = sequelize.define('onboarding', {
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    completionDate: DataTypes.DATEONLY,
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'on_hold'),
      defaultValue: 'pending'
    },
    currentStage: {
      type: DataTypes.ENUM('paperwork', 'training', 'equipment', 'orientation', 'final_review'),
      defaultValue: 'paperwork'
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    notes: DataTypes.TEXT
  });

  onboarding.associate = function(models) {
    onboarding.belongsTo(models.candidate, {
      foreignKey: 'candidateId',
      as: 'candidate'
    });
    onboarding.belongsTo(models.user, {
      foreignKey: 'assignedTo',
      as: 'assignedUser'
    });
    onboarding.hasMany(models.onboardingtask, {
      foreignKey: 'onboardingId',
      as: 'tasks'
    });
  };

  return onboarding;
};