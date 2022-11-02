const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const streamPath = path.resolve(__dirname, 'text.txt');

const output = fs.createWriteStream(streamPath);

stdout.write('Please, typing your text:\n')
stdin.on('data', data => {
    const text = data.toString().trim();
    if(text !== 'exit') {
        output.write(text + '\n');
    } else {
        process.exit();
    }
});
process.on('exit', () => stdout.write('Have a nice day!\n'));
process.on('SIGINT', () => process.exit());

stdin.on('error', error => console.log('Error', error.message));