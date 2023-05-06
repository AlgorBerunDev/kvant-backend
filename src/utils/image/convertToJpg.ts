import sharp from 'sharp';

export default function convertToJpg(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).jpeg().toBuffer();
}
