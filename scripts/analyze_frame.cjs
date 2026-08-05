const sharp = require('sharp');
const path = require('path');

const framePath = path.resolve(__dirname, '../public/anim/robot-teardown/frame_0001.png');

async function analyze() {
  const img = sharp(framePath);
  const meta = await img.metadata();
  console.log('Format:', meta.format, 'Channels:', meta.channels, 'Size:', meta.width + 'x' + meta.height);

  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return Array.from(data.slice(i, i + info.channels));
  };
  console.log('Top-left:', px(0, 0));
  console.log('Top-right:', px(info.width - 1, 0));
  console.log('Bottom-left:', px(0, info.height - 1));
  console.log('Bottom-right:', px(info.width - 1, info.height - 1));
  console.log('Center:', px(Math.floor(info.width / 2), Math.floor(info.height / 2)));
}
analyze().catch(console.error);
