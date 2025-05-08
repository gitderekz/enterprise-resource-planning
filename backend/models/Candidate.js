// models/candidate.js
module.exports = (sequelize, DataTypes) => {
    const candidate = sequelize.define('candidate', {
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

    candidate.associate = function(models) {
      candidate.belongsTo(models.jobrequisition, {
        foreignKey: 'jobRequisitionId',
        as: 'jobRequisition'
      });
      candidate.hasMany(models.interview, {
        foreignKey: 'candidateId',
        as: 'interviews'
      });
    };
    
    return candidate;
};