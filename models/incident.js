module.exports = (sequelize, DataTypes) => {
  const Incident = sequelize.define("Incident", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: { type: DataTypes.STRING, defaultValue: "Open" },
    reportedBy: DataTypes.INTEGER
  });

  Incident.associate = (models) => {
    Incident.belongsTo(models.User, { foreignKey: "reportedBy" });
    Incident.hasMany(models.ActionPlan, { foreignKey: "incidentId" });
  };

  return Incident;
};
