module.exports = (sequelize, DataTypes) => {
  const finance = sequelize.define('finance', {
    type: {
      type: DataTypes.ENUM(
        'income', 
        'expense', 
        'invoice', 
        'receipt', 
        'asset', 
        'liability',
        'cash-flow'
      ),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'paid', 'unpaid'),
      defaultValue: 'pending'
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    indexes: [
      {
        fields: ['date']
      },
      {
        fields: ['type']
      },
      {
        fields: ['category']
      },
      {
        fields: ['status']
      }
    ]
  });

  finance.associate = (models) => {
    finance.belongsTo(models.user, { foreignKey: 'userId' });
    finance.belongsTo(models.department, { foreignKey: 'departmentId' });
  };

  // Class methods
  finance.getCategories = async function() {
    return this.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      order: [['category', 'ASC']]
    });
  };

  return finance;
};



// module.exports = (sequelize, DataTypes) => {
//   const finance = sequelize.define('finance', {
//     type: {
//       type: DataTypes.ENUM('income', 'expense', 'invoice', 'receipt', 'cash_flow', 'report'),
//       allowNull: false
//     },
//     amount: {
//       type: DataTypes.DECIMAL(15, 2),
//       allowNull: false
//     },
//     date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     category: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
//       defaultValue: 'pending'
//     },
//     reference: {
//       type: DataTypes.STRING,
//       allowNull: true
//     },
//     metadata: {
//       type: DataTypes.JSON,
//       allowNull: true
//     }
//   });

//   finance.associate = (models) => {
//     finance.belongsTo(models.user, { foreignKey: 'userId' });
//     finance.belongsTo(models.department, { foreignKey: 'departmentId' });
//   };

//   return finance;
// };