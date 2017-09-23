module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
	password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	country: {
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