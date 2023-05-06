import sharp from 'sharp';

export default function resize(
  file: { buffer: Buffer },
  size: number,
): Promise<Buffer> {
  const { buffer } = file;
  return sharp(buffer).resize(size).toBuffer();
}
