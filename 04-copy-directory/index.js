const path = require('path');
const fs = require('fs');
const src = path.resolve(__dirname, './files');
const dst = path.resolve(__dirname, './files-copy');

// remove directory
fs.rm(dst, { recursive: true, force: true }, (err) => {
    if (err) throw err;

    // create directory
    fs.mkdir(dst, { recursive: true }, (err) => {
        if (err) throw err;
    });

    // copy files
    fs.readdir(src, {withFileTypes: true}, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            files.forEach(file => {
                if (file.isFile()) {
                    fs.copyFile(path.join(src, file.name), path.join(dst, file.name), (err) => {
                        if (err) throw err;
                        })
                }
            })
        }
    })
});