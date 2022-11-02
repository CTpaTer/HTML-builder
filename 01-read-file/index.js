const path = require('path');
const fs = require('fs');
const { stdout } = process;

const streamPath = path.resolve(__dirname, 'text.txt');

const readableStream = fs.createReadStream(streamPath, 'utf-8');
readableStream.on('data', chunk => stdout.write(chunk));
