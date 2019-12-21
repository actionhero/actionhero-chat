module.exports = {
  up: async function(migration, DataTypes) {
    await migration.createTable(
      "users",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },

        userName: {
          type: DataTypes.STRING(191),
          allowNull: false
        },

        email: {
          type: DataTypes.TEXT,
          allowNull: false
        },

        passwordHash: {
          type: DataTypes.TEXT,
          allowNull: true
        },

        lastLoginAt: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
      },
      {
        charset: "utf8mb4"
      }
    );

    await migration.addIndex("users", ["email"], {
      unique: true,
      fields: "email"
    });

    await migration.addIndex("users", ["userName"], {
      unique: true,
      fields: "userName"
    });
  },

  down: async function(migration) {
    await migration.dropTable("users");
  }
};
