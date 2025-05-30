// backend/models/customer.js
module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    lastPurchase: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return customer;
};