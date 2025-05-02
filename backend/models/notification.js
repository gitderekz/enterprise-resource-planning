module.exports = (sequelize, DataTypes) => {
    const notification = sequelize.define('notification', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userIds: {
        type: DataTypes.JSON, // Array of user IDs
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('task', 'approval', 'alert', 'info', 'urgent'),
        defaultValue: 'info'
      },
      title: DataTypes.STRING,
      message: DataTypes.TEXT,
      link: DataTypes.STRING,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      metadata: {
        type: DataTypes.JSON,
        defaultValue: {},
        get() {
          const rawValue = this.getDataValue('metadata');
          return rawValue || {};
        }
      }
    }, {
      timestamps: true,
      indexes: [
        {
          fields: ['userIds']
        },
        {
          fields: ['createdAt']
        }
      ]
    });
  
    return notification;
  };