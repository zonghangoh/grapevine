import { PutObjectCommand, GetObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAME } from '../config/s3';

export const getUploadPresignedUrl = async (
  userId: string,
  fileName: string,
  fileType: string
): Promise<{ presignedUrl: string; key: string }> => {
  const key = `uploads/${userId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { presignedUrl, key };
};

export const getDownloadPresignedUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const getFileUrl = (key: string): string => {
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

export const deleteFile = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  await s3Client.send(command);
};

export const deleteUserFiles = async (userId: string): Promise<void> => {
  const prefix = `uploads/${userId}/`;
  
  try {
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: prefix
    };

    const { Contents = [] } = await s3Client.send(new ListObjectsV2Command(listParams));

    if (Contents.length === 0) return;

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key }))
      }
    };

    await s3Client.send(new DeleteObjectsCommand(deleteParams));
  } catch (error) {
    console.error('Error deleting user files:', error);
    throw error;
  }
};


export default {
  getUploadPresignedUrl,
  getDownloadPresignedUrl,
  getFileUrl
};