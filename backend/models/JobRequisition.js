// models/JobRequisition.js
module.exports = (sequelize, DataTypes) => {
    const JobRequisition = sequelize.define('JobRequisition', {
      position: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jobDescription: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      salaryRange: DataTypes.STRING,
      hiringManager: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('Draft', 'Open', 'Closed', 'Pending', 'Approved', 'Rejected'),
        defaultValue: 'Draft'
      }
    });

    JobRequisition.associate = function(models) {
      JobRequisition.hasMany(models.Candidate, {
        foreignKey: 'jobRequisitionId',
        as: 'candidates'
      });
      JobRequisition.hasMany(models.Interview, {
        foreignKey: 'jobRequisitionId',
        as: 'interviews'
      });
    };
  
    return JobRequisition;
  };