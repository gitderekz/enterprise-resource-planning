'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define('menu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    menu_item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,  // New column for icon name
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER, // New column for hierarchical nesting
      allowNull: true,
      defaultValue: null,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  menu.associate = function(models) {
    menu.belongsTo(models.menu, { as: 'parent', foreignKey: 'parent_id' });
    menu.hasMany(models.menu, { as: 'children', foreignKey: 'parent_id' });
  };

  return menu;
};
