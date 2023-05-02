import sharp from 'sharp';

export default function convertToJpg(buffer) {
  return sharp(buffer).jpeg().toBuffer();
}
