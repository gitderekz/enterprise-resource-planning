'use strict';
module.exports = (sequelize, DataTypes) => {
  const payroll = sequelize.define('payroll', {
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
      allowNull: true,
    },
    period: {
      type: DataTypes.STRING, // Format: 'YYYY-MM'
      allowNull: false,
    },
    grossSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deductions: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    netSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
      defaultValue: 'pending',
    },
    details: {
      type: DataTypes.JSON, // JSON string of payroll details
        defaultValue: {},
    }
  });

  payroll.associate = function(models) {
    payroll.belongsTo(models.user, {
      foreignKey: 'userId',
      // as: 'user',
      as: 'employee',
    });
  };

  return payroll;
};



// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const payroll = sequelize.define('payroll', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     employeeId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     month: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     grossSalary: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     deductions: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     netSalary: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
//       defaultValue: 'pending',
//     },
//   });

//   payroll.associate = function(models) {
//     // payroll.belongsTo(models.employee, {
//     payroll.belongsTo(models.user, {
//       foreignKey: 'employeeId',
//       as: 'employee',
//     });
//   };

//   return payroll;
// };