'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
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
      // unique: true,
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
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'suspended'),
      defaultValue: 'active',
    },
    permissions: {
      // type: DataTypes.JSON,
      // defaultValue: {},
      type: DataTypes.ENUM('read', 'write', 'delete', 'approve', 'admin'),
      defaultValue: 'read',
    },
    department: {
      type: DataTypes.STRING,
      defaultValue: 'Employee',
    },
    gender: {
      type: DataTypes.ENUM('male','female'),
      defaultValue: 'male',
    },
    employment_type: {
      type: DataTypes.ENUM('part','contract','permanent'),
      defaultValue: 'permanent',
    },
    hireDate: {
      type: DataTypes.DATE,
    }
  });

  user.associate = function(models) {
    // define associations here if needed
    user.belongsTo(models.role, {
      foreignKey: 'role_id',
      as: 'role',
    });
    user.hasMany(models.payroll, {
      foreignKey: 'userId',
      as: 'payrolls',
    });
    user.hasMany(models.deduction, {
      foreignKey: 'userId',
      as: 'deductions',
    });

    // user.hasMany(models.invoice, {
    //   foreignKey: 'user_id',
    //   as: 'invoices',  
  };

  return user;
};


// 'use strict';
// const {
//   Model
// } = require('sequelize');
// // module.exports = (sequelize, DataTypes) => {
// //   class User extends Model {
// //     /**
// //      * Helper method for defining associations.
// //      * This method is not a part of Sequelize lifecycle.
// //      * The `models/index` file will call this method automatically.
// //      */
// //     static associate(models) {
// //       // define association here
// //     }
// //   }
// //   User.init({
// //     username: DataTypes.STRING,
// //     email: DataTypes.STRING,
// //     password: DataTypes.STRING,
// //     role_id: DataTypes.INTEGER
// //   }, {
// //     sequelize,
// //     modelName: 'User',
// //   });
// //   return User;
// // };
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db'); // assuming you have a configured sequelize instance

// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   role_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// });

// module.exports = User;
