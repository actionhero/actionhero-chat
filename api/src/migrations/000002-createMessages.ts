module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable("messages", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      fromId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      toId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      readAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },

  down: async function (migration) {
    await migration.dropTable("messages");
  },
};
