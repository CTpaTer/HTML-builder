const path = require('path');
const fs = require('fs');
const src = path.resolve(__dirname, './secret-folder');

fs.readdir(src, {withFileTypes: true}, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (!file.isDirectory()) {
            fs.stat(path.join(src, file.name), (err, stats) => {
                if (err) {
                  console.log(err);
                }
                const fileName = path.parse(file.name).name;
                const fileExt = path.extname(file.name).slice(1);
               console.log(`${fileName} - ${fileExt} - ${(stats.size/1024).toFixed(3)}kb`)
            })
        }
      })
    }
});