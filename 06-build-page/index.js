const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const dstFolder = path.resolve(__dirname, './project-dist');
const srcIndex = path.resolve(__dirname, 'template.html');
const dstIndex = path.resolve(dstFolder, 'index.html');
const srcStyle = path.resolve(__dirname, './styles');
const dstStyle = path.resolve(dstFolder, 'style.css');

async function createFolders() {
  fs.mkdir(dstFolder, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
  });
}

async function createHtml() {
  fs.copyFile(srcIndex, dstIndex, (err) => {
    if (err) console.log(err);
  });

  fs.readFile(srcIndex, 'utf-8', (err, data) => {
    if (err) console.log(err);
  
    let templateData = data;
    const templateTags = data.match(/{{\w+}}/gm);
    for (let tag of templateTags) {
      const tagPath = path.join(__dirname,'components',`${tag.slice(2, -2)}.html`,
      );
  
      fs.readFile(tagPath, 'utf-8', (err, dataTag) => {
        if (err) console.log(err);
  
        templateData = templateData.replace(tag, dataTag);
  
        fs.rm(dstIndex, { recursive: true, force: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          const index = fs.createWriteStream(dstIndex);
          index.write(templateData);
        });
      });
    }
  });
}

async function createCssFile() {
  const output = fs.createWriteStream(dstStyle);

  fs.readdir(srcStyle, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        if (file.isFile() && (path.extname(file.name) === '.css')) {
          let stream = fs.createReadStream(path.join(srcStyle, file.name), 'utf-8');
          stream.on('data', chunk => output.write(chunk + '\n'), (err) => {
            if (err) console.log(err);
          });
        }
      });
    }
  });
}

async function copyAssetsDir(srcAssets = path.resolve(__dirname, './assets'),
  dstAssets = path.resolve(__dirname, 'project-dist', './assets')) {
    fs.rm(dstAssets, { recursive: true, force: true }, (err) => {
      if (err) console.log(err);
      fs.mkdir(dstAssets, { recursive: true }, async (err) => {
        if (err) console.log(err);
      });
      fs.readdir(srcAssets, { withFileTypes: true }, async (err, files) => {
        if (err) {
          console.log(err);
        } else {
            files.forEach(async (file) => {
              let srcAssetsTemp = path.resolve(srcAssets, file.name);
              let dstAssetsTemp = path.resolve(dstAssets, file.name);
              if (file.isDirectory()) {
                await copyAssetsDir(srcAssetsTemp, dstAssetsTemp);
              } else {
                await fsPromises.copyFile(srcAssetsTemp, dstAssetsTemp);
              }
            });
          }
      });
    });
}

async function createBundle() {
  await createFolders();
  await createHtml();
  await createCssFile();
  await copyAssetsDir();
}

createBundle();