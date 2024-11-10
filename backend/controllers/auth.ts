import { Context } from 'koa';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { signJWT, setAuthCookie, removeAuthCookie } from '../utils/auth';
import Joi from 'joi';

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const verify = async (ctx: Context) => {
  const user = ctx.state.user;

  ctx.body = {
    userId: user.id,
    admin: user.admin,
    username: user.username
   };
};

export const login = async (ctx: Context) => {
  const { error, value } = loginSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    ctx.body = { error: error.details[0].message };
    return;
  }

  const { username, password } = value;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid username or password' };
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid username or password' };
    return;
  }

  const token = signJWT(user.id, user.admin);
  setAuthCookie(ctx, token);

  ctx.body = {
    userId: user.id,
    admin: user.admin,
    username: user.username
   };
};

export const logout = async (ctx: Context) => {
  removeAuthCookie(ctx);
  
  ctx.status = 200;
  ctx.body = { message: 'Successfully logged out' };
};