import Sequelize from "sequelize";

export default {
  up: async (
    queryInterface: Sequelize.QueryInterface,
    DataTypes: typeof Sequelize
  ) => {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userName: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },

      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      passwordHash: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      lastLoginAt: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      fields: ["email"],
    });

    await queryInterface.addIndex("users", ["userName"], {
      unique: true,
      fields: ["userName"],
    });
  },

  down: async (queryInterface: Sequelize.QueryInterface) => {
    await queryInterface.dropTable("users");
  },
};
