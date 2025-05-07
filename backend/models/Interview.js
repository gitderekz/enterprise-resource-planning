// models/Interview.js
module.exports = (sequelize, DataTypes) => {
const Interview = sequelize.define('Interview', {
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

Interview.associate = function(models) {
  Interview.belongsTo(models.Candidate, {
    foreignKey: 'candidateId',
    as: 'candidate'
  });
  Interview.belongsTo(models.JobRequisition, {
    foreignKey: 'jobRequisitionId',
    as: 'jobRequisition'
  });
};

return Interview;
};