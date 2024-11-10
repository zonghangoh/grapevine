import { Sequelize } from 'sequelize';
import { initAudioFile } from './audioFile';
import { initUser } from './user';

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const AudioFile = initAudioFile(sequelize);
const User = initUser(sequelize);

export {
  AudioFile,
  User
};

export default sequelize;
