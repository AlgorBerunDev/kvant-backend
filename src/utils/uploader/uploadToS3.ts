import { S3 } from 'aws-sdk';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default async function uploadToS3({
  buffer,
  originalname,
}: {
  buffer: Buffer;
  originalname: string;
}): Promise<{
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}> {
  const s3 = new S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketEndpoint: true,
  });

  const extensionName = path.extname(originalname);
  const key = `${uuidv4()}${extensionName}`;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    Body: buffer,
  };

  return new Promise((resolve, reject) => {
    //TODO: add type err and data
    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.error('Error uploading file: ', err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
