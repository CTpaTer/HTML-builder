const path = require('path');
const fs = require('fs');
const src = path.resolve(__dirname, './styles');
const dst = path.resolve(__dirname, './project-dist', 'bundle.css');

fs.writeFile(dst,'', err => {if (err) throw err});
const output = fs.createWriteStream(dst);

fs.readdir(src, {withFileTypes: true}, (err, files) => {
  if (err) {
      console.log(err);
  } else {
      files.forEach(file => {
          if (file.isFile() && (path.extname(file.name) === '.css')) {
              let stream = fs.createReadStream(path.join(src, file.name), 'utf-8');
              stream.on('data', chunk => output.write(chunk + '\n'), (err) => {
                if (err) throw err;
              });
          }
      })
  }
});