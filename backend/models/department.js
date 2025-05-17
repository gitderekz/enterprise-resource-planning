'use strict';
module.exports = (sequelize, DataTypes) => {
  const department = sequelize.define('department', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  });

//   department.associate = function(models) {
//     department.hasMany(models.user, {
//       foreignKey: 'department_id',
//       as: 'users'
//     });
//   };

  return department;
};