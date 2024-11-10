import { User, AudioFile } from '../models';

declare module 'koa' {
  interface DefaultState {
    user: User;
    audioFile: AudioFile;
  }
}
