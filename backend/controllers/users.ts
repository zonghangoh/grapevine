import { Context } from 'koa';
import { User } from '../models';
import { deleteUserFiles } from '../utils/s3';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(12),
  password: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(12),
  password: Joi.string().min(6),
}).min(1);

const indexQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(9)
});

export const index = async (ctx: Context) => {
  try {
    const { error, value } = indexQuerySchema.validate(ctx.query);

    if (error) {
      ctx.status = 400;
      ctx.body = { error: error.details[0].message };
      return;
    }

    const { page, limit } = value;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      attributes: ['id', 'username', 'admin', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    ctx.body = {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit
      }
    };
  } catch (error: unknown) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};

export const create = async (ctx: Context) => {
  try {
    const { error, value } = createUserSchema.validate(ctx.request.body);

    if (error) {
      ctx.status = 400;
      ctx.body = { error: error.details[0].message };
      return;
    }

    const { username, password } = value;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, admin: false });

    const { password: _, ...userWithoutPassword } = user.toJSON();

    ctx.status = 201;
    ctx.body = userWithoutPassword;
  } catch (error: unknown) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};

export const update = async (ctx: Context) => {
  try {
    const { error: bodyError } = updateUserSchema.validate(ctx.request.body);
    if (bodyError) {
      ctx.status = 400;
      ctx.body = { error: bodyError.details[0].message };
      return;
    }

    const { id } = ctx.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    const { username, password } = ctx.request.body as { username?: string; password?: string };
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const passwordVersion = user.passwordVersion + 1;

    const updatedFields = {
      ...(username && { username }),
      ...(hashedPassword && { 
        password: hashedPassword ,
        passwordVersion: passwordVersion
      })
    };

    await user.update(updatedFields);

    const { password: _, passwordVersion: __, ...userWithoutPassword } = user.toJSON();
    ctx.body = userWithoutPassword;
  } catch (error: unknown) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};

export const destroy = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }

    await deleteUserFiles(id);
    await user.destroy();

    ctx.status = 200;
    ctx.body = { message: 'User deleted' };
  } catch (error: unknown) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};
