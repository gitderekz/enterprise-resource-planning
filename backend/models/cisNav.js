module.exports = (sequelize, DataTypes) => {
  const cisNav = sequelize.define('cisNav', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    navPerUnit: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false
    },
    totalNAV: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    }
  }, {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['schemeId', 'date']
      }
    ]
  });

  cisNav.associate = (models) => {
    cisNav.belongsTo(models.collectiveInvestmentScheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    });
  };

  return cisNav;
};