// models/offer.js
module.exports = (sequelize, DataTypes) => {
    const offer = sequelize.define('offer', {
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
  
    offer.associate = function(models) {
      offer.belongsTo(models.candidate, {
        foreignKey: 'candidateId',
        as: 'candidate'
      });
      offer.belongsTo(models.jobrequisition, {
        foreignKey: 'jobRequisitionId',
        as: 'jobRequisition'
      });
    };
  
    return offer;
  };