module.exports = (sequelize, DataTypes) => {
  const cisInvestment = sequelize.define('cisInvestment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    units: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false
    },
    investmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    amountInvested: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    currentValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'redeemed', 'transferred'),
      defaultValue: 'active'
    },
    schemeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  cisInvestment.associate = (models) => {
    cisInvestment.belongsTo(models.collectiveInvestmentScheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    });
    cisInvestment.belongsTo(models.customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
  };

  return cisInvestment;
};
