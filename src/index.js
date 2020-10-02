const fs = require('fs');
const input = JSON.parse(fs.readFileSync(process.argv[2]));
const ultrastar = require('./ultrastar');
const { checkDownloaded } = require('./check-downloaded');
checkDownloaded(input, true);
ultrastar.main(input).then(() => {checkDownloaded(input);});
