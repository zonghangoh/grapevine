import { Context, Next } from 'koa';
import { User } from '../models';
import { verifyJWT } from '../utils/auth';

export const authoriseAdmin = async (ctx: Context, next: Next) => {
  await authenticate(ctx, next);

  if (!ctx.state.user?.admin) {
    ctx.status = 403;
    ctx.body = { error: 'Admin access required' };
  }
};

export const authenticate = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.cookies.get('auth-token');

    if (!token) {
      ctx.status = 401;
      ctx.body = { error: 'Authentication required' };
      return;
    }

    const decoded = verifyJWT(token);

    const user = await User.findByPk(decoded?.userId);

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'User not found' };
      return;
    }

    if (decoded?.passwordVersion !== user.passwordVersion) {
      ctx.status = 401;
      ctx.body = { error: 'Your password has been changed' };
      return;
    }

    ctx.state.user = user;

    await next();
  } catch (err: unknown) {
    ctx.status = 401;
    ctx.body = { error: err instanceof Error ? err.message : 'An unknown error occurred' };
  }
};
