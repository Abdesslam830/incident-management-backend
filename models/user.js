module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.STRING
  });

  User.associate = (models) => {
    User.hasMany(models.Incident, { foreignKey: "reportedBy" });
  };

  return User;
};
