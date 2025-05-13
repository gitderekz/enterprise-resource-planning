'use strict';
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  });

  role.associate = function(models) {
    role.hasMany(models.user, {
      foreignKey: 'role_id',
      as: 'users'
    });
  };

  return role;
};