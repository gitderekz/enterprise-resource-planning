'use strict';
module.exports = (sequelize, DataTypes) => {
  const attendance = sequelize.define('attendance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    check_in: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check_out: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'half_day', 'on_leave'),
      defaultValue: 'present',
    },
    attendance_status: {
      type: DataTypes.ENUM('on_time', 'late', 'early', 'overtime'),
    },
    time_difference: {
      type: DataTypes.INTEGER, // in minutes
    },
    notes: {
      type: DataTypes.TEXT,
    },
    work_hours: {
      type: DataTypes.FLOAT,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    device_info: {
      type: DataTypes.STRING,
    }
  }, {
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['check_in']
      }
    ]
  });

  attendance.associate = function(models) {
    attendance.belongsTo(models.user, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return attendance;
};