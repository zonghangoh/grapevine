import { Context } from 'koa';
import { AudioFile } from '../models';
import { getUploadPresignedUrl, getDownloadPresignedUrl, getFileUrl, deleteFile } from '../utils/s3';
import { SUPPORTED_AUDIO_CATEGORIES } from '../config/grapevine';
import Joi from 'joi';
import { Op, Sequelize } from 'sequelize';

const uploadUrlSchema = Joi.object({
  fileName: Joi.string().required(),
  fileType: Joi.string().pattern(/^audio\//).required().messages({
    'string.pattern.base': 'Only audio files are allowed'
  })
});

const createAudioFileSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().allow('').max(500),
  key: Joi.string().required(),
  tags: Joi.array().items(
    Joi.string().valid(...SUPPORTED_AUDIO_CATEGORIES)
  ).default([])
});

const updateAudioFileSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  description: Joi.string().allow('').max(500),
  tags: Joi.array().items(
    Joi.string().valid(...SUPPORTED_AUDIO_CATEGORIES)
  ).default([])
});

const indexQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('').trim().default(''),
  tags: Joi.string().allow('').default('')
});

export const getUploadUrl = async (ctx: Context) => {
  try {
    const { error, value } = uploadUrlSchema.validate(ctx.request.body);

    if (error) {
      ctx.status = 400;
      ctx.body = { error: error.details[0].message };
      return;
    }

    const { fileName, fileType } = value;
    
    const { presignedUrl, key } = await getUploadPresignedUrl(
      ctx.state.user.id, fileName, fileType
    );
    
    ctx.body = { presignedUrl, key };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to generate pre-signed URL' };
  }
};

export const getDownloadUrl = async (ctx: Context) => {
  try {
    const audioFile = await AudioFile.findOne({
      where: {
        id: ctx.params.id,
        userId: ctx.state.user.id
      }
    });

    if (!audioFile) {
      ctx.status = 404;
      ctx.body = { error: 'Audio file not found or access denied' };
      return;
    }

    const presignedUrl = await getDownloadPresignedUrl(audioFile.metadata.key);
    ctx.body = { presignedUrl };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to generate pre-signed URL' };
  }
};

export const create = async (ctx: Context) => {
  try {
    const { error, value } = createAudioFileSchema.validate(ctx.request.body);

    if (error) {
      ctx.status = 400;
      ctx.body = { error: error.details[0].message };
      return;
    }

    const { title, description, key, tags } = value;
    const user = ctx.state.user;

    const fileUrl = getFileUrl(key);

    const audioFile = await AudioFile.create({
      title,
      description, 
      userId: user.id,
      fileUrl,
      metadata: { key, tags }
    });

    ctx.body = audioFile;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};
export const index = async (ctx: Context) => {
  try {
    const { error, value } = indexQuerySchema.validate(ctx.query);

    if (error) {
      ctx.status = 400;
      ctx.body = { error: error.details[0].message };
      return;
    }

    const { page, limit, search, tags } = value;
    const offset = (page - 1) * limit;
    const categoriesArray = tags.split(',').filter(Boolean);

    const whereClause = {
      userId: ctx.state.user.id,
      ...(search && {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ]
      }),
      ...(categoriesArray.length > 0 && {
        [Op.and]: Sequelize.where(
          Sequelize.cast(Sequelize.json('metadata.tags'), 'jsonb'),
          { [Op.contains]: JSON.stringify(categoriesArray) }
        )
      })
    };
  
    const { count, rows: audioFiles } = await AudioFile.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  
    const totalPages = Math.ceil(count / limit);
  
    ctx.body = {
      audioFiles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit
      }
    };
  } catch(error) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};

export const update = async (ctx: Context) => {
  try {
    const { error, value } = updateAudioFileSchema.validate(ctx.request.body);

    if (error) {
      ctx.status = 400;
      ctx.body = { error: error.details[0].message };
      return;
    }

    const audioFile = await AudioFile.findOne({
      where: {
        id: ctx.params.id,
        userId: ctx.state.user.id
      }
    });

    if (!audioFile) {
      ctx.status = 404;
      ctx.body = { error: 'Audio file not found or access denied' };
      return;
    }

    await audioFile.update({
      ...value,
      metadata: {
        ...audioFile.metadata,
        tags: value.tags
      }
    });

    ctx.body = audioFile;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};

export const destroy = async (ctx: Context) => {
  try {
    const audioFile = await AudioFile.findOne({
      where: {
        id: ctx.params.id,
        userId: ctx.state.user.id
      }
    });

    if (!audioFile) {
      ctx.status = 404;
      ctx.body = { error: 'Audio file not found or access denied' };
      return;
    }

    await deleteFile(audioFile.metadata.key);
    await audioFile.destroy();

    ctx.status = 200;
    ctx.body = { message: 'Audio file deleted' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};