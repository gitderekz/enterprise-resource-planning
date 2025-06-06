'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  inventory.init({
    material_name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    threshold: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'inventory',
  });
  return inventory;
};