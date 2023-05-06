import { S3 } from 'aws-sdk';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type RESPONSE_DATA_TYPE = {
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
};
//TODO: move all to /utils/s3
// export default const s3 = {upload, delete}
export default async function uploadToS3({
  buffer,
  originalname,
}: {
  buffer: Buffer;
  originalname: string;
}): Promise<RESPONSE_DATA_TYPE> {
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
    s3.upload(params, (err: any, data: RESPONSE_DATA_TYPE) => {
      if (err) {
        console.error('Error uploading file: ', err);
        reject(err);
      } else {
        resolve({
          ...data,
          Location: `${process.env.BUCKET_BASE_URL}${data.key}`,
        });
      }
    });
  });
}
