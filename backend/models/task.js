'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  task.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    assigned_to: DataTypes.INTEGER,
    status: {type: DataTypes.ENUM('Pending','In Progress','Completed'),defaultValue:'Pending'},
    due_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'task',
  });
  return task;
};