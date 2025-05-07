// models/Candidate.js
module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define('Candidate', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        isEmail: true
        }
    },
    phone: DataTypes.STRING,
    positionApplied: {
        type: DataTypes.STRING,
        allowNull: false
    },
    applicationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    resumeUrl: DataTypes.STRING,
    skills: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM('New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'),
        defaultValue: 'New'
    },
    notes: DataTypes.TEXT,
    source: DataTypes.STRING,
    jobRequisitionId: DataTypes.INTEGER
    });

    Candidate.associate = function(models) {
      Candidate.belongsTo(models.JobRequisition, {
        foreignKey: 'jobRequisitionId',
        as: 'jobRequisition'
      });
      Candidate.hasMany(models.Interview, {
        foreignKey: 'candidateId',
        as: 'interviews'
      });
    };
    
    return Candidate;
};