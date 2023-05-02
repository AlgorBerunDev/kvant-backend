import sharp from 'sharp';

export default async function resize(file, sizes: number[]) {
  const { buffer } = file;

  const resizedPromiseImages = sizes.map((size) =>
    sharp(buffer).resize(size).toBuffer(),
  );

  return Promise.all(resizedPromiseImages);
}
