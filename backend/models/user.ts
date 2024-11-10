import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  admin: boolean
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare password: string;
  declare admin: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate(models: any) {
    User.hasMany(models.AudioFile, {
      foreignKey: 'userId',
    });
  }
}

export function initUser(sequelize: Sequelize): typeof User {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    admin: DataTypes.BOOLEAN,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
}

export default User;
