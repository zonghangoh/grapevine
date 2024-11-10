import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface AudioFileAttributes {
  id: number;
  title: string;
  description: string;
  userId: number;
  fileUrl: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

interface AudioFileCreationAttributes extends Optional<AudioFileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class AudioFile extends Model<AudioFileAttributes, AudioFileCreationAttributes> {
  declare id: number;
  declare title: string;
  declare description: string;
  declare userId: number;
  declare fileUrl: string;
  declare metadata: any;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate(models: any) {
    AudioFile.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }
}

export function initAudioFile(sequelize: Sequelize): typeof AudioFile {
  AudioFile.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    fileUrl: DataTypes.STRING,
    metadata: DataTypes.JSONB,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'AudioFile',
  });

  return AudioFile;
}

export default AudioFile;
