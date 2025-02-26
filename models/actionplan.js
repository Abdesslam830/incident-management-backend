module.exports = (sequelize, DataTypes) => {
  const ActionPlan = sequelize.define("ActionPlan", {
    incidentId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    assignedTo: DataTypes.INTEGER,
    status: { type: DataTypes.STRING, defaultValue: "Pending" }
  });

  ActionPlan.associate = (models) => {
    ActionPlan.belongsTo(models.Incident, { foreignKey: "incidentId" });
  };

  return ActionPlan;
};
