module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
	username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
	description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  User.associate = (models) => {
    User.hasMany(models.NoteItem, {
      foreignKey: 'noteId',
      as: 'noteItems',
    });
  };
  return User;
};