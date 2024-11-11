const migration = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      passwordVersion: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      admin: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });

    await queryInterface.addIndex('Users', ['username'], {
      unique: true,
      name: 'users_username_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Users', 'users_username_idx');
    await queryInterface.dropTable('Users');
  }
};

module.exports = migration;