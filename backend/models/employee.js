'use strict';
module.exports = (sequelize, DataTypes) => {
  const employee = sequelize.define('employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baseSalary: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    position: {
      type: DataTypes.STRING,
    },
    hireDate: {
      type: DataTypes.DATE,
    }
  });

  employee.associate = function(models) {
    employee.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'role',
    });
    employee.hasMany(models.payroll, {
      foreignKey: 'employeeId',
      as: 'payrolls',
    });
    employee.hasMany(models.deduction, {
      foreignKey: 'employeeId',
      as: 'deductions',
    });
  };

  return employee;
};