const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'));
    
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat('png')
      .toBuffer()
      .then(buffer => {
        return sharp(buffer)
          .toFile(path.join(__dirname, '../public/favicon.ico'));
      });

    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 