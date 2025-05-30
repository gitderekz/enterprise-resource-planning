module.exports = (sequelize, DataTypes) => {
  const collectiveInvestmentScheme = sequelize.define('collectiveInvestmentScheme', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    inceptionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    maturityDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    totalUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'suspended'),
      defaultValue: 'active'
    },
    managementFee: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    performanceFee: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    riskProfile: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  collectiveInvestmentScheme.associate = (models) => {
    collectiveInvestmentScheme.hasMany(models.cisInvestment, {
      foreignKey: 'schemeId',
      as: 'investments'
    });
    collectiveInvestmentScheme.hasMany(models.cisNav, {
      foreignKey: 'schemeId',
      as: 'navHistory'
    });
    collectiveInvestmentScheme.belongsToMany(models.customer, {
      through: models.cisInvestment,
      foreignKey: 'schemeId',
      otherKey: 'customerId'
    });
  };

  return collectiveInvestmentScheme;
};