'use strict';
module.exports = (sequelize, DataTypes) => {
  const shift = sequelize.define('shift', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day: {
      type: DataTypes.ENUM(
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  shift.associate = function(models) {
    shift.belongsTo(models.department, {
      foreignKey: 'departmentId',
      as: 'department'
    });
    shift.belongsToMany(models.user, {
      through: 'shift_employees',
      as: 'employees',
      foreignKey: 'shiftId',
      otherKey: 'userId'
    });
  };

  return shift;
};