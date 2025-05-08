// models/interview.js
module.exports = (sequelize, DataTypes) => {
const interview = sequelize.define('interview', {
    candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
    interviewer: {
    type: DataTypes.STRING,
    allowNull: false
    },
    interviewDate: {
    type: DataTypes.DATE,
    allowNull: false
    },
    interviewType: DataTypes.ENUM('Technical','HR','Managerial','Cultural Fit'),
    feedback: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    status: {
    type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled', 'Offer'),
    defaultValue: 'Scheduled'
    },
    jobRequisitionId: DataTypes.INTEGER
});

interview.associate = function(models) {
  interview.belongsTo(models.candidate, {
    foreignKey: 'candidateId',
    as: 'candidate'
  });
  interview.belongsTo(models.jobrequisition, {
    foreignKey: 'jobRequisitionId',
    as: 'jobRequisition'
  });
};

return interview;
};