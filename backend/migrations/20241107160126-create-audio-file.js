const migration = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('AudioFiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      userId: {
        type: DataTypes.INTEGER
      },
      fileUrl: {
        allowNull: false,
        type: DataTypes.STRING
      },
      metadata: {
        type: DataTypes.JSONB
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

    await queryInterface.addIndex('AudioFiles', ['userId'], {
      name: 'audio_files_user_id_idx'
    });

    await queryInterface.addIndex('AudioFiles', ['createdAt'], {
      name: 'audio_files_created_at_idx'
    });

    await queryInterface.addIndex('AudioFiles', ['updatedAt'], {
      name: 'audio_files_updated_at_idx'
    });

    // Add GIN index for JSONB metadata for faster JSON operations
    await queryInterface.addIndex('AudioFiles', ['metadata'], {
      using: 'GIN',
      name: 'audio_files_metadata_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('AudioFiles', 'audio_files_metadata_idx');
    await queryInterface.removeIndex('AudioFiles', 'audio_files_created_at_idx');
    await queryInterface.removeIndex('AudioFiles', 'audio_files_user_id_idx');
    await queryInterface.dropTable('AudioFiles');
  }
};

module.exports = migration;
