// models/Offer.js
module.exports = (sequelize, DataTypes) => {
    const Offer = sequelize.define('Offer', {
      candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      jobRequisitionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      salary: {
        type: DataTypes.STRING,
        // allowNull: false
        allowNull: true
      },
      startDate: {
        type: DataTypes.DATEONLY,
        // allowNull: false
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
      },
      notes: DataTypes.TEXT
    });
  
    Offer.associate = function(models) {
      Offer.belongsTo(models.Candidate, {
        foreignKey: 'candidateId',
        as: 'candidate'
      });
      Offer.belongsTo(models.JobRequisition, {
        foreignKey: 'jobRequisitionId',
        as: 'jobRequisition'
      });
    };
  
    return Offer;
  };