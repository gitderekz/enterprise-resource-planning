// models/jobRequisition.js
module.exports = (sequelize, DataTypes) => {
    const jobrequisition = sequelize.define('jobrequisition', {
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

    jobrequisition.associate = function(models) {
      jobrequisition.hasMany(models.candidate, {
        foreignKey: 'jobRequisitionId',
        as: 'candidates'
      });
      jobrequisition.hasMany(models.interview, {
        foreignKey: 'jobRequisitionId',
        as: 'interviews'
      });
    };
  
    return jobrequisition;
  };