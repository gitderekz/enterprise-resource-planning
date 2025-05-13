'use strict';
module.exports = (sequelize, DataTypes) => {
  const deduction = sequelize.define('deduction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('insurance', 'loan', 'tax', 'other'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isPercentage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  });

  deduction.associate = function(models) {
    deduction.belongsTo(models.user, {
      foreignKey: 'userId',
      // as: 'user',
      as: 'employee',
    });
  };

  return deduction;
};



// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const deduction = sequelize.define('deduction', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     employeeId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     type: {
//       type: DataTypes.ENUM('insurance', 'loan', 'tax', 'other'),
//       allowNull: false,
//     },
//     amount: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     isPercentage: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   });

//   deduction.associate = function(models) {
//     // deduction.belongsTo(models.employee, {
//     deduction.belongsTo(models.user, {
//       foreignKey: 'employeeId',
//       as: 'employee',
//     });
//   };

//   return deduction;
// };